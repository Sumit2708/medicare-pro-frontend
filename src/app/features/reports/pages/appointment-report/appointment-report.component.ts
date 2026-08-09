import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';

import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';

import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { ReportSummaryCardComponent } from '../../components/report-summary-card/report-summary-card.component';
import { ReportExportActionsComponent } from '../../components/report-export-actions/report-export-actions.component';


import { AppointmentReportModel } from '../../models/appointment-report.model';
import { AppointmentSummaryModel } from '../../models/appointment-summary.model';
import { ReportsService } from '../../service/reports.service';

@Component({
  selector: 'app-appointment-report',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    DatePipe,
    MatTableModule,
    MatCardModule,
    PageHeaderComponent,
    ReportSummaryCardComponent,
    ReportExportActionsComponent
  ],
  templateUrl: './appointment-report.component.html',
  styleUrl: './appointment-report.component.scss'
})
export class AppointmentReportComponent implements OnInit {

  appointments: AppointmentReportModel[] = [];

  summary!: AppointmentSummaryModel;

  displayedColumns: string[] = [
    'date',
    'time',
    'patient',
    'doctor',
    'specialization',
    'status'
  ];

  constructor(
    private reportsService: ReportsService
  ) {}

  ngOnInit(): void {
    this.loadReport();
  }

  loadReport(): void {

    this.reportsService
      .getAppointmentReport()
      .subscribe({

        next: response => {

          this.appointments = response.appointments;

          this.summary = response.summary;

          console.log(this.appointments); // TODO: Remove from console log.

        },

        error: error => {

          console.error(
            'Unable to load appointment report',
            error
          );

        }

      });

  }

  exportPdf(): void {
    console.log('Appointment PDF');
  }

  exportExcel(): void {
    console.log('Appointment Excel');
  }

  printReport(): void {
    console.log('Appointment Print');
  }

}