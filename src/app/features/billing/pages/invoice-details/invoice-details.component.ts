import { Component } from '@angular/core';
import { InvoiceDetails } from '../../models/invoice-details.model';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { InvoiceService } from '../../services/invoice.service';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { MatCard, MatCardTitle } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { MatChip } from '@angular/material/chips';
import { MatIcon } from '@angular/material/icon';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { PaymentStatus } from '../../../../core/enums/payment-status.enum';
import { NotificationService } from '../../../../core/services/notification/notification.service';
import { BillingPdfService } from '../../services/pdf/billing-pdf.service';

@Component({
  selector: 'app-invoice-details',
  imports: [
    PageHeaderComponent,
    MatCard,
    MatCardTitle,
    MatDivider,
    MatChip,
    MatIcon,
    CurrencyPipe,
    DatePipe,
    MatButtonModule,
    RouterLink,
  ],
  templateUrl: './invoice-details.component.html',
  styleUrl: './invoice-details.component.scss',
})
export class InvoiceDetailsComponent {
  invoiceDetails!: InvoiceDetails;
  // loading = true;
  PaymentStatus = PaymentStatus;

  constructor(
    private route: ActivatedRoute,
    private invoiceService: InvoiceService,
    private router: Router,
    private notificationService: NotificationService,
    private billingPdfService: BillingPdfService,
  ) {}

  ngOnInit() {
    const invoiceId: any = this.route.snapshot.paramMap.get('id');
    if (invoiceId) {
      this.loadInvoiceDetails(invoiceId);
    }
  }

  loadInvoiceDetails(invoiceId: number) {
    this.invoiceService.loadInvoiceDetails(invoiceId).subscribe({
      next: (res) => {
        this.invoiceDetails = res;
        // this.loading = false;
      },
    });
  }

  //in-build pdf print
  // printInvoice(): void {
  //   this.billingPdfService.generateInvoice(this.invoiceDetails);
  // }

  //Manual window print with css
  printInvoice(): void {
    this.notificationService.success('Preparing invoice for printing...');

    const url = this.router.serializeUrl(
      this.router.createUrlTree([
        '/billing',
        'print',
        this.invoiceDetails.invoice.id,
      ]),
    );

    window.open(url, '_blank');
  }

  markAsPaid(): void {
    if (this.invoiceDetails.invoice.paymentStatus === PaymentStatus.PAID) {
      return;
    }

    this.invoiceService
      .markInvoiceAsPaid(this.invoiceDetails.invoice.id!)
      .subscribe({
        next: (invoice) => {
          this.invoiceDetails.invoice.paymentStatus = invoice.paymentStatus;
          this.loadInvoiceDetails(this.invoiceDetails.invoice.id!);
          // this.notificationService.success(
          //   'Invoice marked as paid successfully.',
          // );
        },
      });
  }
}
