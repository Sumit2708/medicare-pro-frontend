import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { PatientService } from '../../services/patient.service';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { NotificationService } from '../../../../core/services/notification/notification.service';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-add-patient',
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
  templateUrl: './add-patient.component.html',
  styleUrl: './add-patient.component.scss',
})
export class AddPatientComponent {
  patientForm: FormGroup;
  isSubmitting = false;

  bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  constructor(
    private router: Router,
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

  get initials(): string {
    const name = this.patientForm.value.name || '';
    const parts = name.trim().split(' ').filter(Boolean);
    if (!parts.length) return 'P';
    return parts.slice(0, 2).map((p: string) => p[0].toUpperCase()).join('');
  }

  onSubmit() {
    if (this.patientForm.valid) {
      this.isSubmitting = true;
      this.patientService.addPatient(this.patientForm.value).subscribe({
        next: (res: any) => {
          this.notificationService.success(`Patient ${res.name} added successfully`);
          this.router.navigate(['/patients']);
        },
        error: () => {
          this.isSubmitting = false;
          this.notificationService.error('Failed to add patient');
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