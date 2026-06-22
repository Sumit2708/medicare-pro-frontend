import { Component } from '@angular/core';
import { MatFormField, MatLabel, MatHint, MatFormFieldModule } from '@angular/material/form-field';
import { MatSelect, MatOption } from '@angular/material/select';
import { MatCard } from '@angular/material/card';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AppointmentService } from '../../services/appointment.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { PatientService } from '../../../patients/services/patient.service';
import { DoctorService } from '../../../doctors/services/doctor.service';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule, MatDatepickerToggle, MatDatepickerActions, MatDatepicker, MatDatepickerInput } from '@angular/material/datepicker';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-add-appointment',
  imports: [
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    MatCard,
    MatHint,
    ReactiveFormsModule,
    MatInputModule,
    MatSelect,
    MatButton,
    CommonModule,
    MatDatepickerToggle,
    MatDatepickerActions,
    MatDatepicker,
    MatDatepickerInput,
    MatFormFieldModule, MatTimepickerModule, MatIcon
],
  templateUrl: './add-appointment.component.html',
  styleUrl: './add-appointment.component.scss',
})
export class AddAppointmentComponent {
  appointmentForm: FormGroup;
  doctors: any[] = [];
  patients: any[] = [];
minDate = new Date();
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private appointmentService: AppointmentService,
    private notificationService: NotificationService,
    private doctorService: DoctorService,
    private patientService: PatientService,
  ) {
    this.appointmentForm = this.fb.group({
      patientId: ['', { validators: [Validators.required] }],
      doctorId: ['', { validators: [Validators.required] }],
      date: ['', { validators: [Validators.required] }],
      time: ['', { validators: [Validators.required] }],
      notes: [''],
      status: ['Scheduled'],
    });
  }

  ngOnInit(): void {
    this.getDoctors();
    this.getPatients();
  }

    myFilter = (d: Date | null): boolean => {
    const day = (d || new Date()).getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  };

  getDoctors() {
    this.doctorService.getDoctors().subscribe({
      next: (res: any) => {
        this.doctors = res;
      },
      error: (error) => {
        this.notificationService.error('Failed to fetch doctors');
      },
    });
  }

  getPatients() {
    this.patientService.getPatients().subscribe({
      next: (res: any) => {
        this.patients = res;
        console.log('Patients fetched:', this.patients); // Log the fetched patients for debugging
      },
      error: (error) => {
        this.notificationService.error('Failed to fetch patients');
      },
    });
  }

  onSubmit() {
    if (this.appointmentForm.valid) {
      const appointmentData = this.appointmentForm.value;
      this.appointmentService.createAppointment(appointmentData).subscribe({
        next: () => {
          this.notificationService.success('Appointment created successfully');
          this.router.navigate(['/appointments']);
        },
        error: (error) => {
          this.notificationService.error('Failed to create appointment');
        },
      });
    }
  }
}
