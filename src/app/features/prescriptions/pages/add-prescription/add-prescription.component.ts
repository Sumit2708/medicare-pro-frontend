import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { MatCard } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { MedicineAutocompleteComponent } from '../../components/medicine-autocomplete/medicine-autocomplete.component';
import { Medicine, Prescription } from '../../model/prescription.model';
import { PrescriptionService } from '../../service/prescriptions.service';
import { PatientService } from '../../../patients/services/patient.service';
import { AuthService } from '../../../../core/services/auth/auth.service'; // adjust if path differs
import { NotificationService } from '../../../../core/services/notification/notification.service';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { AppointmentService } from '../../../appointments/services/appointment.service';
import { DoctorService } from '../../../doctors/services/doctor.service';

@Component({
  selector: 'app-add-prescription',
  standalone: true,
  imports: [
    CommonModule,
    MatCard,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatIconModule,
    MedicineAutocompleteComponent,
    PageHeaderComponent,
  ],
  templateUrl: './add-prescription.component.html',
  styleUrls: ['./add-prescription.component.scss'],
})
export class AddPrescriptionComponent implements OnInit {
  form!: FormGroup;
  isSubmitting = false;

  // Common dosage patterns — shown in the dropdown, but the field still
  // accepts free text for anything not in this list.
  readonly dosagePresets: string[] = [
    '1-0-1',
    '1-1-1',
    '0-0-1',
    '1-0-0',
    '0-1-0',
    '1-1-0',
    '0-1-1',
    '1-0-1-1',
    'SOS (as needed)',
    'Once daily',
    'Twice daily',
  ];

  private patientId!: string;
  private patientName = '';

