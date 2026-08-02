import { Component } from '@angular/core';
import {
  MatCard,
  MatCardTitle,
  MatCardHeader,
  MatCardContent,
} from '@angular/material/card';
import { DashboardViewModel } from './models/dashboard.viewmodel';
import { DashboardService } from './services/dashboard/dashboard.service';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { SummaryCardsComponent } from './components/summary-cards/summary-cards.component';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { PaymentChartComponent } from './components/payment-chart/payment-chart.component';
import { RevenueChartComponent } from './components/revenue-chart/revenue-chart.component';
import { PendingPaymentsComponent } from './components/pending-payments/pending-payments.component';
import { RecentAppointmentsComponent } from './components/recent-appointments/recent-appointments.component';
import { AppointmentsChartComponent } from './components/appointments-chart/appointments-chart.component';

@Component({
  selector: 'app-dashboard',
  imports: [
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
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  dashboard!: DashboardViewModel;
  loading = true;
  dashboard$!: Observable<DashboardViewModel>;

  constructor(private dashboardService: DashboardService) {
    this.dashboard$ = this.dashboardService.getDashboardData();
  }

  ngOnInit(): void {
    this.loadDashboard();
  }

  private loadDashboard(): void {
    this.dashboardService

      .getDashboardData()

      .subscribe({
        next: (data) => {
          this.dashboard = data;
        },
      });
  }
}
