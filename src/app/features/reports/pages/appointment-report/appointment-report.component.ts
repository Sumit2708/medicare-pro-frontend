import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import { ExportService } from '../../../../core/services/export/export.service';

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

  @ViewChild('reportContent')
  reportContent!: ElementRef<HTMLElement>;

  displayedColumns: string[] = [
    'date',
    'time',
    'patient',
    'doctor',
    'specialization',
    'status',
  ];

  doctors: Doctor[] = [];

  currentFilter: AppointmentReportFilter = {
    fromDate: null,
    toDate: null,
    doctorId: null,
    status: 'ALL',
  };

  constructor(
    private reportsService: ReportsService,
    private doctorService: DoctorService,
    private exportService: ExportService,
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
    this.currentFilter = filter;

    this.loadReport(filter);
  }

  exportPdf(): void {
    if (!this.reportContent) {
      return;
    }

    this.exportService.exportPdf(
      this.reportContent.nativeElement,
      'Appointment Report',
    );
  }

  exportExcel(): void {
    const data = this.appointments.map((appointment) => ({
      Date: appointment.appointmentDate,
      Time: appointment.appointmentTime,
      Patient: appointment.patientName,
      Doctor: appointment.doctorName,
      Specialization: appointment.specialization,
      Status: appointment.status,
    }));

    this.exportService.exportExcel(data, 'Appointment Report');
  }

  printReport(): void {
    const params = new URLSearchParams();

    if (this.currentFilter.fromDate) {
      params.set('fromDate', this.currentFilter.fromDate);
    }

    if (this.currentFilter.toDate) {
      params.set('toDate', this.currentFilter.toDate);
    }

    if (this.currentFilter.doctorId !== null) {
      params.set('doctorId', String(this.currentFilter.doctorId));
    }

    params.set('status', this.currentFilter.status);

    

    window.open(`/reports/appointments/print?${params.toString()}`, '_blank');
  }
}
