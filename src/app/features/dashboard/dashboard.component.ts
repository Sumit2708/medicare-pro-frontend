import { Component } from '@angular/core';
import { MatCard, MatCardTitle, MatCardHeader, MatCardContent, MatCardSubtitle } from '@angular/material/card';
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
import { DashboardFilter } from '../../core/enums/dashboard-filter.enum';
import { MatChipOption } from "@angular/material/chips";
import { ChartCardComponent } from "../../shared/components/chart-card/chart-card.component";
import { MatIcon } from "@angular/material/icon";

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
    MatChipOption,
    ChartCardComponent,
    MatIcon,
    MatCardSubtitle
],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  dashboard!: DashboardViewModel;
  loading = true;
  dashboard$!: Observable<DashboardViewModel>;

  // selectedFilter = DashboardFilter.MONTH;
  // DashboardFilter = DashboardFilter;

  constructor(private dashboardService: DashboardService) {
    this.dashboard$ = this.dashboardService.getDashboardData();
  }

  ngOnInit(): void {
    this.loadDashboard();
  }

  changeFilter(filter: DashboardFilter): void {
    // this.selectedFilter = filter;
    this.loadDashboard();
  }

  private loadDashboard(): void {
    this.dashboardService.getDashboardData()
      .subscribe({
        next: (data) => {
          console.log(data);
          
          this.dashboard = data;
        },
      });
  }
}
