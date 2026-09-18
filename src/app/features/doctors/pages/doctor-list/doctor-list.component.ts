import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { AppointmentsChartComponent } from '../../../dashboard/components/appointments-chart/appointments-chart.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { ChartCardComponent } from '../../../../shared/components/chart-card/chart-card.component';
import { DoctorDashboardViewModel, DoctorScheduleItem } from '../../../../shared/models/doctor-dashboard.viewmodel';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { DialogService } from '../../../../core/services/dialog/dialog.service';
import { DoctorService } from '../../services/doctor.service';
import { NotificationService } from '../../../../core/services/notification/notification.service';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { SearchBoxComponent } from '../../../../shared/components/search-box/search-box.component';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';


@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCard,
    MatCardContent,
    MatButtonModule,
    MatIcon,
    ChartCardComponent,
    AppointmentsChartComponent,
    EmptyStateComponent,
    PageHeaderComponent,
    SearchBoxComponent,
    MatPaginator,
    MatMenu,
    MatMenuTrigger
],
    templateUrl: './doctor-list.component.html',
  styleUrl: './doctor-list.component.scss',
})
export class DoctorListComponent {

  dataSource = new MatTableDataSource<any>();

  private _paginator!: MatPaginator;
  @ViewChild(MatPaginator) set paginator(mp: MatPaginator) {
    this._paginator = mp;
    if (mp) {
      this.dataSource.paginator = mp;
    }
  }
  get paginator(): MatPaginator {
    return this._paginator;
  }



  @Input({ required: true }) dashboard!: DoctorDashboardViewModel;

  today = new Date();
   
  constructor(private authService: AuthService,
    private dialogService: DialogService,
    private router: Router,
    private doctorService: DoctorService,
    private notificationService: NotificationService
  ) {}

  get currentUserName(): string {
    return this.authService.getCurrentUser()?.name ?? 'Doctor';
  }

  ngOnInit() {
    this.getDoctors();
  }

  get pagedDoctors() {
    const data = this.dataSource.filteredData;
    if (!this.paginator) return data;
    const start = this.paginator.pageIndex * this.paginator.pageSize;
    return data.slice(start, start + this.paginator.pageSize);
  }

  getInitials(name: string): string {
    if (!name) return 'DR';
    const parts = name.trim().split(' ').filter(Boolean);
    return parts.slice(0, 2).map((p) => p[0].toUpperCase()).join('');
  }

  statusClass(status: string): string {
    switch (status) {
      case 'Completed':
        return 'status-success';
      case 'Cancelled':
        return 'status-danger';
      default:
        return 'status-info';
    }
  }

  trackBySchedule(index: number, item: DoctorScheduleItem): string {
    return item.patientName + item.time;
  }

  trackByAppt(index: number, item: DoctorScheduleItem): string {
    return item.patientName + item.date + item.time;
  }
  getQualifications(raw: string): string[] {
    if (!raw) return [];
    return raw.split(',').map((q) => q.trim()).filter(Boolean);
  }

  getDoctors() {
    this.doctorService.getDoctors().subscribe((data: any) => {
      this.dataSource.data = data;
    });
  }

  deleteDoctor(id: number): void {
    this.dialogService.confirm({
      title: 'Delete Doctor',
      message: 'Are you sure you want to delete this doctor?',
      confirmText: 'Delete',
      cancelText: 'Cancel',
    }).subscribe((result) => {
      if (result) {
        this.doctorService.deleteDoctor(id).subscribe({
          next: () => {
            this.notificationService.success('Doctor deleted successfully');
            this.getDoctors();
          },
          error: () => {
            this.notificationService.error('Failed to delete doctor');
          },
        });
      }
    });
  }

  navToEditDoctor(data: any) {
    this.router.navigate(['doctors/edit'], { queryParams: { id: data.id } });
  }

  applyFilter(value: string) {
    this.dataSource.filter = value.trim().toLowerCase();
  }

  openAddDoctor() {
    this.router.navigate(['doctors/add']);
  }
}