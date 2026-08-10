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
import { DoctorService } from '../../../doctors/services/doctor.service';
import { Doctor } from '../../../../shared/models/doctor.model';
import { AppointmentReportFilterComponent } from '../../components/appointment-report-filter/appointment-report-filter.component';
import { AppointmentReportFilter } from '../../models/appointment-report-filter.model';

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
    ReportExportActionsComponent,
    AppointmentReportFilterComponent,
  ],
  templateUrl: './appointment-report.component.html',
  styleUrl: './appointment-report.component.scss',
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
    'status',
  ];

  doctors: Doctor[] = [];

  constructor(
    private reportsService: ReportsService,
    private doctorService: DoctorService,
  ) {}

  ngOnInit(): void {
    this.loadReport();
  }

  loadReport(filter?: AppointmentReportFilter): void {
    this.reportsService.getAppointmentReport(filter).subscribe({
      next: (response) => {
        console.log('Appointment report loaded successfully', response);
        this.appointments = response.appointments;

        this.summary = response.summary;

        this.loadDoctors();
      },

      error: (error) => {
        console.error('Unable to load appointment report', error);
      },
    });
  }

  private loadDoctors(): void {
    this.doctorService.getDoctors().subscribe({
      next: (doctors) => {
        this.doctors = doctors;
      },

      error: (error) => {
        console.error('Unable to load doctors', error);
      },
    });
  }

  generateReport(filter: AppointmentReportFilter): void {
    this.loadReport(filter);
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
