import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';

import { AppointmentReportModel } from '../../models/appointment-report.model';
import { AppointmentSummaryModel } from '../../models/appointment-summary.model';
import { ReportsService } from '../../service/reports.service';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { ReportSummaryCardComponent } from '../../components/report-summary-card/report-summary-card.component';
import { ReportExportActionsComponent } from '../../components/report-export-actions/report-export-actions.component';
import { ReportFilterComponent } from '../../components/report-filter/report-filter.component';
import { ExportService } from '../../../../core/services/export/export.service';
import { AppointmentReportFilter } from '../../models/appointment-report-filter.model';
import { CLINIC_INFO } from '../../../../core/constants/clinic-info';

@Component({
  selector: 'app-appointment-report',
  imports: [
    CommonModule,
    DatePipe,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    PageHeaderComponent,
    ReportSummaryCardComponent,
    ReportExportActionsComponent,
    ReportFilterComponent,
    
  ],
  templateUrl: './appointment-report.component.html',
  styleUrl: './appointment-report.component.scss',
})
export class AppointmentReportComponent {
  summary!: AppointmentSummaryModel;

  dataSource = new MatTableDataSource<AppointmentReportModel>([]);

  // Full dataset used only for PDF
  exportDataSource = new MatTableDataSource<AppointmentReportModel>([]);

  displayedColumns = ['id', 'patient', 'doctor', 'date', 'time', 'status'];

  generatedDate = '';
  isExporting = false;

  // Currently selected report filter
  activeFilter: AppointmentReportFilter = {
    fromDate: null,
    toDate: null,
    status: 'ALL',
  };

  @ViewChild('reportContent') reportContent!: ElementRef<HTMLElement>;

  private _paginator?: MatPaginator;

  @ViewChild(MatPaginator)
  set paginator(mp: MatPaginator) {
    if (mp) {
      this._paginator = mp;
      this.dataSource.paginator = mp;
    }
  }

  private _sort?: MatSort;

  @ViewChild(MatSort)
  set sort(ms: MatSort) {
    if (ms) {
      this._sort = ms;
      this.dataSource.sort = ms;
    }
  }

  today: string = new Date().toISOString().split('T')[0];
   clincicInfo = CLINIC_INFO;

  constructor(
    private reportService: ReportsService,
    private exportService: ExportService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadReport();
  }

  loadReport(
    filter: AppointmentReportFilter = {
      fromDate: null,
      toDate: null,
      status: 'ALL',
    },
  ): void {
    this.activeFilter = filter;

    this.reportService.getAppointmentReport(filter).subscribe({
      next: (response) => {
        console.log(response);

        this.summary = response.summary;

        this.dataSource.data = response.appointments;

        // Important:
        // This remains completely unpaginated.
        this.exportDataSource.data = response.appointments;

        this._paginator?.firstPage();
      },
    });
  }

  generateReport(filter: AppointmentReportFilter): void {
    this.loadReport(filter);
  }

  getRowNumber(index: number): number {
    if (!this._paginator) {
      return index + 1;
    }

    return (
      this._paginator.pageIndex * this._paginator.pageSize +
      index +
      1
    );
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }

  /**
   * PDF export
   */
  async exportPdf(): Promise<void> {
  this.generatedDate = new Date().toLocaleString();

  // Tell Angular to render the PDF-only layout
  this.isExporting = true;

  // Immediately update the view
  this.cdr.detectChanges();

  // Wait for browser rendering
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve());
  });

  if (!this.reportContent) {
    console.error('PDF report content was not rendered.');
    this.isExporting = false;
    return;
  }

  try {
    await this.exportService.exportPdf(
      this.reportContent.nativeElement,
      this.generatedDate
    );
  } catch (error) {
    console.error('PDF export failed:', error);
  } finally {
    // Return to normal application UI
    this.isExporting = false;

    this.cdr.detectChanges();
  }
}
  exportExcel(): void {
    this.exportService.exportExcel(
      this.exportDataSource.data,
      new Date().toLocaleString(),
    );
  }

  printReport(): void {
    window.open('/reports/appointments/print', '_blank');
  }

  navBack(): void {
    window.history.back();
  }

  /**
   * PDF helpers
   */

  getPdfStatusClass(status: string): string {
    return status?.toLowerCase() || '';
  }

  formatReportPeriod(): string {
    const from = this.activeFilter?.fromDate;
    const to = this.activeFilter?.toDate;

    if (from && to) {
      return `${this.formatPdfDate(from)} – ${this.formatPdfDate(to)}`;
    }

    if (from) {
      return `From ${this.formatPdfDate(from)}`;
    }

    if (to) {
      return `Until ${this.formatPdfDate(to)}`;
    }

    return 'All available records';
  }

  formatPdfDate(date: string | Date | null): string {
    if (!date) {
      return '—';
    }

    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  getPdfStatus(): string {
    return this.activeFilter?.status === 'ALL'
      ? 'All'
      : this.activeFilter?.status || 'All';
  }
}