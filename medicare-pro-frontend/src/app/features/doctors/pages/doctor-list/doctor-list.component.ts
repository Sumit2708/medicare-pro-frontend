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
import { DoctorService } from '../../services/doctor.service';
import { MatButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { Router, RouterLink } from "@angular/router";
import { MatIcon } from "@angular/material/icon";

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
    MatTableModule
    // NgIf
    ,
    MatIcon
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
  ];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private doctorService: DoctorService,private router: Router) {}

  ngOnInit() {
    this.getDoctors();
    // console.log(this.dataSource.data);
    // debugger;
        console.log('FINAL DATA:', this.dataSource);

  }
   ngAfterViewInit() {
        // this.getDoctors();

    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }


  getDoctors() {
    this.doctorService.getDoctors().subscribe((data: any) => {
      // console.log('API DATA:', data); // 👈 IMPORTANT
      // this.dataSource = new MatTableDataSource(data);
      this.dataSource.data = data;

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    });
    //  console.log(this.dataSource.data,'1');
     
  }

  deleteDoctor(id: number) {
    this.doctorService.deleteDoctor(id).subscribe(() => {
      this.getDoctors();
    });
  }

  navToAddDoctor(){
    this.router.navigate(['doctors/add'])
    // debugger
    console.log('checking routes')
  }
}
