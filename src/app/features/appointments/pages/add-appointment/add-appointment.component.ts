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
import { AppointmentAvailabilityService } from '../../services/availability/appointment-availability.service';

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

  timeSlots: string[] = [];

  // timeSlots = [
  //   '09:00 AM',
  //   '09:30 AM',
  //   '10:00 AM',
  //   '10:30 AM',
  //   '11:00 AM',
  //   '11:30 AM',
  //   '12:00 PM',
  //   '12:30 PM',
  //   '01:00 PM',
  //   '01:30 PM',
  //   '02:00 PM',
  //   '02:30 PM',
  //   '03:00 PM',
  //   '03:30 PM',
  //   '04:00 PM',
  //   '04:30 PM',
  //   '05:00 PM',
  //   '05:30 PM',
  // ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private appointmentService: AppointmentService,
    private notificationService: NotificationService,
    private doctorService: DoctorService,
    private patientService: PatientService,
    private appointmentAvailabilityService: AppointmentAvailabilityService,
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
    this.setupAvailabilityListeners();
  }

  // myFilter = (d: Date | null): boolean => {
  //   const day = (d || new Date()).getDay();
  //   // Prevent Saturday and Sunday from being selected.
  //   return day !== 0 ;
  // };

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

  private setupAvailabilityListeners(): void {
    this.appointmentForm.controls['doctorId'].valueChanges.subscribe(() => {
      this.loadAvailableSlots();
    });

    this.appointmentForm.controls['date'].valueChanges.subscribe(() => {
      this.loadAvailableSlots();
    });
  }

  private loadAvailableSlots(): void {
    const timeControl = this.appointmentForm.controls['time'];

    timeControl.disable();

    const doctorId = this.appointmentForm.controls['doctorId'].value;

    const selectedDate = this.appointmentForm.controls['date'].value;

    // Reset time when doctor/date changes
    this.timeSlots = [];

    this.appointmentForm.controls['time'].reset();

    if (!doctorId || !selectedDate) {
      return;
    }

    const date = this.formatDate(selectedDate);

    this.appointmentAvailabilityService
      .getAvailableSlots(date, doctorId)
      .subscribe({
        next: (slots) => {
          this.timeSlots = slots
            .filter((slot) => slot.available)
            .map((slot) => slot.time);

          if (this.timeSlots.length > 0) {
            timeControl.enable();
          } else {
            timeControl.disable();
          }
        },

        error: (error) => {
          console.error('Unable to load available slots', error);

          this.timeSlots = [];
        },
      });
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();

    const month = String(date.getMonth() + 1).padStart(2, '0');

    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}
