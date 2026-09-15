import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { DoctorDashboardViewModel, DoctorScheduleItem } from '../../../shared/models/doctor-dashboard.viewmodel';
import { ChartCardComponent } from '../../../shared/components/chart-card/chart-card.component';
import { AppointmentsChartComponent } from '../components/appointments-chart/appointments-chart.component';
import { AuthService } from '../../../core/services/auth/auth.service';
import { ChartEmptyStateComponent } from '../../../shared/components/chart-empty-state/chart-empty-state.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';


@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [CommonModule, MatCard, MatCardContent, MatIcon, ChartCardComponent, AppointmentsChartComponent, ChartCardComponent, ChartEmptyStateComponent, EmptyStateComponent],
  templateUrl: './doctor-dashboard.component.html',
  styleUrl: './doctor-dashboard.component.scss',
})
export class DoctorDashboardComponent {
  @Input({ required: true }) dashboard!: DoctorDashboardViewModel;

  today = new Date();


  constructor(
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Any initialization logic can go here
    // let currentUser = this.authService.getCurrentUser();
    // console.log('Current User:', currentUser); // Debugging line
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

  trackByAppt(index: number, item: DoctorScheduleItem): string {
    return item.patientName + item.date + item.time;
  }
}