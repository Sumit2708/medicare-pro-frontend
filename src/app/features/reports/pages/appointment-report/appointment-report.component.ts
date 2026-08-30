import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
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
  displayedColumns = ['id', 'patient', 'doctor', 'date', 'time', 'status'];

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

  today: any = new Date().toISOString().split('T')[0];

  constructor(
    private reportService: ReportsService,
    private exportService: ExportService,
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
    this.reportService.getAppointmentReport(filter).subscribe({
      next: (response) => {
        this.summary = response.summary;
        this.dataSource.data = response.appointments;
        // paginator is guaranteed set by now via the setter above,
        // since the @if condition becomes true right as this assigns
        this._paginator?.firstPage();
      },
    });
  }

  generateReport(filter: AppointmentReportFilter): void {
    this.loadReport(filter);
  }

  getRowNumber(index: number): number {
    if (!this._paginator) return index + 1;
    return this._paginator.pageIndex * this._paginator.pageSize + index + 1;
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
      new Date().toLocaleString(),
    );
  }

  exportExcel(): void {
    this.exportService.exportExcel(this.dataSource.data,   new Date().toLocaleString());
  }

  printReport(): void {
    window.open(`/reports/appointments/print`, '_blank');
  }

  navBack() {
    window.history.back();
  }
}
