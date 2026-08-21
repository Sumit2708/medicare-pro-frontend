import { Component, ViewChild } from '@angular/core';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { Router, RouterLink } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { InvoiceTable } from '../../models/invoice-table.model';
import { InvoiceService } from '../../services/invoice.service';
import { MatOption } from '@angular/material/core';
import {
  MatSelect,
  MatLabel,
  MatFormField,
  MatSelectModule,
} from '@angular/material/select';
import { MatCard } from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PaymentMethod, PaymentStatus } from '../../../../core/enums/payment-status.enum';

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
    FormsModule,
    RouterLink,
    MatProgressSpinnerModule,
    CommonModule
  ],
  templateUrl: './invoice-list.component.html',
  styleUrl: './invoice-list.component.scss',
})
export class InvoiceListComponent {
  displayedColumns: string[] = [
    'invoiceNumber', 'patientName', 'doctorName', 'total',
    'paymentMethod', 'paymentStatus', 'createdDate', 'actions',
  ];

  dataSource = new MatTableDataSource<any>();
  loading = false;

  // stats strip
  totalInvoices = 0;
  paidAmount = 0;
  pendingAmount = 0;

  private _paginator!: MatPaginator;
  @ViewChild(MatPaginator) set paginator(mp: MatPaginator) {
    this._paginator = mp;
    if (mp) this.dataSource.paginator = mp;
  }
  get paginator(): MatPaginator {
    return this._paginator;
  }

  @ViewChild(MatSort) set sort(ms: MatSort) {
    if (ms) this.dataSource.sort = ms;
  }

  searchText = '';
  selectedStatus = '';
  selectedPaymentMethod = '';


  // invoice-list.component.ts — add near the top of the class
paymentMethodOptions = [
  { value: PaymentMethod.CASH, icon: 'payments' },
  { value: PaymentMethod.UPI, icon: 'qr_code_2' },
  { value: PaymentMethod.CARD, icon: 'credit_card' },
  { value: PaymentMethod.INSURANCE, icon: 'health_and_safety' },
];

paymentStatusOptions = [
  { value: PaymentStatus.PENDING, icon: 'schedule' },
  { value: PaymentStatus.PAID, icon: 'task_alt' },
  { value: PaymentStatus.CANCELLED, icon: 'cancel' },
];

  constructor(
    private router: Router,
    private invoiceService: InvoiceService,
  ) {}

  ngOnInit(): void {
    this.configureFilter();
    this.loadInvoices();
  }

  loadInvoices(): void {
    this.loading = true;

    this.invoiceService.getInvoiceTableData().subscribe({
      next: (response) => {
        this.dataSource.data = response;
        this.computeStats(response);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  private computeStats(rows: any[]): void {
    this.totalInvoices = rows.length;
    this.paidAmount = rows
      .filter((r) => r.paymentStatus === 'Paid')
      .reduce((sum, r) => sum + (r.total || 0), 0);
    this.pendingAmount = rows
      .filter((r) => r.paymentStatus === 'Pending')
      .reduce((sum, r) => sum + (r.total || 0), 0);
  }

  private configureFilter(): void {
    this.dataSource.filterPredicate = (data, filter) => {
      const filters = JSON.parse(filter);
      const matchesSearch =
        !filters.search ||
        data.invoiceNumber.toLowerCase().includes(filters.search) ||
        data.patientName.toLowerCase().includes(filters.search);
      const matchesStatus = !filters.status || data.paymentStatus === filters.status;
      const matchesMethod = !filters.method || data.paymentMethod === filters.method;
      return matchesSearch && matchesStatus && matchesMethod;
    };
  }

  applyFilters(): void {
    this.dataSource.filter = JSON.stringify({
      search: this.searchText.trim().toLowerCase(),
      status: this.selectedStatus,
      method: this.selectedPaymentMethod,
    });
  }

  clearFilters(): void {
    this.searchText = '';
    this.selectedStatus = '';
    this.selectedPaymentMethod = '';
    this.applyFilters();
  }

  navCreateInvoice() {
    this.router.navigate(['/billing/create']);
  }
}