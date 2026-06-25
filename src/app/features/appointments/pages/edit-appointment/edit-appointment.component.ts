import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCard } from '@angular/material/card';
import { MatFormField, MatLabel, MatHint } from '@angular/material/form-field';
import { MatSelect, MatOption } from '@angular/material/select';
import {
  MatTimepickerInput,
  MatTimepickerToggle,
  MatTimepicker,
} from '@angular/material/timepicker';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AppointmentService } from '../../services/appointment.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { DoctorService } from '../../../doctors/services/doctor.service';
import { PatientService } from '../../../patients/services/patient.service';
import {
  MatDatepicker,
  MatDatepickerToggle,
  MatDatepickerInput,
} from '@angular/material/datepicker';
import { MatInput } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-appointment',
  imports: [
    MatCard,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    MatDatepickerToggle,
    MatDatepicker,
    MatDatepickerInput,
    MatTimepickerInput,
    MatTimepickerToggle,
    MatTimepicker,
    MatHint,
    ReactiveFormsModule,
    MatInput,
    MatButtonModule,
    CommonModule,
  ],
  templateUrl: './edit-appointment.component.html',
  styleUrl: './edit-appointment.component.scss',
})
export class EditAppointmentComponent {
  appointmentForm: FormGroup;
  doctors: any[] = [];
  patients: any[] = [];
  minDate = new Date();
  appointmentId: any;
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
    private route: ActivatedRoute,
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

  ngOnInit() {
    this.route.queryParams.subscribe((params: any) => {
      this.appointmentId = params['id'];
      console.log(this.appointmentId, 'appointmentId test');
    });
    if (this.appointmentId) {
      this.getAppointmentById();
    }

    this.getDoctors();
    this.getPatients();
  }

  getAppointmentById() {
    this.appointmentService.getAppointments().subscribe((data: any) => {
      const appointment = data.find((a: any) => a.id == this.appointmentId);

      if (appointment) {
        this.appointmentForm.patchValue({
          patientId: appointment.patientId,
          doctorId: appointment.doctorId,
          date: appointment.date,
          time: appointment.time,
          notes: appointment.notes,
          status: appointment.status,
        });
      }
    });
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

  // onSubmit() {
  //   if (this.appointmentForm.valid) {
  //     const appointmentData = this.appointmentForm.value;
  //     // const appointmentId: any = localStorage.getItem('appointmentId');
  //     this.appointmentService
  //       .updateAppointment(this.appointmentId, appointmentData)
  //       .subscribe({
  //         next: () => {
  //           this.notificationService.success(
  //             'Appointment Information updated successfully',
  //           );
  //           this.router.navigate(['/appointments']);
  //         },
  //         error: (error) => {
  //           this.notificationService.error('Failed to update appointment');
  //         },
  //       });
  //   }
  // }

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

        if (this.appointmentForm.valid) {
          const appointmentData = this.appointmentForm.value;
          // const appointmentId: any = localStorage.getItem('appointmentId');
          this.appointmentService
            .updateAppointment(this.appointmentId, appointmentData)
            .subscribe({
              next: () => {
                this.notificationService.success(
                  'Appointment Information updated successfully',
                );
                this.router.navigate(['/appointments']);
              },
              error: () => {
                this.notificationService.error('Failed to update appointment');
              },
            });
        }
      },
    });
  }
}
