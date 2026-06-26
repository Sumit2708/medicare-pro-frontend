import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import {
  MatTableDataSource,
  MatTable,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatCell,
  MatCellDef,
  MatHeaderRowDef,
  MatRowDef,
  MatTableModule,
} from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { DoctorService } from '../../services/doctor.service';
import { MatButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { Router } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import {
  MatFormField,
  MatFormFieldControl,
  MatFormFieldModule,
  MatLabel,
} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../../core/services/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-doctor-list',
  imports: [
    MatButton,
    MatCard,
    MatTable,
    MatSort,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatSortHeader,
    MatCell,
    MatCellDef,
    MatPaginator,
    MatHeaderRowDef,
    MatRowDef,
    MatTableModule,
    MatIcon,
    MatFormField,
    MatLabel,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    CommonModule,
  ],
  templateUrl: './doctor-list.component.html',
  styleUrl: './doctor-list.component.scss',
})
export class DoctorListComponent {
  displayedColumns: string[] = [
    'id',
    'name',
    'specialization',
    'fee',
    'actions',
    'status',
  ];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private doctorService: DoctorService,
    private router: Router,
    private notificationService: NotificationService,
    private dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.getDoctors();
  }

  getDoctors() {
    this.doctorService.getDoctors().subscribe((data: any) => {
      console.log('API DATA:', data); // 👈 IMPORTANT
      // this.dataSource = new MatTableDataSource(data);
      this.dataSource.data = data;

      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
    //  console.log(this.dataSource.data,'1');
  }

  deleteDoctor(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Doctor',
        message: 'Are you sure you want to delete this doctor?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
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
    console.log(data.id, 'data of docInfo');
  }

  navToAddDoctor() {
    this.router.navigate(['doctors/add']);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;

    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
