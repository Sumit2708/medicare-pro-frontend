// import { Component } from '@angular/core';
// import { MatCard, MatCardTitle, MatCardHeader, MatCardContent, MatCardSubtitle } from '@angular/material/card';
// import { DashboardViewModel } from './models/dashboard.viewmodel';
// import { DashboardService } from './services/dashboard/dashboard.service';
// import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
// import { SummaryCardsComponent } from './components/summary-cards/summary-cards.component';
// import { Observable } from 'rxjs';
// import { AsyncPipe } from '@angular/common';
// import { PaymentChartComponent } from './components/payment-chart/payment-chart.component';
// import { RevenueChartComponent } from './components/revenue-chart/revenue-chart.component';
// import { PendingPaymentsComponent } from './components/pending-payments/pending-payments.component';
// import { RecentAppointmentsComponent } from './components/recent-appointments/recent-appointments.component';
// import { AppointmentsChartComponent } from './components/appointments-chart/appointments-chart.component';
// import { DashboardFilter } from '../../core/enums/dashboard-filter.enum';
// import { MatChipOption } from "@angular/material/chips";
// import { ChartCardComponent } from "../../shared/components/chart-card/chart-card.component";
// import { MatIcon } from "@angular/material/icon";

// @Component({
//   selector: 'app-dashboard',
//   imports: [
//     MatCard,
//     PageHeaderComponent,
//     SummaryCardsComponent,
//     AsyncPipe,
//     PaymentChartComponent,
//     MatCardTitle,
//     MatCardHeader,
//     RevenueChartComponent,
//     MatCardContent,
//     PendingPaymentsComponent,
//     RecentAppointmentsComponent,
//     AppointmentsChartComponent,
//     MatChipOption,
//     ChartCardComponent,
//     MatIcon,
//     MatCardSubtitle
// ],
//   templateUrl: './dashboard.component.html',
//   styleUrl: './dashboard.component.scss',
// })
// export class DashboardComponent {
//   dashboard!: DashboardViewModel;
//   loading = true;
//   dashboard$!: Observable<DashboardViewModel>;

//   // selectedFilter = DashboardFilter.MONTH;
//   // DashboardFilter = DashboardFilter;

//   constructor(private dashboardService: DashboardService) {
//     this.dashboard$ = this.dashboardService.getDashboardData();
//   }

//   ngOnInit(): void {
//     this.loadDashboard();
//   }

//   changeFilter(filter: DashboardFilter): void {
//     // this.selectedFilter = filter;
//     this.loadDashboard();
//   }

//   private loadDashboard(): void {
//     this.dashboardService.getDashboardData()
//       .subscribe({
//         next: (data) => {
//           console.log(data);
          
//           this.dashboard = data;
//         },
//       });
//   }
// }



import { Component } from '@angular/core';
import { MatCard, MatCardTitle, MatCardHeader, MatCardContent, MatCardSubtitle } from '@angular/material/card';
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
import { DoctorService } from '../doctors/services/doctor.service'; // ⚠️ adjust path to your project
import { AlertBannerComponent, AlertItem } from '../../shared/components/alert-baner/alert-baner.component';
import { MatTooltip } from '@angular/material/tooltip';

interface ActivityItem {
  icon: string;
  title: string;
  meta: string;
  type: 'appointment' | 'payment';
}

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
    MatTooltip
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  dashboard$!: Observable<DashboardViewModel>;
  doctorsOnDuty: any[] = [];
  greeting = '';
  today = new Date();

  constructor(
    private dashboardService: DashboardService,
    private doctorService: DoctorService,
    private router: Router,
  ) {
    this.dashboard$ = this.dashboardService.getDashboardData();
  }

  ngOnInit(): void {
    this.setGreeting();
    this.loadDoctorsOnDuty();
  }

  private setGreeting(): void {
    const hour = new Date().getHours();
    if (hour < 12) this.greeting = 'Good morning';
    else if (hour < 17) this.greeting = 'Good afternoon';
    else this.greeting = 'Good evening';
  }

  private loadDoctorsOnDuty(): void {
    this.doctorService.getDoctors().subscribe((doctors: any) => {
      this.doctorsOnDuty = (doctors || []).filter((d: any) => d.status === 'Active').slice(0, 8);
    });
  }

  getInitials(name: string): string {
    if (!name) return 'DR';
    const parts = name.trim().split(' ').filter(Boolean);
    return parts.slice(0, 2).map((p: string) => p[0].toUpperCase()).join('');
  }

  getAlerts(dashboard: DashboardViewModel): AlertItem[] {
    const alerts: AlertItem[] = [];

    const pending = dashboard.pendingInvoices?.length ?? 0;
    if (pending > 0) {
      alerts.push({
        icon: 'payments',
        type: 'warning',
        message: `${pending} pending payment${pending > 1 ? 's' : ''} need attention`,
      });
    }

    const todayAppts = dashboard.todayAppointments ?? 0;
    if (todayAppts > 0) {
      alerts.push({
        icon: 'event_available',
        type: 'info',
        message: `${todayAppts} appointment${todayAppts > 1 ? 's' : ''} scheduled today`,
      });
    }

    return alerts;
  }

  getActivityFeed(dashboard: DashboardViewModel): ActivityItem[] {
    const feed: ActivityItem[] = [];

    (dashboard.recentAppointments ?? []).slice(0, 4).forEach((a: any) => {
      feed.push({
        icon: 'event_available',
        type: 'appointment',
        title: `${a.patientName} — appointment with ${a.doctorName}`,
        meta: `${a.status} · ${a.appointmentTime}`,
      });
    });

    (dashboard.pendingInvoices ?? []).slice(0, 3).forEach((p: any) => {
      feed.push({
        icon: 'receipt_long',
        type: 'payment',
        title: `Invoice ${p.invoiceNumber} — ${p.patientName}`,
        meta: `₹${p.amount} · ${p.paymentStatus}`,
      });
    });

    return feed;
  }

  goTo(path: string): void {
    this.router.navigate([path]);
  }
}