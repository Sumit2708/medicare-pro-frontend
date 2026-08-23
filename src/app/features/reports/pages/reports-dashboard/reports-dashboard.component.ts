import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { PageHeaderComponent } from "../../../../shared/components/page-header/page-header.component";

@Component({
  selector: 'app-reports-dashboard',
  imports: [MatCardModule, MatIconModule, PageHeaderComponent],
  templateUrl: './reports-dashboard.component.html',
  styleUrl: './reports-dashboard.component.scss',
})
export class ReportsDashboardComponent {
  reports = [
    {
      title: 'Revenue Report',
      description: 'Income, billing & payment trends',
      icon: 'payments',
      route: '/reports/revenue',
      accent: 'accent-amber',
    },
    {
      title: 'Appointment Report',
      description: 'Bookings, cancellations & no-shows',
      icon: 'event_note',
      route: '/reports/appointments',
      accent: '',
    },
    {
      title: 'Doctor Performance',
      description: 'Patient load & consultation stats',
      icon: 'medical_services',
      route: '/reports/doctors',
      accent: '',
    },
  ];

  constructor(private router: Router) {}

  open(route: string): void {
    this.router.navigate([route]);
  }
}