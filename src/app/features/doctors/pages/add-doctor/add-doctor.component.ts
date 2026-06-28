import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DoctorService } from '../../services/doctor.service';
import { Router } from '@angular/router';
import { Doctor } from '../../../../shared/models/doctor.model';
import { NotificationService } from '../../../../core/services/notification/notification.service';
import { PageHeaderComponent } from "../../../../shared/components/page-header/page-header.component";

@Component({
  selector: 'app-add-doctor',
  imports: [
    MatCard,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    PageHeaderComponent
],
  templateUrl: './add-doctor.component.html',
  styleUrl: './add-doctor.component.scss',
})
export class AddDoctorComponent {
  doctorForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private doctorService: DoctorService,
    private router: Router,
    private notificationService: NotificationService,
  ) {
    this.doctorForm = this.fb.group({
      name: ['', Validators.required],
      specialization: ['', Validators.required],
      fee: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.doctorForm.valid) {
      const doctor: Doctor = {
        ...this.doctorForm.value,
        status: 'Active',
      };

      this.doctorService.addDoctor(doctor).subscribe({
        next: (res: any) => {
          this.notificationService.success(
            `Doctor ${res.name} added successfully`,
          );

          this.router.navigate(['/doctors']);
        },

        error: () => {
          this.notificationService.error(
            'Failed to add doctor. Please try again.',
          );
        },
      });
    } else {
      this.notificationService.error('Please fill in all required fields.');
    }
  }
}
