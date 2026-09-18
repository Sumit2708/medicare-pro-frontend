import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { DoctorDashboardViewModel, DoctorScheduleItem } from '../../../shared/models/doctor-dashboard.viewmodel';
import { ChartCardComponent } from '../../../shared/components/chart-card/chart-card.component';
import { AppointmentsChartComponent } from '../components/appointments-chart/appointments-chart.component';
import { AuthService } from '../../../core/services/auth/auth.service';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCard,
    MatCardContent,
    MatButtonModule,
    MatIcon,
    ChartCardComponent,
    AppointmentsChartComponent,
    EmptyStateComponent,
  ],
  templateUrl: './doctor-dashboard.component.html',
  styleUrl: './doctor-dashboard.component.scss',
})
export class DoctorDashboardComponent {
  @Input({ required: true }) dashboard!: DoctorDashboardViewModel;

  today = new Date();

  constructor(private authService: AuthService) {}

  get currentUserName(): string {
    return this.authService.getCurrentUser()?.name ?? 'Doctor';
  }

  getInitials(name: string): string {
    if (!name) return 'DR';
    const parts = name.trim().split(' ').filter(Boolean);
    return parts.slice(0, 2).map((p) => p[0].toUpperCase()).join('');
  }

  statusClass(status: string): string {
    switch (status) {
      case 'Completed':
        return 'status-success';
      case 'Cancelled':
        return 'status-danger';
      default:
        return 'status-info';
    }
  }

  trackBySchedule(index: number, item: DoctorScheduleItem): string {
    return item.patientName + item.time;
  }

  // trackByAppt(index: number, item: DoctorUpcomingAppointment): string {
  //   return item.patientName + item.date + item.time;
  // }

    trackByAppt(index: number, item: any): string {
    return item.patientName + item.date + item.time;
  }
}