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

  private patientId!: string;
  private patientName = '';

  constructor(
    private fb: FormBuilder,
    private prescriptionService: PrescriptionService,
    private patientService: PatientService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private router: Router
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

      this.loadPatientName();
    //     this.patientService.getPatientById(this.patientId).subscribe({
    //   next: (patient: any) => (this.patientName = patient.name),
    //   error: () => this.notificationService.info('No history found'),
    // });
    });


        const currentUser = this.authService.getCurrentUser();

        console.log(currentUser, 'currentUser');
  }

  private loadPatientName(): void {
    this.patientService.getPatientById(this.patientId).subscribe({
      next: (patient: any) => (this.patientName = patient.name),
      error: () => this.notificationService.error('Failed to load patient'),
    });
  }

  private buildForm(): void {
    this.form = this.fb.group({
      date: [new Date(), Validators.required],
      followUpDate: [null],
      diagnosis: [''],
      advice: [''],
      items: this.fb.array([this.buildItem()]),
    });
  }

  private buildItem(): FormGroup {
    return this.fb.group({
      medicineId: [''],
      medicineName: ['', Validators.required],
      dosageForm: [''],
      strength: [''],
      dosage: ['', Validators.required],
      frequency: ['', Validators.required],
      duration: ['', Validators.required],
      notes: [''],
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

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notificationService.error('Please fill in all required fields.');
      return;
    }

    this.isSubmitting = true;
    const currentUser = this.authService.getCurrentUser();
    const value = this.form.value;

    const payload: Omit<Prescription, 'id'> = {
      patientId: this.patientId,
      patientName: this.patientName,
      doctorId: String(currentUser?.id ?? ''),
      doctorName: currentUser?.name ?? '',
      date: value.date,
      diagnosis: value.diagnosis,
      advice: value.advice,
      followUpDate: value.followUpDate,
      items: value.items,
      status: 'active',
    };

    console.log(payload);

    this.prescriptionService.create(payload).subscribe({
      next: () => {
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
}