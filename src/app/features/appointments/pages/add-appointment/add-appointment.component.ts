import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import {
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { Router } from '@angular/router';
import { AppointmentService } from '../../services/appointment.service';
import { NotificationService } from '../../../../core/services/notification/notification.service';
import { PatientService } from '../../../patients/services/patient.service';
import { DoctorService } from '../../../doctors/services/doctor.service';
import { AppointmentAvailabilityService } from '../../services/availability/appointment-availability.service';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-add-appointment',
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
  templateUrl: './add-appointment.component.html',
  styleUrl: './add-appointment.component.scss',
})
export class AddAppointmentComponent implements OnInit {
  appointmentForm: FormGroup;
  doctors: any[] = [];
  patients: any[] = [];
  minDate = new Date();
  maxDate = new Date(new Date().setDate(new Date().getDate() + 7));

  timeSlots: string[] = [];

  loadingDoctors = false;
  loadingPatients = false;
  loadingSlots = false;
  isSubmitting = false;

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
    private appointmentAvailabilityService: AppointmentAvailabilityService,
  ) {
    this.appointmentForm = this.fb.group({
      patientId: ['', Validators.required],
      doctorId: ['', Validators.required],
      date: ['', Validators.required],
      time: [{ value: '', disabled: true }, Validators.required],
      notes: ['', Validators.maxLength(250)],
      status: ['Scheduled'],
    });
  }

  ngOnInit(): void {
    this.getDoctors();
    this.getPatients();
    this.setupAvailabilityListeners();
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
            a.time === form.time,
        );

        if (existingAppointment) {
          this.notificationService.error(
            'Doctor is already booked for the selected date and time.',
          );
          this.isSubmitting = false;
          return;
        }

        form.date = form.date ? this.formatDate(form.date) : null;

        this.appointmentService.createAppointment(form).subscribe({
          next: () => {
            this.notificationService.success(
              'Appointment created successfully',
            );
            this.router.navigate(['/appointments']);
          },
          error: () => {
            this.notificationService.error('Failed to create appointment');
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

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}