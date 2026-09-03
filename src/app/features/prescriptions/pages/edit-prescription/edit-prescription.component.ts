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
import { AuthService } from '../../../../core/services/auth/auth.service'; // adjust if path differs
import { NotificationService } from '../../../../core/services/notification/notification.service';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-edit-prescription',
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
  templateUrl: './edit-prescription.component.html',
  styleUrls: ['./edit-prescription.component.scss'],
})
export class EditPrescriptionComponent implements OnInit {
  form!: FormGroup;
  isSubmitting = false;
  isLoading = false;
  appointmentId:any;

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

  private prescriptionId!: string;
  private patientId!: string;

  constructor(
    private fb: FormBuilder,
    private prescriptionService: PrescriptionService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: any) => {
      console.log('Query params:', params);
      this.prescriptionId = params['id'];
      this.patientId = params['patientId'];

      if (!this.prescriptionId || !this.patientId) {
        this.notificationService.error('Prescription not found');
        this.router.navigate(['/patients']);
        return;
      }

      this.buildForm();
      this.loadPrescription();
    });
  }

  private loadPrescription(): void {
    this.isLoading = true;
    this.prescriptionService.getById(this.prescriptionId).subscribe({
      next: (p) => {
        this.patchForm(p);
        console.log('Loaded prescription:', p);
        this.appointmentId = p.appointmentId;
        this.isLoading = false;
      },
      error: () => {
        this.notificationService.error('Failed to load prescription');
        this.isLoading = false;
      },
    });
  }

  private buildForm(): void {
    this.form = this.fb.group({
      date: [new Date(), Validators.required],
      followUpDate: [null],
      diagnosis: [''],
      advice: [''],
      items: this.fb.array([]),
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

  private buildItem(item?: Partial<Prescription['items'][number]>): FormGroup {
    return this.fb.group({
      medicineId: [item?.medicineId ?? ''],
      medicineName: [item?.medicineName ?? '', Validators.required],
      dosageForm: [item?.dosageForm ?? ''],
      strength: [item?.strength ?? ''],
      dosage: [item?.dosage ?? '', Validators.required],
      frequency: [item?.frequency ?? '', Validators.required],
      duration: [item?.duration ?? '', Validators.required],
      notes: [item?.notes ?? ''],
    });
  }

  private patchForm(p: Prescription): void {
    this.items.clear();
    p.items.forEach((item) => this.items.push(this.buildItem(item)));

    const visitDate = new Date(p.date);
    // If this prescription never had a follow-up date set, default it to
    // one month after the visit — same rule as a brand-new prescription.
    const followUp = p.followUpDate ? new Date(p.followUpDate) : this.addMonths(visitDate, 1);

    this.form.patchValue({
      date: visitDate,
      followUpDate: followUp,
      diagnosis: p.diagnosis,
      advice: p.advice,
    });
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
    this.prescriptionService.addMedicine({ name }).subscribe((med) => this.onMedicineSelected(index, med));
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

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notificationService.error('Please fill in all required fields.');
      return;
    }

    this.isSubmitting = true;
    const currentUser = this.authService.getCurrentUser();
    const value = this.form.value;

    const payload: Partial<Prescription> = {
      doctorId: String(currentUser?.id ?? ''),
      doctorName: currentUser?.name ?? '',
      date: value.date,
      diagnosis: value.diagnosis,
      advice: value.advice,
      followUpDate: value.followUpDate,
      items: value.items,
    };

    this.prescriptionService.update(this.prescriptionId, payload).subscribe({
      next: () => {
        this.notificationService.success('Prescription updated successfully');
        this.goBackToPatient();
      },
      error: () => {
        this.notificationService.error('Failed to update prescription');
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

  navBack() {
     this.router.navigate(['/appointments/edit'], {
      queryParams: { id: this.appointmentId },
    });
  }
}