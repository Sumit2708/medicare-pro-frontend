import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCard } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { AppointmentService } from '../../services/appointment.service';
import { NotificationService } from '../../../../core/services/notification/notification.service';
import { DoctorService } from '../../../doctors/services/doctor.service';
import { PatientService } from '../../../patients/services/patient.service';
import { AppointmentAvailabilityService } from '../../services/availability/appointment-availability.service';
import { Appointment } from '../../../../shared/models/appointment.model';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-edit-appointment',
  standalone: true,
  imports: [
    CommonModule,
    MatCard,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDatepickerModule,
    PageHeaderComponent,
  ],
  templateUrl: './edit-appointment.component.html',
  styleUrl: './edit-appointment.component.scss',
})
export class EditAppointmentComponent implements OnInit {
  appointmentForm: FormGroup;
  doctors: any[] = [];
  patients: any[] = [];
  minDate = new Date();
  maxDate = new Date(new Date().setDate(new Date().getDate() + 7));
  appointmentId: any;

  timeSlots: string[] = [];

  loadingDoctors = false;
  loadingPatients = false;
  loadingSlots = false;
  isSubmitting = false;
  isLoadingAppointment = false;

  statusOptions = [
    { value: 'Scheduled', icon: 'event_available' },
    { value: 'Completed', icon: 'task_alt' },
    { value: 'Cancelled', icon: 'cancel' },
  ];

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
      patientId: ['', Validators.required],
      doctorId: ['', Validators.required],
      date: ['', Validators.required],
      time: [{ value: '', disabled: true }, Validators.required],
      notes: [''],
      status: ['Scheduled'],
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params: any) => {
      this.appointmentId = params['id'];

      if (this.appointmentId) {
        this.getAppointmentById();
      }
    });

    this.getDoctors();
    this.getPatients();
    this.setupAvailabilityListeners();
  }

  getAppointmentById(): void {
    this.isLoadingAppointment = true;

    this.appointmentService
      .getAppointments()
      .subscribe((data: Appointment[]) => {
        const appointment = data.find((a) => a.id === this.appointmentId);

        this.isLoadingAppointment = false;

        if (!appointment) {
          this.notificationService.error('Appointment not found');
          return;
        }

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

  getDoctors() {
    this.loadingDoctors = true;
    this.doctorService.getDoctors().subscribe({
      next: (res: any) => {
        this.doctors = res;
        this.loadingDoctors = false;
      },
      error: () => {
        this.notificationService.error('Failed to fetch doctors');
        this.loadingDoctors = false;
      },
    });
  }

  getPatients() {
    this.loadingPatients = true;
    this.patientService.getPatients().subscribe({
      next: (res: any) => {
        this.patients = res;
        this.loadingPatients = false;
      },
      error: () => {
        this.notificationService.error('Failed to fetch patients');
        this.loadingPatients = false;
      },
    });
  }

  get selectedPatient() {
    const id = this.appointmentForm.get('patientId')?.value;
    return this.patients.find((p) => p.id === id);
  }

  get selectedDoctor() {
    const id = this.appointmentForm.get('doctorId')?.value;
    return this.doctors.find((d) => d.id === id);
  }

  get patientInitials(): string {
    return this.initialsOf(this.selectedPatient?.name);
  }

  get doctorInitials(): string {
    return this.initialsOf(this.selectedDoctor?.name);
  }

  private initialsOf(name?: string): string {
    if (!name) return '—';
    const parts = name.trim().split(' ').filter(Boolean);
    if (!parts.length) return '—';
    return parts
      .slice(0, 2)
      .map((p) => p[0].toUpperCase())
      .join('');
  }

  get completionPercent(): number {
    const keys = ['patientId', 'doctorId', 'date', 'time'];
    const filled = keys.filter((k) => {
      const v = this.appointmentForm.get(k)?.value;
      return v !== null && v !== undefined && v !== '';
    }).length;
    return Math.round((filled / keys.length) * 100);
  }

  onSubmit() {
    if (this.appointmentForm.invalid) {
      this.appointmentForm.markAllAsTouched();
      this.notificationService.error('Please fill in all required fields.');
      return;
    }

    this.isSubmitting = true;

    this.appointmentService.getAppointments().subscribe({
      next: (appointments: any) => {
        const form = this.appointmentForm.getRawValue();

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
          this.isSubmitting = false;
          return;
        }

        const appointmentData = {
          ...form,
          date: form.date ? this.formatDate(form.date) : null,
        };

        this.appointmentService
          .updateAppointment(this.appointmentId, appointmentData)
          .subscribe({
            next: () => {
              this.notificationService.success(
                'Appointment updated successfully',
              );
              this.router.navigate(['/appointments']);
            },
            error: () => {
              this.notificationService.error('Failed to update appointment');
              this.isSubmitting = false;
            },
          });
      },
      error: () => {
        this.notificationService.error('Failed to verify appointment slot');
        this.isSubmitting = false;
      },
    });
  }

  onCancel() {
    this.router.navigate(['/appointments']);
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
    timeControl.disable();

    const doctorId = this.appointmentForm.controls['doctorId'].value;
    const selectedDate = this.appointmentForm.controls['date'].value;

    this.timeSlots = [];
    timeControl.reset();

    if (!doctorId || !selectedDate) {
      return;
    }

    const date = this.formatDate(selectedDate);
    this.loadingSlots = true;

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
          this.loadingSlots = false;
        },
        error: (error) => {
          console.error('Unable to load available slots', error);
          this.timeSlots = [];
          this.loadingSlots = false;
        },
      });
  }

  private loadAvailableSlotsForEdit(
    selectedDate: Date,
    doctorId: number,
    currentTime: string,
  ): void {
    const date = this.formatDate(selectedDate);
    this.loadingSlots = true;

    this.appointmentAvailabilityService
      .getAvailableSlots(date, doctorId)
      .subscribe({
        next: (slots) => {
          const availableTimes = slots
            .filter((slot) => slot.available)
            .map((slot) => slot.time);

          // The appointment's current slot may not come back as "available"
          // since it's already booked by this same appointment — add it back.
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
          this.loadingSlots = false;
        },
        error: (error) => {
          console.error('Unable to load appointment slots', error);
          this.timeSlots = [];
          this.loadingSlots = false;
        },
      });
  }

  private formatDate(date: Date | string): string {
    if (typeof date === 'string') {
      return date.includes('T') ? date.split('T')[0] : date;
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}