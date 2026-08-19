import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AppointmentService } from '../../services/appointment.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { NotificationService } from '../../../../core/services/notification/notification.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DoctorService } from '../../../doctors/services/doctor.service';
import { PatientService } from '../../../patients/services/patient.service';
import { Patient } from '../../../../shared/models/patient.model';
import { Doctor } from '../../../../shared/models/doctor.model';
import { Appointment } from '../../../../shared/models/appointment.model';
import { MatDialog } from '@angular/material/dialog';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { SearchBoxComponent } from '../../../../shared/components/search-box/search-box.component';
import { DialogService } from '../../../../core/services/dialog/dialog.service';

const SIXTY_DAYS_MS = 60 * 24 * 60 * 60 * 1000;

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSort,
    MatPaginator,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    PageHeaderComponent,
    SearchBoxComponent,
  ],
  templateUrl: './appointment-list.component.html',
  styleUrl: './appointment-list.component.scss',
})
export class AppointmentListComponent {
  displayedColumns: string[] = [
    'id',
    'patient',
    'doctor',
    'date',
    'time',
    'status',
    'actions',
  ];
  dataSource = new MatTableDataSource<any>();

  doctors: Doctor[] = [];
  patients: Patient[] = [];

  private _paginator!: MatPaginator;
  @ViewChild(MatPaginator) set paginator(mp: MatPaginator) {
    this._paginator = mp;
    if (mp) this.dataSource.paginator = mp;
  }
  get paginator(): MatPaginator {
    return this._paginator;
  }

  private _sort!: MatSort;
  @ViewChild(MatSort) set sort(ms: MatSort) {
    this._sort = ms;
    if (ms) {
      this.dataSource.sort = ms;
      this.dataSource.sortingDataAccessor = (item, property) => {
        switch (property) {
          case 'doctor':
            return this.getDoctorName(item.doctorId);
          case 'patient':
            return this.getPatientName(item.patientId);
          default:
            return item[property];
        }
      };
    }
  }
  get sort(): MatSort {
    return this._sort;
  }

  constructor(
    private router: Router,
    private appointmentService: AppointmentService,
    private notificationService: NotificationService,
    private patientService: PatientService,
    private doctorService: DoctorService,
    private dialogService: DialogService,
  ) {}

  ngOnInit(): void {
    this.loadDoctors();
    this.loadAll();
  }

  private loadAll(): void {
    forkJoin({
      appointments: this.appointmentService.getAppointments(),
      patients: this.patientService.getPatients(),
    }).subscribe({
      next: ({ appointments, patients }) => {
        this.patients = patients;
        this.runAutomationRules(appointments, patients);
        this.setSortedData(appointments);
      },
      error: () => {
        this.notificationService.error('Failed to load appointments');
      },
    });
  }

  private setSortedData(appointments: Appointment[]): void {
    const sorted = [...appointments].sort((a, b) => {
      const now = new Date().getTime();
      const dateA = this.getAppointmentDateTime(a).getTime();
      const dateB = this.getAppointmentDateTime(b).getTime();
      const aUpcoming = dateA >= now;
      const bUpcoming = dateB >= now;

      if (aUpcoming !== bUpcoming) return aUpcoming ? -1 : 1;
      if (aUpcoming) return dateA - dateB;
      return dateB - dateA;
    });

    this.dataSource.data = sorted;
  }

