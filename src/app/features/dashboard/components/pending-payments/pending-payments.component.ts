import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, Input } from '@angular/core';

import { MatTableModule } from '@angular/material/table';
import { PendingPaymentViewModel } from '../../models/pending-payment.viewmodel';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-pending-payments',
  imports: [CommonModule, CurrencyPipe, MatTableModule, MatIcon],
  templateUrl: './pending-payments.component.html',
  styleUrl: './pending-payments.component.scss',
})
export class PendingPaymentsComponent {
  @Input({ required: true })
  invoices: PendingPaymentViewModel[] = [];

  displayedColumns = ['invoice', 'patient', 'amount', 'status'];

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'paid':
        return 'paid';
      case 'pending':
        return 'pending';
      case 'overdue':
        return 'overdue';
      case 'partial':
        return 'partial';
      default:
        return '';
    }
  }
}
