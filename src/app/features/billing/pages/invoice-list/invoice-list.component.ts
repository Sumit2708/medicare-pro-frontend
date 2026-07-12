import { Component } from '@angular/core';
import { PageHeaderComponent } from "../../../../shared/components/page-header/page-header.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-invoice-list',
  imports: [PageHeaderComponent],
  templateUrl: './invoice-list.component.html',
  styleUrl: './invoice-list.component.scss'
})
export class InvoiceListComponent {

  constructor(
    private router: Router,
  ) {}

  navCreateInvoice() {
    this.router.navigate(['/billing/create']);
  }

}

