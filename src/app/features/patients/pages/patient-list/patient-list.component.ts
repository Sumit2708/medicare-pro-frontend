import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { PatientService } from '../../services/patient.service';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatCard } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { NotificationService } from '../../../../core/services/notification/notification.service';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { SearchBoxComponent } from '../../../../shared/components/search-box/search-box.component';
import { DialogService } from '../../../../core/services/dialog/dialog.service';
import { Patient } from '../../../../shared/models/patient.model';

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [
    MatCard,
    CommonModule,
    MatTableModule,
    MatSort,
    MatPaginator,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatButtonModule,
    PageHeaderComponent,
    SearchBoxComponent,
  ],
  templateUrl: './patient-list.component.html',
  styleUrl: './patient-list.component.scss',
})
export class PatientListComponent implements AfterViewInit {
  dataSource = new MatTableDataSource<Patient>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [
    'id',
    'name',
    'age',
    'gender',
    'mobile',
    'status',
    'actions',
  ];

  constructor(
    private patientService: PatientService,
    private router: Router,
    private notificationService: NotificationService,
    private dialogService: DialogService,
  ) {}

  ngOnInit() {
    this.loadPatients();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getPatientIndex(index: number): number {
    if (!this.paginator) {
      return index + 1;
    }

    return this.paginator.pageIndex * this.paginator.pageSize + index + 1;
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

  deletePatient(id: number) {
    this.dialogService
      .confirm({
        title: 'Delete Patient',

        message: 'Are you sure you want to delete this patient?',

        confirmText: 'Delete',

        cancelText: 'Cancel',
      })
      .subscribe((result: any) => {
        if (result) {
          this.patientService.deletePatient(id).subscribe({
            next: () => {
              this.notificationService.success('Patient deleted successfully');
              this.loadPatients();
            },
            error: (error) => {
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