  /**
   * Client-side sweep: runs whenever this page loads.
   * NOTE: this only enforces the rules when someone visits this page —
   * a real production system needs a server-side scheduled job for this
   * to apply continuously in the background.
   */
  private runAutomationRules(
    appointments: Appointment[],
    patients: Patient[],
  ): void {
    const now = Date.now();

    // Rule 1: auto-cancel overdue, non-completed appointments
    const overdue = appointments.filter((a: any) => {
      return (
        a.status !== 'Completed' &&
        a.status !== 'Cancelled' &&
        this.getAppointmentDateTime(a).getTime() < now
      );
    });

    overdue.forEach((a: any) => {
      a.status = 'Cancelled';
      this.appointmentService.updateAppointment(a.id, a).subscribe({
        error: () => {
          this.notificationService.error(
            `Failed to auto-cancel appointment #${a.id}`,
          );
        },
      });
    });

    if (overdue.length > 0) {
      this.notificationService.success(
        `${overdue.length} overdue appointment${overdue.length > 1 ? 's' : ''} auto-cancelled`,
      );
    }

    // Rule 2: mark patients inactive if their most recent appointment was 60+ days ago
    const lastVisitByPatient = new Map<string, number>();
    appointments.forEach((a: any) => {
      const t = this.getAppointmentDateTime(a).getTime();
      const existing = lastVisitByPatient.get(a.patientId);
      if (!existing || t > existing) {
        lastVisitByPatient.set(a.patientId, t);
      }
    });

    let inactivatedCount = 0;
    patients.forEach((patient: any) => {
      if (patient.status !== 'Active') return;
      const lastVisit = lastVisitByPatient.get(patient.id);
      if (!lastVisit) return; // no appointment history — leave untouched
      if (now - lastVisit > SIXTY_DAYS_MS) {
        this.patientService
          .updatePatient(patient.id, { ...patient, status: 'Inactive' })
          .subscribe({
            error: () => {
              this.notificationService.error(
                `Failed to update status for ${patient.name}`,
              );
            },
          });
        inactivatedCount++;
      }
    });

    if (inactivatedCount > 0) {
      this.notificationService.success(
        `${inactivatedCount} patient${inactivatedCount > 1 ? 's' : ''} marked inactive (60+ days since last visit)`,
      );
    }
  }

  private getAppointmentDateTime(appointment: any): Date {
    const date = new Date(appointment.date);
    const [time, period] = (appointment.time || '').split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;

    date.setHours(hours, minutes, 0, 0);
    return date;
  }

  isOverdue(appointment: any): boolean {
    return this.getAppointmentDateTime(appointment).getTime() < Date.now();
  }

  getRowNumber(index: number): number {
    if (!this.paginator) return index + 1;
    return this.paginator.pageIndex * this.paginator.pageSize + index + 1;
  }

  getDoctorName(doctorId: any): string {
    return this.doctors.find((d) => d.id === doctorId)?.name || '—';
  }

  getPatientName(patientId: any): string {
    return this.patients.find((p) => p.id === patientId)?.name || '—';
  }

  getInitials(name: string): string {
    if (!name || name === '—') return '?';
    const parts = name.trim().split(' ').filter(Boolean);
    return parts
      .slice(0, 2)
      .map((p) => p[0].toUpperCase())
      .join('');
  }

  navEditAppointment(appointmentId: any) {
    this.router.navigate(['/appointments/edit'], {
      queryParams: { id: appointmentId },
    });
  }

  navAddAppointment() {
    this.router.navigate(['/appointments/add']);
  }

  cancelAppointment(appointment: any): void {
    this.dialogService
      .confirm({
        title: 'Cancel Appointment',
        message: 'Are you sure you want to cancel this appointment?',
        confirmText: 'Cancel Appointment',
        cancelText: 'Keep It',
      })
      .subscribe((result: any) => {
        if (result) {
          const updated = { ...appointment, status: 'Cancelled' };
          this.appointmentService
            .updateAppointment(appointment.id, updated)
            .subscribe({
              next: () => {
                this.notificationService.success('Appointment cancelled');
                this.loadAll();
              },
              error: () => {
                this.notificationService.error('Failed to cancel appointment');
              },
            });
        }
      });
  }

  generateInvoice(appointment: any): void {
    if (appointment.status !== 'Completed') {
      this.notificationService.error(
        'Invoice can only be generated for completed appointments',
      );
      return;
    }
    this.router.navigate(['/billing/create'], {
      queryParams: { data: appointment.id },
    });
  }

  applyFilter(value: string) {
    this.dataSource.filter = value.trim().toLowerCase();
  }

  loadDoctors() {
    this.doctorService.getDoctors().subscribe({
      next: (doctors) => (this.doctors = doctors),
      error: () => this.notificationService.error('Failed to load doctors'),
    });
  }
}
