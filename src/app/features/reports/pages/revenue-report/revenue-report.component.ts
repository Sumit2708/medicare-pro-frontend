import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { CommonModule, CurrencyPipe } from '@angular/common';

import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { MatTableModule } from '@angular/material/table';

import { MatButtonModule } from '@angular/material/button';

import { MatDatepickerModule } from '@angular/material/datepicker';

import { MatInputModule } from '@angular/material/input';

import { MatFormFieldModule } from '@angular/material/form-field';
import { RevenueReportModel } from '../../models/revenue-report.model';
import { ReportsService } from '../../service/reports.service';
import { MatCard } from '@angular/material/card';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { RevenueSummaryModel } from '../../models/revenue-summary.model';
import { ReportSummaryCardComponent } from '../../components/report-summary-card/report-summary-card.component';
import { ReportExportActionsComponent } from '../../components/report-export-actions/report-export-actions.component';
import { ReportFilterComponent } from '../../components/report-filter/report-filter.component';
import { ExportService } from '../../../../core/services/export/export.service';
import { RevenueReportFilter } from '../../models/report-filter.model';

@Component({
  selector: 'app-revenue-report',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CurrencyPipe,
    MatTableModule,
    MatButtonModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatCard,
    PageHeaderComponent,
    ReportSummaryCardComponent,
    ReportExportActionsComponent,
    ReportFilterComponent,
  ],
  templateUrl: './revenue-report.component.html',
  styleUrl: './revenue-report.component.scss',
})
export class RevenueReportComponent {
  reports: RevenueReportModel[] = [];
  filterForm: FormGroup;
  summary!: RevenueSummaryModel;

  invoices: RevenueReportModel[] = [];

  displayedColumns = [
    'invoice',
    'patient',
    'doctor',
    'date',
    'status',
    'amount',
  ];

  @ViewChild('reportContent')
  reportContent!: ElementRef<HTMLElement>;

  constructor(
    private reportService: ReportsService,
    private exportService: ExportService,
    private fb: FormBuilder,
  ) {
    this.filterForm = this.fb.group({
      fromDate: [null],

      toDate: [null],

      paymentStatus: ['ALL'],
    });
  }

  ngOnInit(): void {
    this.loadReport();
  }

  loadReport(
    filter: RevenueReportFilter = {
      fromDate: null,
      toDate: null,
      paymentStatus: 'ALL',
    },
  ): void {
    this.reportService.getRevenueReport(filter).subscribe({
      next: (response) => {
        this.summary = response.summary;
        this.invoices = response.invoices;
      },
    });
  }

  generateReport(filter: RevenueReportFilter): void {
    this.loadReport(filter);
  }

  exportPdf(): void {
    if (!this.reportContent) {
      return;
    }

    this.exportService.exportPdf(
      this.reportContent.nativeElement,
      'Revenue Report',
    );
  }

  exportExcel(): void {
    this.exportService.exportExcel(
      this.invoices,

      'Revenue Report',
    );
  }

  printReport(): void {
    const filter = this.filterForm.getRawValue();

    const queryParams = new URLSearchParams();

    if (filter.fromDate) {
      queryParams.set('fromDate', String(filter.fromDate));
    }

    if (filter.toDate) {
      queryParams.set('toDate', String(filter.toDate));
    }

    if (filter.paymentStatus) {
      queryParams.set('paymentStatus', filter.paymentStatus);
    }

    window.open(`/reports/revenue/print?${queryParams.toString()}`, '_blank');
  }
}
