import { Component } from '@angular/core';
import { DoctorPerformanceModel } from '../../models/doctor-performance.model';
import { ReportsService } from '../../service/reports.service';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import {
  MatHeaderRowDef,
  MatRowDef,
  MatCellDef,
  MatHeaderCellDef,
  MatTableModule,
} from '@angular/material/table';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatCard } from "@angular/material/card";

@Component({
  selector: 'app-doctor-performance-report',
  imports: [
    PageHeaderComponent,
    MatHeaderRowDef,
    MatRowDef,
    MatCellDef,
    CurrencyPipe,
    MatHeaderCellDef,
    CommonModule,
    MatTableModule,
    MatCard
],
  templateUrl: './doctor-performance-report.component.html',
  styleUrl: './doctor-performance-report.component.scss',
})
export class DoctorPerformanceReportComponent {
  performance: DoctorPerformanceModel[] = [];

  displayedColumns = [
    'doctor',

    'specialization',

    'appointments',

    'revenue',

    'average',
  ];

  constructor(private reportService: ReportsService) {
    this.loadReport();
  }

  private loadReport(): void {
    this.reportService.getDoctorPerformance().subscribe({
      next: (data) => {
        this.performance = data;
      },
    });
  }

  getTotalRevenue(): number {
    return this.performance.reduce(
      (sum, row) => sum + row.revenue,

      0,
    );
  }

  getTotalAppointments(): number {
    return this.performance.reduce(
      (sum, row) => sum + row.appointments,

      0,
    );
  }
}
