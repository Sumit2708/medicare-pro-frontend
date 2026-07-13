import { Component } from '@angular/core';
import {
  MatFormField,
  MatLabel,
  MatHint,
  MatFormFieldModule,
} from '@angular/material/form-field';
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
import { NotificationService } from '../../../../core/services/notification/notification.service';
import { PatientService } from '../../../patients/services/patient.service';
import { DoctorService } from '../../../doctors/services/doctor.service';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import {
  MatDatepickerModule,
  MatDatepickerToggle,
  MatDatepickerActions,
  MatDatepicker,
  MatDatepickerInput,
} from '@angular/material/datepicker';
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
    MatButton,
    CommonModule,
    MatDatepickerToggle,
    MatDatepickerActions,
    MatDatepicker,
    MatDatepickerInput,
    MatFormFieldModule,
    MatTimepickerModule,
    MatIcon,
  ],
  templateUrl: './add-appointment.component.html',
  styleUrl: './add-appointment.component.scss',
})
export class AddAppointmentComponent {
  appointmentForm: FormGroup;
  doctors: any[] = [];
  patients: any[] = [];
  minDate = new Date();

  maxDate = new Date(new Date().setDate(new Date().getDate() + 7));

  timeSlots = [
    '09:00 AM',
    '09:30 AM',
    '10:00 AM',
    '10:30 AM',
    '11:00 AM',
    '11:30 AM',
    '12:00 PM',
    '12:30 PM',
    '01:00 PM',
    '01:30 PM',
    '02:00 PM',
    '02:30 PM',
    '03:00 PM',
    '03:30 PM',
    '04:00 PM',
    '04:30 PM',
    '05:00 PM',
    '05:30 PM',
  ];

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
      notes: ['', Validators.maxLength(250)],
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
    // Existing Appointment slot validation
    this.appointmentService.getAppointments().subscribe({
      next: (appointments: any) => {
        const form = this.appointmentForm.value;

        const existingAppointment = appointments.some(
          (a: any) =>
            a.doctorId === form.doctorId &&
            new Date(a.date).toDateString() ===
              new Date(form.date!).toDateString() &&
            a.time === form.time,
        );

        if (existingAppointment) {
          this.notificationService.error(
            'Doctor is already booked for the selected date and time.',
          );
          return;
        }

        this.appointmentService.createAppointment(form).subscribe({
          next: () => {
            this.notificationService.success(
              'Appointment created successfully',
            );
            this.router.navigate(['/appointments']);
          },
          error: () => {
            this.notificationService.error('Failed to create appointment');
          },
        });
      },
    });
  }
  // getExistingAppointment() {

  // }
}
