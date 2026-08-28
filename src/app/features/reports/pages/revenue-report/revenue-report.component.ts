import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

import { RevenueReportModel } from '../../models/revenue-report.model';
import { ReportsService } from '../../service/reports.service';
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
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    PageHeaderComponent,
    ReportSummaryCardComponent,
    ReportExportActionsComponent,
    ReportFilterComponent,
  ],
  templateUrl: './revenue-report.component.html',
  styleUrl: './revenue-report.component.scss',
})
export class RevenueReportComponent {
  filterForm: FormGroup;
  summary!: RevenueSummaryModel;
  dataSource = new MatTableDataSource<RevenueReportModel>([]);
  displayedColumns = [
    'invoice',
    'patient',
    'doctor',
    'date',
    'status',
    'amount',
  ];

  @ViewChild('reportContent') reportContent!: ElementRef<HTMLElement>;

  private _paginator?: MatPaginator;
  @ViewChild(MatPaginator) set paginator(mp: MatPaginator) {
    if (mp) {
      this._paginator = mp;
      this.dataSource.paginator = mp;
    }
  }

  private _sort?: MatSort;
  @ViewChild(MatSort) set sort(ms: MatSort) {
    if (ms) {
      this._sort = ms;
      this.dataSource.sort = ms;
    }
  }

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
        this.dataSource.data = response.invoices;
        this._paginator?.firstPage();
      },
    });
  }

  generateReport(filter: RevenueReportFilter): void {
    this.loadReport(filter);
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }

  exportPdf(): void {
    if (!this.reportContent) return;
    this.exportService.exportPdf(
      this.reportContent.nativeElement,
      'Revenue Report',
    );
  }

  exportExcel(): void {
    this.exportService.exportExcel(this.dataSource.data, 'Revenue Report');
  }

  printReport(): void {
    const filter = this.filterForm.getRawValue();
    const queryParams = new URLSearchParams();
    if (filter.fromDate) queryParams.set('fromDate', String(filter.fromDate));
    if (filter.toDate) queryParams.set('toDate', String(filter.toDate));
    if (filter.paymentStatus)
      queryParams.set('paymentStatus', filter.paymentStatus);
    window.open(`/reports/revenue/print?${queryParams.toString()}`, '_blank');
  }

  navBack(){
    window.history.back();
  }
}
