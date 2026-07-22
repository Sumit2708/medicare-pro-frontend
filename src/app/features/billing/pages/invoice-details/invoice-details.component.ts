import { Component } from '@angular/core';
import { InvoiceDetails } from '../../models/invoice-details.model';
import { ActivatedRoute } from '@angular/router';
import { InvoiceService } from '../../services/invoice.service';

@Component({
  selector: 'app-invoice-details',
  imports: [],
  templateUrl: './invoice-details.component.html',
  styleUrl: './invoice-details.component.scss',
})
export class InvoiceDetailsComponent {
  invoiceDetails!: InvoiceDetails;

  loading = true;

  constructor(
    private route: ActivatedRoute,
    private invoiceService: InvoiceService,
  ) {}

  ngOnInit(): void {
    const invoiceId = this.route.snapshot.paramMap.get('id');
    // if (invoiceId) {
    //   this.invoiceService.loadInvoiceDetails(+invoiceId).subscribe((invoiceDetails) => {
    //     this.invoiceDetails = invoiceDetails;
    //     this.loading = false;
    //   });
    // }
  }

  loadInvoiceDetails(invoiceId: number): void {
    this.invoiceService.loadInvoiceDetails(invoiceId).subscribe({
      next: (res) => {
        this.invoiceDetails = res;
        this.loading = false;
      },
    });
  }
}
