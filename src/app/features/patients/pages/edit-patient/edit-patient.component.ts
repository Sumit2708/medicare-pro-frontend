import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientService } from '../../services/patient.service';
import { NotificationService } from '../../../../core/services/notification/notification.service';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-edit-patient',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    PageHeaderComponent,
  ],
  templateUrl: './edit-patient.component.html',
  styleUrl: './edit-patient.component.scss',
})
export class EditPatientComponent {
  patientForm: FormGroup;
  patientId = '';
  isLoading = true;
  isSubmitting = false;

  bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private patientService: PatientService,
    private notificationService: NotificationService,
  ) {
    this.patientForm = this.fb.group({
      name: ['', Validators.required],
      age: ['', Validators.required],
      gender: ['', Validators.required],
      mobile: ['', Validators.required],
      alternateMobile: [''],
      bloodGroup: [''],
      address: [''],
      medicalHistory: [''],
      status: ['Active'],
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.patientId = params['id'];
      if (this.patientId) {
        this.getPatientById();
      }
    });
  }

  get initials(): string {
    const name = this.patientForm.value.name || '';
    const parts = name.trim().split(' ').filter(Boolean);
    if (!parts.length) return 'P';
    return parts.slice(0, 2).map((p: string) => p[0].toUpperCase()).join('');
  }

  getPatientById() {
    this.patientService.getPatientById(this.patientId as any).subscribe({
      next: (patient: any) => {
        this.patientForm.patchValue(patient);
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.notificationService.error('Failed to load patient details.');
      },
    });
  }

  onSubmit() {
    if (this.patientForm.valid) {
      this.isSubmitting = true;
      this.patientService.updatePatient(this.patientId as any, this.patientForm.value).subscribe({
        next: (res: any) => {
          this.notificationService.success(`Patient ${res.name} updated successfully`);
          this.router.navigate(['/patients']);
        },
        error: () => {
          this.isSubmitting = false;
          this.notificationService.error('Failed to update patient');
        },
      });
    } else {
      this.patientForm.markAllAsTouched();
      this.notificationService.error('Please fill all required fields');
    }
  }

  navtoPatientList() {
    this.router.navigate(['/patients']);
  }
}