import { Component, ViewChild } from '@angular/core';
import { PatientService } from '../../services/patient.service';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NotificationService } from '../../../../core/services/notification/notification.service';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { SearchBoxComponent } from '../../../../shared/components/search-box/search-box.component';
import { DialogService } from '../../../../core/services/dialog/dialog.service';
import { Patient } from '../../../../shared/models/patient.model';

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSort,
    MatPaginator,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    PageHeaderComponent,
    SearchBoxComponent,
  ],
  templateUrl: './patient-list.component.html',
  styleUrl: './patient-list.component.scss',
})
export class PatientListComponent {
  dataSource = new MatTableDataSource<Patient>();

  displayedColumns: string[] = [
    'id',
    'patient',
    'bloodGroup',
    'contact',
    'address',
    'status',
    'actions',
  ];

  private _paginator!: MatPaginator;
  @ViewChild(MatPaginator) set paginator(mp: MatPaginator) {
    this._paginator = mp;
    if (mp) this.dataSource.paginator = mp;
  }
  get paginator(): MatPaginator {
    return this._paginator;
  }

  private _sort!: MatSort;
  @ViewChild(MatSort) set sort(ms: MatSort) {
    this._sort = ms;
    if (ms) this.dataSource.sort = ms;
  }
  get sort(): MatSort {
    return this._sort;
  }

  constructor(
    private patientService: PatientService,
    private router: Router,
    private notificationService: NotificationService,
    private dialogService: DialogService,
  ) {}

  ngOnInit() {
    this.loadPatients();
  }

  getPatientIndex(index: number): number {
    if (!this.paginator) return index + 1;
    return this.paginator.pageIndex * this.paginator.pageSize + index + 1;
  }

  getInitials(name: string): string {
    if (!name) return 'P';
    const parts = name.trim().split(' ').filter(Boolean);
    return parts.slice(0, 2).map((p) => p[0].toUpperCase()).join('');
  }

  loadPatients(): void {
    this.patientService.getPatients().subscribe({
      next: (patients) => {
        this.dataSource.data = [...patients].reverse();
      },
      error: () => {
        this.notificationService.error('Failed to load patients');
      },
    });
  }

  applyFilter(value: string) {
    this.dataSource.filter = value.trim().toLowerCase();
  }

  navAddPatient() {
    this.router.navigate(['/patients/add']);
  }

  deletePatient(id: string) {
    this.dialogService
      .confirm({
        title: 'Delete Patient',
        message: 'Are you sure you want to delete this patient record?',
        confirmText: 'Delete',
        cancelText: 'Cancel',
      })
      .subscribe((result: any) => {
        if (result) {
          this.patientService.deletePatient(id as any).subscribe({
            next: () => {
              this.notificationService.success('Patient deleted successfully');
              this.loadPatients();
            },
            error: () => {
              this.notificationService.error('Failed to delete patient');
            },
          });
        }
      });
  }

  navToEditPatient(data: any) {
    this.router.navigate(['patients/edit'], { queryParams: { id: data.id } });
  }
}