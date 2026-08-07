import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { PageHeaderComponent } from "../../../../shared/components/page-header/page-header.component";

@Component({
  selector: 'app-reports-dashboard',
  imports: [MatCardModule,
    MatIconModule, PageHeaderComponent],
  templateUrl: './reports-dashboard.component.html',
  styleUrl: './reports-dashboard.component.scss',
})
export class ReportsDashboardComponent {
  reports = [
    {
      title: 'Revenue Report',
      icon: 'payments',
      route: '/reports/revenue',
    },
    {
      title: 'Appointment Report',
      icon: 'event_note',
      route: '/reports/appointments',
    },
    {
      title: 'Doctor Performance',
      icon: 'medical_services',
      route: '/reports/doctors',
    },
  ];

  constructor(private router: Router) {}

  open(route: string): void {
    this.router.navigate([route]);
  }
}