  constructor(
    private fb: FormBuilder,
    private prescriptionService: PrescriptionService,
    private patientService: PatientService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private router: Router,
    private appointmentService: AppointmentService,
    private doctorService: DoctorService,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: any) => {
      this.patientId = params['patientId'];

      if (!this.patientId) {
        this.notificationService.error('No patient selected');
        this.router.navigate(['/patients']);
        return;
      }

      this.buildForm();
      this.loadPatientData(this.patientId);
    });
  }

  private buildForm(): void {
    const defaultDate = new Date();

    this.form = this.fb.group({
      date: [defaultDate, Validators.required],
      followUpDate: [this.addMonths(defaultDate, 1)],
      diagnosis: [''],
      advice: [''],
      items: this.fb.array([this.buildItem()]),
    });

    // Keep follow-up date defaulted to "1 month after visit" whenever the
    // visit date changes — but only while the user hasn't touched the
    // follow-up field themselves.
    this.form.get('date')!.valueChanges.subscribe((newDate: Date) => {
      const followCtrl = this.form.get('followUpDate')!;
      if (newDate && !followCtrl.dirty) {
        followCtrl.setValue(this.addMonths(newDate, 1), { emitEvent: false });
      }
    });
  }

  private buildItem(): FormGroup {
  const group = this.fb.group({
    medicineId: [''],
    medicineName: ['', Validators.required],
    dosageForm: [''],
    strength: [''],
    dosage: ['', Validators.required],
    frequency: ['', Validators.required],
    duration: ['', Validators.required],
    quantity: ['', Validators.required],
    notes: [''],
  });

  const recalc = () => {
    const qty:any = this.calculateQuantity(
      group.get('dosage')!.value,
      group.get('duration')!.value,
    );

    if (qty !== null) {
      group.get('quantity')!.setValue(qty, { emitEvent: false });
    }
  };

  group.get('dosage')!.valueChanges.subscribe(recalc);
  group.get('duration')!.valueChanges.subscribe(recalc);

  return group;
}

  // "1-0-1" -> 2 doses/day. "1-0-1-1" -> 3. "Once daily" -> 1, "Twice daily" -> 2.
  // "SOS (as needed)" or anything unparseable -> null (leave quantity manual).
  private parseDosesPerDay(dosage: string | null): number | null {
    if (!dosage) return null;
    const value = dosage.trim().toLowerCase();

    if (value === 'once daily') return 1;
    if (value === 'twice daily') return 2;
    if (value.includes('sos')) return null;

    const numbers = value.split('-').map((p) => parseFloat(p.trim()));
    if (numbers.length > 0 && numbers.every((n) => !isNaN(n))) {
      return numbers.reduce((sum, n) => sum + n, 0);
    }
    return null;
  }

  // "5 days" -> 5, "2 weeks" -> 14, "1 month" -> 30. Returns null if no
  // recognizable unit is found (free text like "till symptoms resolve").

  private parseDurationDays(duration: string | null): number | null {
    if (!duration) return null;
    const match = duration
      .trim()
      .toLowerCase()
      .match(/(\d+(\.\d+)?)\s*(day|week|month)/);
    if (!match) return null;

    const amount = parseFloat(match[1]);
    if (match[3].startsWith('day')) return amount;
    if (match[3].startsWith('week')) return amount * 7;
    return amount * 30; // month
  }

  private calculateQuantity(
    dosage: string | null,
    duration: string | null,
  ): number | null {
    const dosesPerDay = this.parseDosesPerDay(dosage);
    const days = this.parseDurationDays(duration);
    if (dosesPerDay === null || days === null) return null;
    return Math.round(dosesPerDay * days);
  }

  get items(): FormArray {
    return this.form.get('items') as FormArray;
  }

  asGroup(control: AbstractControl): FormGroup {
    return control as FormGroup;
  }

  medicineControl(item: AbstractControl): FormControl {
    return this.asGroup(item).get('medicineName') as FormControl;
  }

  addItem(): void {
    this.items.push(this.buildItem());
  }

  removeItem(index: number): void {
    if (this.items.length > 1) this.items.removeAt(index);
  }

  onMedicineSelected(index: number, med: Medicine): void {
    this.items.at(index).patchValue({
      medicineId: med.id,
      medicineName: med.name,
      dosageForm: med.dosageForm ?? '',
      strength: med.strength ?? '',
    });
  }

  onAddNewMedicine(index: number, name: string): void {
    this.prescriptionService
      .addMedicine({ name })
      .subscribe((med) => this.onMedicineSelected(index, med));
  }

  // Follow-up date can only be moved within [visit date, visit date + 2 months]
  minFollowUpDate(): Date {
    return this.form.get('date')?.value ?? new Date();
  }

  maxFollowUpDate(): Date {
    const base = this.form.get('date')?.value ?? new Date();
    return this.addMonths(base, 2);
  }

  private addMonths(date: Date, months: number): Date {
    const d = new Date(date);
    d.setMonth(d.getMonth() + months);
    return d;
  }

  private loadPatientData(patientId: string): void {
    this.prescriptionService.loadPatientData(patientId).subscribe({
      next: (data) => {
        console.log('Loaded patient data:', data);
        this.patientName = this.prescriptionService.patient?.name ?? '';
      },
      error: (err: Error) => {
        this.notificationService.error(
          err.message || 'Failed to load patient data',
        );
      },
    });
  }

  getDoctorName(doctorID: any) {
    return this.doctorService.getDoctorById(doctorID).subscribe({
      next: (doctor) => {
        console.log('Loaded doctor data:', doctor);
        return doctor.name;
      },
      error: () => {
        return '';
      },
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notificationService.error('Please fill in all required fields.');
      return;
    }

    const appointment = this.prescriptionService.appointment;
    if (!appointment) {
      this.notificationService.error(
        'No appointment loaded for this prescription',
      );
      return;
    }

    this.isSubmitting = true;
    // const currentUser = this.authService.getCurrentUser();
    const value = this.form.value;

    const doctorName = this.getDoctorName(appointment.doctorId);

    const payload: Omit<Prescription, 'id'> = {
      patientId: this.patientId,
      patientName: this.patientName,
      appointmentId: appointment.id,
      doctorId: appointment.doctorId,
      doctorName: doctorName as unknown as string, // Type assertion to string
      date: value.date,
      diagnosis: value.diagnosis,
      advice: value.advice,
      followUpDate: value.followUpDate,
      items: value.items,
      status: 'active',
    };

    this.prescriptionService.create(payload).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.notificationService.success('Prescription saved successfully');
        this.goBackToPatient();
      },
      error: () => {
        this.notificationService.error('Failed to save prescription');
        this.isSubmitting = false;
      },
    });
  }

  onCancel(): void {
    this.goBackToPatient();
  }

  private goBackToPatient(): void {
    this.router.navigate(['/patients/edit'], {
      queryParams: { id: this.patientId, tab: 'prescriptions' },
    });
  }

  navBack(): void {
    window.history.back();
  }
}
