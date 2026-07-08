import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../../../core/services/notification/notification.service';

@Component({
  selector: 'app-create-invoice',
  imports: [],
  templateUrl: './create-invoice.component.html',
  styleUrl: './create-invoice.component.scss'
})
export class CreateInvoiceComponent {
  appointmentId: any;


  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private route:ActivatedRoute
  ){}

 ngOnInit(): void {
  this.route.queryParams.subscribe((params: any) => {
    console.log(params,'params');
    this.appointmentId = params['data'];
    console.log(this.appointmentId, 'appointmentId test');
  });

}

}
