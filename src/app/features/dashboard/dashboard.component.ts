import { Component } from '@angular/core';
import {
  MatCard,
  MatCardTitle,
  MatCardHeader,
  MatCardContent,
  MatCardSubtitle,
} from '@angular/material/card';
import { DashboardViewModel } from './models/dashboard.viewmodel';
import { DashboardService } from './services/dashboard/dashboard.service';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { SummaryCardsComponent } from './components/summary-cards/summary-cards.component';
import { Observable } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';
import { PaymentChartComponent } from './components/payment-chart/payment-chart.component';
import { RevenueChartComponent } from './components/revenue-chart/revenue-chart.component';
import { PendingPaymentsComponent } from './components/pending-payments/pending-payments.component';
import { RecentAppointmentsComponent } from './components/recent-appointments/recent-appointments.component';
import { AppointmentsChartComponent } from './components/appointments-chart/appointments-chart.component';
import { ChartCardComponent } from '../../shared/components/chart-card/chart-card.component';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { DoctorService } from '../doctors/services/doctor.service';
import {
  AlertBannerComponent,
  AlertItem,
} from '../../shared/components/alert-baner/alert-baner.component';
import { MatTooltip } from '@angular/material/tooltip';
import { UserRole } from '../../core/enums/user-role.enum';
import { User } from '../../shared/models/user.model'; // adjust path
import { DoctorDashboardViewModel } from '../../shared/models/doctor-dashboard.viewmodel';
import { ReceptionistDashboardViewModel } from '../../shared/models/receptionist-dashboard.viewmodel';
import { AuthService } from '../../core/services/auth/auth.service';
import { DoctorDashboardComponent } from './doctor-dashboard/doctor-dashboard.component';
import { ReceptionistDashboardComponent } from './receptionist-dashboard/receptionist-dashboard.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    MatCard,
    PageHeaderComponent,
    SummaryCardsComponent,
    AsyncPipe,
    PaymentChartComponent,
    MatCardTitle,
    MatCardHeader,
    RevenueChartComponent,
    MatCardContent,
    PendingPaymentsComponent,
    RecentAppointmentsComponent,
    AppointmentsChartComponent,
    ChartCardComponent,
    MatIcon,
    MatButtonModule,
    MatCardSubtitle,
    AlertBannerComponent,
    MatTooltip,
    DoctorDashboardComponent,
    ReceptionistDashboardComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  dashboard$!: Observable<DashboardViewModel>;
  doctorDashboard$!: Observable<DoctorDashboardViewModel>;
  receptionistDashboard$!: Observable<ReceptionistDashboardViewModel>;

  doctorsOnDuty: any[] = [];
  greeting = '';
  today = new Date();

  currentUser: User | null = null;

  UserRole = UserRole;

  constructor(
    private dashboardService: DashboardService,
    private doctorService: DoctorService,
    private router: Router,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    // Get current user
    this.currentUser = this.authService.getCurrentUser();

    // console.log('Current User:', this.currentUser);
    // console.log('Role:', this.currentUser?.role);
    // console.log('Doctor ID:', this.currentUser?.doctorId);
    // console.log('User ID:', this.currentUser?.id);

    this.setGreeting();

    // Load dashboard based on role
    if (
      this.currentUser?.role === UserRole.DOCTOR &&
      this.currentUser.doctorId
    ) {
      console.log('Loading Doctor Dashboard');

      this.doctorDashboard$ =
        this.dashboardService.getDoctorDashboardData(
          this.currentUser.doctorId
        );

    } else if (this.currentUser?.role === UserRole.RECEPTIONIST) {
      console.log('Loading Receptionist Dashboard');

      this.receptionistDashboard$ =
        this.dashboardService.getReceptionistDashboardData();

        console.log('Receptionist Dashboard:', this.receptionistDashboard$);

    } else {
      console.log('Loading Admin Dashboard');

      this.dashboard$ =
        this.dashboardService.getDashboardData();
    }

    // Admin-specific data
    if (this.currentUser?.role === UserRole.ADMIN) {
      this.loadDoctorsOnDuty();
    }
  }

  private setGreeting(): void {
    const hour = new Date().getHours();

    if (hour < 12) {
      this.greeting = 'Good morning';
    } else if (hour < 17) {
      this.greeting = 'Good afternoon';
    } else {
      this.greeting = 'Good evening';
    }
  }

  private loadDoctorsOnDuty(): void {
    this.doctorService.getDoctors().subscribe((doctors: any[]) => {
      this.doctorsOnDuty = (doctors || [])
        .filter((d: any) => d.status === 'Active')
        .slice(0, 8);
    });
  }

  getInitials(name: string): string {
    if (!name) return 'DR';

    const parts = name.trim().split(' ').filter(Boolean);

    return parts
      .slice(0, 2)
      .map((p: string) => p[0].toUpperCase())
      .join('');
  }

  getAlerts(dashboard: DashboardViewModel): AlertItem[] {
    const alerts: AlertItem[] = [];

    const pending = dashboard.pendingInvoices?.length ?? 0;

    if (pending > 0) {
      alerts.push({
        icon: 'payments',
        type: 'warning',
        message: `${pending} pending payment${
          pending > 1 ? 's' : ''
        } need attention`,
      });
    }

    const todayAppts = dashboard.todayAppointments ?? 0;

    if (todayAppts > 0) {
      alerts.push({
        icon: 'event_available',
        type: 'info',
        message: `${todayAppts} appointment${
          todayAppts > 1 ? 's' : ''
        } scheduled today`,
      });
    }

    return alerts;
  }

  goTo(path: string): void {
    this.router.navigate([path]);
  }
}