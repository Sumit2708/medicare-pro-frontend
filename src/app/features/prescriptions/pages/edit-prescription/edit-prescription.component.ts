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

    this.form.patchValue({
      date: new Date(p.date),
      followUpDate: p.followUpDate ? new Date(p.followUpDate) : null,
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
}