import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, of, switchMap } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { ChartCardComponent } from '../../../shared/components/chart-card/chart-card.component';
import { AppointmentsChartComponent } from '../components/appointments-chart/appointments-chart.component';
import { DoctorDashboardViewModel } from '../../../shared/models/doctor-dashboard.viewmodel';
import { DashboardService } from '../services/dashboard/dashboard.service';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ChartCardComponent,
    AppointmentsChartComponent,
    MatIconModule,
  ],
  templateUrl: './doctor-dashboard.component.html',
  styleUrl: './doctor-dashboard.component.scss',
})
export class DoctorDashboardComponent {
  dashboard$: Observable<DoctorDashboardViewModel | null>;
  greeting = '';
  today = new Date();

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService,
  ) {
    const user = this.authService.getCurrentUser();
    console.log(user, 'user');

    this.dashboard$ = user?.doctorId
      ? this.dashboardService.getDoctorDashboardData(user.doctorId)
      : of(null);

      console.log(this.dashboard$, 'dashboard');
  }

  ngOnInit(): void {
    // const user = this.authService.getCurrentUser();
    // console.log(user, 'user');

    // this.dashboard$ = user?.doctorId
    //   ? this.dashboardService.getDoctorDashboardData(user.doctorId)
    //   : of(null);

    // console.log(this.dashboard$, 'dashboard');

    const hour = new Date().getHours();
    if (hour < 12) this.greeting = 'Good morning';
    else if (hour < 17) this.greeting = 'Good afternoon';
    else this.greeting = 'Good evening';
  }

  getInitials(name: string): string {
    if (!name) return 'DR';
    const parts = name.trim().split(' ').filter(Boolean);
    return parts
      .slice(0, 2)
      .map((p) => p[0].toUpperCase())
      .join('');
  }
}
