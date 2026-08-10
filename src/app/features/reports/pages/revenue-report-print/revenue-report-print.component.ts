import { Component, OnInit } from '@angular/core';

import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';

import { ActivatedRoute } from '@angular/router';

import { MatTableModule } from '@angular/material/table';

import { RevenueReportModel } from '../../models/revenue-report.model';

import { RevenueSummaryModel } from '../../models/revenue-summary.model';
import { ReportsService } from '../../service/reports.service';
import { RevenueReportFilter } from '../../models/report-filter.model';

@Component({
  selector: 'app-revenue-report-print',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe, MatTableModule],
  templateUrl: './revenue-report-print.component.html',
  styleUrl: './revenue-report-print.component.scss',
})
export class RevenueReportPrintComponent implements OnInit {
  summary!: RevenueSummaryModel;

  invoices: RevenueReportModel[] = [];

  displayedColumns: string[] = [
    'invoice',
    'patient',
    'doctor',
    'date',
    'status',
    'amount',
  ];

  loading = true;

  currentDate = new Date();

  fromDate = '';

  toDate = '';

  paymentStatus = 'ALL';

  constructor(
    private route: ActivatedRoute,
    private reportsService: ReportsService,
  ) {}

  ngOnInit(): void {
    this.loadReport();
  }

  ngAfterViewInit(): void {

  setTimeout(() => {
    window.print();
  }, 500);

  window.addEventListener('afterprint', () => {
    window.close();
  });

}

  private loadReport(): void {
    const params = this.route.snapshot.queryParamMap;

    this.fromDate = params.get('fromDate') ?? '';

    this.toDate = params.get('toDate') ?? '';

    this.paymentStatus = params.get('paymentStatus') ?? 'ALL';

    const filter: RevenueReportFilter = {
      fromDate: this.fromDate || null,

      toDate: this.toDate || null,

      paymentStatus: this.paymentStatus,
    };

    this.reportsService.getRevenueReport(filter).subscribe({
      next: (response) => {
        this.summary = response.summary;

        this.invoices = response.invoices;

        this.loading = false;

        setTimeout(() => {
          window.print();
        }, 500);
      },

      error: (error) => {
        console.error('Unable to load revenue report', error);

        this.loading = false;
      },
    });
  }
}
