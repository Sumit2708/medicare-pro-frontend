import { Component, OnInit } from '@angular/core';

import { CommonModule, DatePipe } from '@angular/common';

import { ActivatedRoute } from '@angular/router';

import { MatTableModule } from '@angular/material/table';

import { AppointmentReportModel } from '../../models/appointment-report.model';

import { AppointmentSummaryModel } from '../../models/appointment-summary.model';

import { AppointmentReportFilter } from '../../models/appointment-report-filter.model';
import { ReportsService } from '../../service/reports.service';

@Component({
  selector: 'app-appointment-report-print',
  standalone: true,
  imports: [CommonModule, DatePipe, MatTableModule],
  templateUrl: './appointment-report-print.component.html',
  styleUrl: './appointment-report-print.component.scss',
})
export class AppointmentReportPrintComponent implements OnInit {
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

  loading = true;
  fromDate = '';
  toDate = '';
  status = 'ALL';

  currentDate = new Date();

  //   ngAfterViewInit(): void {

  //   setTimeout(() => {
  //     window.print();
  //   }, 500);

  // }

  ngAfterViewInit(): void {
    setTimeout(() => {
      window.print();
    }, 500);

    window.addEventListener('afterprint', () => {
      window.close();
    });
  }

  constructor(
    private route: ActivatedRoute,
    private reportsService: ReportsService,
  ) {}

  ngOnInit(): void {
    this.loadReport();
  }

  private loadReport(): void {
    const params = this.route.snapshot.queryParamMap;

    this.fromDate = params.get('fromDate') ?? '';

    this.toDate = params.get('toDate') ?? '';

    this.status = params.get('status') ?? 'ALL';

    const doctorIdParam = params.get('doctorId');

    const filter: AppointmentReportFilter = {
      fromDate: this.fromDate || null,

      toDate: this.toDate || null,

      doctorId: doctorIdParam ? Number(doctorIdParam) : null,

      status: this.status,
    };

    this.reportsService.getAppointmentReport(filter).subscribe({
      next: (response) => {
        this.appointments = response.appointments;

        this.summary = response.summary;

        this.loading = false;

        setTimeout(() => {
          window.print();
        }, 500);
      },

      error: (error) => {
        console.error('Unable to load appointment report', error);

        this.loading = false;
      },
    });
  }
}
