import { Component } from '@angular/core';
import { InvoiceDetails } from '../../models/invoice-details.model';
import { InvoiceService } from '../../services/invoice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { CLINIC_INFO } from '../../../../core/constants/clinic-info';


@Component({
  selector: 'app-print-invoice',
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './print-invoice.component.html',
  styleUrl: './print-invoice.component.scss',
})
export class PrintInvoiceComponent {
  invoiceDetails!: InvoiceDetails;
  clinicInfo = CLINIC_INFO;
  loading = true;

  constructor(
    private invoiceService: InvoiceService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const id = (this.route.snapshot.paramMap.get('id'));
    this.loadInvoice(id);

    window.onafterprint = () => {
      this.router.navigate(['/billing', id]);
    };
  }

  private loadInvoice(id: any): void {
    this.invoiceService.loadInvoiceDetails(id).subscribe({
      next: (response) => {
        this.invoiceDetails = response;

        console.log(this.invoiceDetails);
        

        this.loading = false;

        setTimeout(() => {
          window.print();
        }, 10);
      },
    });
  }

  ngAfterViewInit(): void {
    window.onafterprint = () => {
      this.router.navigate([
        '/billing',

        this.route.snapshot.paramMap.get('id'),
      ]);
    };
  }

  // printInvoice(): void {
  //   this.router.navigate(['/billing', this.invoiceDetails.invoice.id, 'print']);
  // }
}
