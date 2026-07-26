import { Component } from '@angular/core';
import { InvoiceDetails } from '../../models/invoice-details.model';
import { ActivatedRoute } from '@angular/router';
import { InvoiceService } from '../../services/invoice.service';
import { PageHeaderComponent } from "../../../../shared/components/page-header/page-header.component";
import { MatCard, MatCardTitle } from "@angular/material/card";
import { MatDivider } from "@angular/material/divider";
import { MatChip } from "@angular/material/chips";
import { MatIcon } from "@angular/material/icon";
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-invoice-details',
  imports: [PageHeaderComponent, MatCard, MatCardTitle, MatDivider, MatChip, MatIcon,CurrencyPipe, DatePipe, MatButtonModule],
  templateUrl: './invoice-details.component.html',
  styleUrl: './invoice-details.component.scss',
})
export class InvoiceDetailsComponent {
  invoiceDetails!: InvoiceDetails;
  // loading = true;

  constructor(
    private route: ActivatedRoute,
    private invoiceService: InvoiceService,
  ) {}

  ngOnInit() {
    const invoiceId:any = this.route.snapshot.paramMap.get('id');
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

  printInvoice(): void {

  // Next sprint

}

markAsPaid(): void {
  // this.invoiceService.getInvoiceById(this.invoiceDetails?.invoice?.id).subscribe({
  //   next: (invoice:any) => {
  //     if (invoice.paymentStatus !== 'Paid') {
  //       invoice?.paymentStatus = 'Paid';
  //       this.invoiceService.updateInvoice(invoice).subscribe({
  //         next: () => {
  //           this.loadInvoiceDetails(this.invoiceDetails?.invoice.id);
  //         },
  //       });
  //     }
  //   },
  // });
}
}
