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
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-add-doctor',
  imports: [
    MatCard,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
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
    private snackbar: MatSnackBar,
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
      this.doctorService.addDoctor(this.doctorForm.value).subscribe({
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
