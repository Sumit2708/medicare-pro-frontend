// import { Component, ViewChild } from '@angular/core';
// import { MatPaginator } from '@angular/material/paginator';
// import { MatSort, MatSortHeader } from '@angular/material/sort';
// import {
//   MatTableDataSource,
//   MatTable,
//   MatColumnDef,
//   MatHeaderCell,
//   MatHeaderCellDef,
//   MatCell,
//   MatCellDef,
//   MatHeaderRowDef,
//   MatRowDef,
//   MatTableModule,
// } from '@angular/material/table';
// import { MatIconModule } from '@angular/material/icon';
// import { DoctorService } from '../../services/doctor.service';
// import { MatButton, MatIconButton } from '@angular/material/button';
// import { MatCard } from '@angular/material/card';
// import { Router } from '@angular/router';
// import { MatIcon } from '@angular/material/icon';
// import {
//   MatFormField,
//   MatFormFieldControl,
//   MatFormFieldModule,
//   MatLabel,
// } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { CommonModule } from '@angular/common';
// import { MatDialog } from '@angular/material/dialog';
// import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
// import { NotificationService } from '../../../../core/services/notification/notification.service';
// import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
// import { SearchBoxComponent } from '../../../../shared/components/search-box/search-box.component';
// import { DialogService } from '../../../../core/services/dialog/dialog.service';

// @Component({
//   selector: 'app-doctor-list',
//   imports: [
//     MatButton,
//     MatCard,
//     MatTable,
//     MatSort,
//     MatColumnDef,
//     MatHeaderCell,
//     MatHeaderCellDef,
//     MatSortHeader,
//     MatCell,
//     MatCellDef,
//     MatPaginator,
//     MatHeaderRowDef,
//     MatRowDef,
//     MatTableModule,
//     MatIcon,
//     MatFormFieldModule,
//     MatInputModule,
//     MatIconModule,
//     CommonModule,
//     PageHeaderComponent,
//     SearchBoxComponent,
//     MatIconButton,
//   ],
//   templateUrl: './doctor-list.component.html',
//   styleUrl: './doctor-list.component.scss',
// })
// // export class DoctorListComponent {
// //   displayedColumns: string[] = [
// //     'id',
// //     'name',
// //     'specialization',
// //     'fee',
// //     'status',
// //     'actions',
// //   ];
// //   dataSource = new MatTableDataSource<any>();

// //   private _paginator!: MatPaginator;
// //   @ViewChild(MatPaginator) set paginator(mp: MatPaginator) {
// //     this._paginator = mp;
// //     if (mp) {
// //       this.dataSource.paginator = mp;
// //     }
// //   }
// //   get paginator(): MatPaginator {
// //     return this._paginator;
// //   }

// //   @ViewChild(MatSort) set sort(ms: MatSort) {
// //     if (ms) {
// //       this.dataSource.sort = ms;
// //     }
// //   } // displayedColumns: string[] = [
// //   //   'id',
// //   //   'name',
// //   //   'specialization',
// //   //   'fee',
// //   //   'status',
// //   //   'actions',
// //   // ];
// //   // dataSource = new MatTableDataSource<any>();

// //   // @ViewChild(MatPaginator) paginator!: MatPaginator;
// //   // @ViewChild(MatSort) sort!: MatSort;

// //   constructor(
// //     private doctorService: DoctorService,
// //     private router: Router,
// //     private notificationService: NotificationService,
// //     private dialog: MatDialog,
// //     private dialogService: DialogService,
// //   ) {}

// //   ngOnInit() {
// //     this.getDoctors();
// //   }

// //   ngAfterViewInit() {
// //     this.dataSource.paginator = this.paginator;
// //     this.dataSource.sort = this.sort;
// //   }

// //   getDoctors() {
// //     this.doctorService.getDoctors().subscribe((data: any) => {
// //       this.dataSource.data = data;
// //       // remove the two paginator/sort lines from here — no longer needed
// //     });
// //   }

// //   getDoctorIndex(index: number): number {
// //     if (!this.paginator) return index + 1;
// //     return this.paginator.pageIndex * this.paginator.pageSize + index + 1;
// //   }

// //   // deleteDoctor(id: number) {
// //   //   const dialogRef = this.dialog.open(ConfirmDialogComponent, {
// //   //     width: '400px',
// //   //     data: {
// //   //       title: 'Delete Doctor',
// //   //       message: 'Are you sure you want to delete this doctor?',
// //   //     },
// //   //   });

// //   //   dialogRef.afterClosed().subscribe((result) => {
// //   //     if (result) {
// //   //       this.doctorService.deleteDoctor(id).subscribe({
// //   //         next: () => {
// //   //           this.notificationService.success('Doctor deleted successfully');
// //   //           this.getDoctors();
// //   //         },
// //   //         error: () => {
// //   //           this.notificationService.error('Failed to delete doctor');
// //   //         },
// //   //       });
// //   //     }
// //   //   });
// //   // }

// //   deleteDoctor(id: number): void {
// //     this.dialogService
// //       .confirm({
// //         title: 'Delete Doctor',

// //         message: 'Are you sure you want to delete this doctor?',

// //         confirmText: 'Delete',

// //         cancelText: 'Cancel',
// //       })
// //       .subscribe((result) => {
// //         if (result) {
// //           this.doctorService.deleteDoctor(id).subscribe({
// //             next: () => {
// //               this.notificationService.success('Doctor deleted successfully');
// //               this.getDoctors();
// //             },
// //             error: () => {
// //               this.notificationService.error('Failed to delete doctor');
// //             },
// //           });
// //         }
// //       });
// //   }

// //   navToEditDoctor(data: any) {
// //     this.router.navigate(['doctors/edit'], { queryParams: { id: data.id } });
// //     console.log(data.id, 'data of docInfo');
// //   }

// //   applyFilter(value: string) {
// //     this.dataSource.filter = value.trim().toLowerCase();
// //   }

// //   openAddDoctor() {
// //     this.router.navigate(['doctors/add']);
// //   }
// // }




import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { DoctorService } from '../../services/doctor.service';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../../core/services/notification/notification.service';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { SearchBoxComponent } from '../../../../shared/components/search-box/search-box.component';
import { DialogService } from '../../../../core/services/dialog/dialog.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-doctor-list',
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginator,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatMenuModule,
    PageHeaderComponent,
    SearchBoxComponent,
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

  constructor(
    private doctorService: DoctorService,
    private router: Router,
    private notificationService: NotificationService,
    private dialogService: DialogService,
  ) {}

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