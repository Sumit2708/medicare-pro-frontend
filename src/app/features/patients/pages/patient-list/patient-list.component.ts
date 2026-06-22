import { Component, ViewChild } from '@angular/core';
import { PatientService } from '../../services/patient.service';
import { Router, ɵEmptyOutletComponent } from '@angular/router';
import { NotificationService } from '../../../../core/services/notification.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatCard } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import {
  MatTableDataSource,
  MatTableModule,
} from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { MatButton, MatButtonModule } from '@angular/material/button';

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
    
   ],
  templateUrl: './patient-list.component.html',
  styleUrl: './patient-list.component.scss',
})
export class PatientListComponent {
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private patientService: PatientService,
    private router: Router,
    private notificationService: NotificationService,
    private http: HttpClient,
    private dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.loadPatients();
  }

  loadPatients() {
    this.patientService.getPatients().subscribe({
      next: (patients) => {
        this.dataSource.data = patients;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (error) => {
        this.notificationService.error('Failed to load patients');
      },
      complete: () => {
        console.log('Patients loaded successfully', this.dataSource.data);
      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  navAddPatient() {
    this.router.navigate(['/patients/add']);
  }

  deletePatient(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Patient',
        message: 'Are you sure you want to delete this patient?',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
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
