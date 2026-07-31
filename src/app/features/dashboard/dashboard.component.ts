import { Component } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { DashboardViewModel } from './models/dashboard.viewmodel';
import { DashboardService } from './services/dashboard/dashboard.service';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { SummaryCardsComponent } from './components/summary-cards/summary-cards.component';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [MatCard, PageHeaderComponent, SummaryCardsComponent, AsyncPipe],
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
    this.dashboardService

      .getDashboardData()

      .subscribe({
        next: (data) => {
          this.dashboard = data;

          this.loading = false;
        },
      });
  }
}
