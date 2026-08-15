import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCard } from '@angular/material/card';
import {
  MatFormField,
  MatLabel,
  MatHint,
  MatFormFieldModule,
} from '@angular/material/form-field';
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
import { NotificationService } from '../../../../core/services/notification/notification.service';
import { DoctorService } from '../../../doctors/services/doctor.service';
import { PatientService } from '../../../patients/services/patient.service';
import {
  MatDatepickerToggle,
  MatDatepickerActions,
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { AppointmentAvailabilityService } from '../../services/availability/appointment-availability.service';
import { Appointment } from '../../../../shared/models/appointment.model';

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
    MatHint,
    ReactiveFormsModule,
    MatInput,
    MatButtonModule,
    CommonModule,
    MatTimepickerModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
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
  maxDate = new Date(new Date().setDate(new Date().getDate() + 7));

  timeSlots: String[] = [];
  // '09:00 AM',
  // '09:30 AM',
  // '10:00 AM',
  // '10:30 AM',
  // '11:00 AM',
  // '11:30 AM',
  // '12:00 PM',
  // '12:30 PM',
  // '01:00 PM',
  // '01:30 PM',
  // '02:00 PM',
  // '02:30 PM',
  // '03:00 PM',
  // '03:30 PM',
  // '04:00 PM',
  // '04:30 PM',
  // '05:00 PM',
  // '05:30 PM',
  // ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private appointmentService: AppointmentService,
    private notificationService: NotificationService,
    private doctorService: DoctorService,
    private patientService: PatientService,
    private route: ActivatedRoute,
    private appointmentAvailabilityService: AppointmentAvailabilityService,
  ) {
    this.appointmentForm = this.fb.group({
      patientId: ['', { validators: [Validators.required] }],
      doctorId: ['', { validators: [Validators.required] }],
      date: ['', { validators: [Validators.required] }],
      time: [null, { validators: [Validators.required] }],
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

  getAppointmentById(): void {
    this.appointmentService
      .getAppointments()
      .subscribe((data: Appointment[]) => {
        const appointment = data.find((a) => a.id === this.appointmentId);

        if (!appointment) {
          return;
        }

        console.log(appointment, 'appointment....');


        
        this.appointmentForm.patchValue({
          patientId: appointment.patientId,
          doctorId: appointment.doctorId,
          date: new Date(appointment.date),
          time: appointment.time,
          notes: appointment.notes,
          status: appointment.status,
        });

        this.loadAvailableSlotsForEdit(
         new Date(appointment.date),
          appointment.doctorId,
          appointment.time,
        );
      });
  }
  // myFilter = (d: Date | null): boolean => {
  //   const day = (d || new Date()).getDay();
  //   // Prevent Saturday and Sunday from being selected.
  //   return day !== 0 && day !== 6;
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
        // console.log('Patients fetched:', this.patients); // Log the fetched patients for debugging
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

        console.log(form);
        // debugger;

        const existingAppointment = appointments.some(
          (a: any) =>
            a.doctorId === form.doctorId &&
            new Date(a.date).toDateString() ===
              new Date(form.date!).toDateString() &&
            a.time === form.time &&
            a.id !== this.appointmentId,
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

    console.log(timeControl, 'timecontrol');

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

  private loadAvailableSlotsForEdit(
    selectedDate: Date,
    doctorId: number,
    currentTime: string,
  ): void {
    const date = this.formatDate(selectedDate);

    console.log(date, 'date...');

    this.appointmentAvailabilityService
      .getAvailableSlots(date, doctorId)
      .subscribe({
        next: (slots) => {
          const availableTimes = slots
            .filter((slot) => slot.available)
            .map((slot) => slot.time);

          // Existing appointment time may not be
          // returned as available because it is already booked.
          if (currentTime && !availableTimes.includes(currentTime)) {
            availableTimes.push(currentTime);

            availableTimes.sort();
          }

          this.timeSlots = availableTimes;

          const timeControl = this.appointmentForm.controls['time'];

          if (this.timeSlots.length > 0) {
            timeControl.enable();

            timeControl.setValue(currentTime);
          } else {
            timeControl.disable();
          }
        },

        error: (error) => {
          console.error('Unable to load appointment slots', error);

          this.timeSlots = [];
        },
      });
  }

 private formatDate(date: Date | string): string {

  if (typeof date === 'string') {
    return date.includes('T')
      ? date.split('T')[0]
      : date;
  }

  const year = date.getFullYear();

  const month = String(
    date.getMonth() + 1
  ).padStart(2, '0');

  const day = String(
    date.getDate()
  ).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
}
