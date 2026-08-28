import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';

import { DoctorPerformanceModel } from '../../models/doctor-performance.model';
import { ReportsService } from '../../service/reports.service';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { ReportSummaryCardComponent } from '../../components/report-summary-card/report-summary-card.component';

@Component({
  selector: 'app-doctor-performance-report',
  imports: [
    CommonModule,
    CurrencyPipe,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    PageHeaderComponent,
    ReportSummaryCardComponent,
  ],
  templateUrl: './doctor-performance-report.component.html',
  styleUrl: './doctor-performance-report.component.scss',
})
export class DoctorPerformanceReportComponent {
  performance: DoctorPerformanceModel[] = [];
  dataSource = new MatTableDataSource<DoctorPerformanceModel>([]);

  displayedColumns = ['doctor', 'specialization', 'appointments', 'revenue', 'average'];

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

  constructor(private reportService: ReportsService) {
    this.loadReport();
  }

  private loadReport(): void {
    this.reportService.getDoctorPerformance().subscribe({
      next: (data) => {
        this.performance = data;
        this.dataSource.data = data;
        this._paginator?.firstPage();
      },
    });
  }

  getInitials(name: string): string {
    return name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
  }

  getTotalRevenue(): number {
    return this.performance.reduce((sum, row) => sum + row.revenue, 0);
  }

  getTotalAppointments(): number {
    return this.performance.reduce((sum, row) => sum + row.appointments, 0);
  }

    navBack(){
    window.history.back();
  }
}