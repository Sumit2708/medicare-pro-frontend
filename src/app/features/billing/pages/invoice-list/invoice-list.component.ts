import { Component, ViewChild } from '@angular/core';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { InvoiceTable } from '../../models/invoice-table.model';
import { InvoiceService } from '../../services/invoice.service';
import { MatOption } from '@angular/material/core';
import { MatSelect, MatLabel, MatFormField, MatSelectModule } from '@angular/material/select';
import { MatCard } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatIcon } from "@angular/material/icon";
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-invoice-list',
  imports: [
    PageHeaderComponent,
    MatOption,
    MatSelect,
    MatLabel,
    MatFormField,
    MatCard,
    ReactiveFormsModule,
    MatTableModule,
    MatInputModule,
    MatSelectModule,
    CurrencyPipe,
    MatIcon,
    DatePipe,
    MatPaginator,
    MatChipsModule,
    MatButtonModule,
],
  templateUrl: './invoice-list.component.html',
  styleUrl: './invoice-list.component.scss',
})


export class InvoiceListComponent {
  displayedColumns: string[] = [
    'invoiceNumber',
    'patientName',
    'doctorName',
    'total',
    'paymentMethod',
    'paymentStatus',
    'createdDate',
    'actions',
  ];

   dataSource = new MatTableDataSource<any>();

  loading = false;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort)
  sort!: MatSort;

  ngOnInit(): void {
    this.loadInvoices();
  }

  constructor(
    private router: Router,
    private invoiceService: InvoiceService,
  ) {}

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadInvoices(): void {
    this.loading = true;

    this.invoiceService.getInvoiceTableData().subscribe({
      next: (response) => {
        this.dataSource.data = response;

        this.dataSource.paginator = this.paginator;

        this.dataSource.sort = this.sort;

        this.loading = false;
      },

      error: () => {
        this.loading = false;
      },
    });
  }

  navCreateInvoice() {
    this.router.navigate(['/billing/create']);
  }
}
