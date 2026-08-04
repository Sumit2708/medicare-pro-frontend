import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, Input } from '@angular/core';

import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { PendingPaymentViewModel } from '../../models/pending-payment.viewmodel';


@Component({
  selector: 'app-pending-payments',
  imports: [   CommonModule,
    CurrencyPipe,
    MatTableModule,
    MatChipsModule],
  templateUrl: './pending-payments.component.html',
  styleUrl: './pending-payments.component.scss'
})
export class PendingPaymentsComponent {

    @Input({ required: true })

  invoices: PendingPaymentViewModel[] = [];

  displayedColumns = [

    'invoice',

    'patient',

    'amount',

    'status'

  ];

}
