import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';
import { Router, ɵEmptyOutletComponent } from '@angular/router';
import { AppointmentService } from '../../services/appointment.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NotificationService } from '../../../../core/services/notification.service';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatCard } from '@angular/material/card';
import { DatePipe, CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { DoctorService } from '../../../doctors/services/doctor.service';
import { PatientService } from '../../../patients/services/patient.service';
import { Patient } from '../../../../shared/models/patient.model';
import { Doctor } from '../../../../shared/models/doctor.model';
import { Appointment } from '../../../../shared/models/appointment.model';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  selector: 'app-appointment-list',
  imports: [
    MatFormField,
    MatIcon,
    MatCard,
    MatSort,
    MatLabel,
    DatePipe,
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    MatBadgeModule,
  ],
  templateUrl: './appointment-list.component.html',
  styleUrl: './appointment-list.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppointmentListComponent {
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  appointments: Appointment[] = [];
  doctors: Doctor[] = [];
  patients: Patient[] = [];
  appointmentList: any;

  constructor(
    private router: Router,
    private appointmentService: AppointmentService,
    private notificationService: NotificationService,
    private patientService: PatientService,
    private doctorService: DoctorService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.getAppointments();
    this.loadPatients();
    this.loadDoctors();
  }

  getAppointments() {
    // Implement logic to fetch appointments from the backend or service
    this.appointmentService.getAppointments().subscribe({
      next: (appointments: any) => {
        // Handle the fetched appointments
        this.dataSource.data = appointments;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (error) => {
        this.notificationService.error('Failed to load appointments');
      },
      complete: () => {
        console.log('Appointments loaded successfully', this.dataSource.data);
      },
    });
  }

  navEditAppointment(appointmentId: number) {
    // Implement logic to navigate to the update appointment page
    this.router.navigate(['/appointments/edit'], {
      queryParams: { id: appointmentId },
    });
    console.log(appointmentId, 'appointmentId');
  }

  deleteAppointment(appointmentId: any) {
    // Implement logic to delete the appointment

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Cancel Appointment',
        message: 'Are you sure you want to Cancel the Appointment?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.appointmentService.deleteAppointment(appointmentId).subscribe({
          next: () => {
            // Handle successful deletion
            this.notificationService.success(
              'Appointment Cancelled successfully',
            );
            console.log('Appointment Cancelled successfully');
            this.getAppointments();
          },
          error: (error) => {
            // Handle any errors
            this.notificationService.error('Error cancelling appointment ');

            console.error('Error deleting appointment:', error);
          },
        });
      }
    });
  }

  navAddAppointment() {
    // Implement logic to navigate to the add appointment page
    this.router.navigate(['/appointments/add']);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;

    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  loadPatients() {
    this.patientService.getPatients().subscribe({
      next: (patients) => {
        // Handle the fetched patients
        this.patients = patients;
        console.log('Patients loaded successfully', patients);
      },
      error: (error) => {
        this.notificationService.error('Failed to load patients');
      },
    });
  }

  loadDoctors() {
    this.doctorService.getDoctors().subscribe({
      next: (doctors) => {
        // Handle the fetched doctors
        this.doctors = doctors;
        console.log('Doctors loaded successfully', doctors);
      },
      error: (error) => {
        this.notificationService.error('Failed to load doctors');
      },
    });
  }

  getDoctorName(doctorId: any) {
    return this.doctors.find((d) => d.id === doctorId)?.name || '-';
  }

  getPatientName(patientId: any) {
    return this.patients.find((p) => p.id === patientId)?.name || '-';
  }

  getRowNumber(index: number): number {
    if (!this.paginator) {
      return index + 1;
    }

    return this.paginator.pageIndex * this.paginator.pageSize + index + 1;
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Scheduled':
        return 'primary';
      case 'Completed':
        return 'success';
      case 'Cancelled':
        return 'warn';
      default:
        return 'default';
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Scheduled':
        return 'badge-scheduled';
      case 'Completed':
        return 'badge-completed';
      case 'Cancelled':
        return 'badge-cancelled';
      default:
        return '';
    }
  }
}
