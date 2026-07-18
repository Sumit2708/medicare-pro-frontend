import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../../../core/services/notification/notification.service';
import { forkJoin } from 'rxjs';
import { DoctorService } from '../../../doctors/services/doctor.service';
import { AppointmentService } from '../../../appointments/services/appointment.service';
import { PatientService } from '../../../patients/services/patient.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InvoiceService } from '../../services/invoice.service';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import {
  MatFormField,
  MatFormFieldControl,
  MatFormFieldModule,
  MatLabel,
} from '@angular/material/form-field';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatOption } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule, DatePipe } from '@angular/common';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelect } from '@angular/material/select';
import {
  PaymentMethod,
  PaymentStatus,
} from '../../../../core/enums/payment-status.enum';
import { MatDivider } from '@angular/material/divider';
import { InvoiceViewModel } from '../../../../shared/models/invoice-view.model';
import { Invoice } from '../../models/invoice.model';

@Component({
  selector: 'app-create-invoice',
  imports: [
    ReactiveFormsModule,
    PageHeaderComponent,
    MatCardModule,
    MatOption,
    MatInputModule,
    MatButtonModule,
    CommonModule,
    MatFormField,
    MatTimepickerModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatSelect,
    DatePipe,
    MatDivider,
  ],
  templateUrl: './create-invoice.component.html',
  styleUrl: './create-invoice.component.scss',
})
export class CreateInvoiceComponent {
  appointmentId: any;
  doctors: any;
  patients: any;
  invoiceForm: FormGroup;
  PaymentMethod = PaymentMethod;
  PaymentStatus = PaymentStatus;
  invoiceData!: InvoiceViewModel;
  invoiceExists = false;

  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private appointmentService: AppointmentService,
    private fb: FormBuilder,
    private invoiceService: InvoiceService,
  ) {
    this.invoiceForm = this.fb.group({
      patientName: [{ value: '', disabled: true }],
      doctorName: [{ value: '', disabled: true }],
      appointmentDate: [{ value: '', disabled: true }],
      consultationFee: [{ value: 0, disabled: true }],
      discount: [0],
      gst: [{ value: 0, disabled: true }],
      total: [{ value: 0, disabled: true }],
      paymentMethod: [PaymentMethod.CASH],
      paymentStatus: [PaymentStatus.PENDING],
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: any) => {
      console.log(params, 'params');
      this.appointmentId = params['data'];
      console.log(this.appointmentId, 'appointmentId test');
    });

    this.loadInvoiceData(this.appointmentId);
    this.checkInvoiceExists(this.appointmentId);

    this.invoiceForm.get('discount')?.valueChanges.subscribe(() => {
      this.calculateTotal();
    });
  }

  loadInvoiceData(appointmentId: number): void {
    this.invoiceService.loadInvoiceData(appointmentId).subscribe({
      next: (data) => {
        console.log(data, 'data');
        this.invoiceData = data;
        this.invoiceForm.patchValue({
          patientName: data.patient.name,

          doctorName: data.doctor.name,

          appointmentDate:
            new DatePipe('en-US').transform(
              data.appointment.date,
              'dd-MM-yyyy',
            ) || data.appointment.date,

          consultationFee: data.doctor.fee,

          paymentMethod: 'Cash',

          paymentStatus: 'Pending',
        });

        this.calculateTotal();
      },
    });
  }

  checkInvoiceExists(appointmentId: number): void {
    this.invoiceService.checkInvoiceExists(appointmentId).subscribe({
      next: (exists) => {
        this.invoiceExists = exists;

        if (exists) {
          this.notificationService.error(
            'Invoice already exists for this appointment.',
          );
        }
      },
    });
  }

  calculateTotal(): void {
    const fee = Number(this.invoiceForm.get('consultationFee')?.value);

    const discount = Number(this.invoiceForm.get('discount')?.value);

    const taxableAmount = fee - discount;

    const gst = taxableAmount * 0.18;

    const total = taxableAmount + gst;

    this.invoiceForm.patchValue({
      gst,

      total,
    });
  }

  saveInvoice(): void {
    if (this.invoiceExists) {
      this.notificationService.error('Invoice already exists.');

      return;
    }

    this.invoiceService.generateInvoiceNumber().subscribe({
      next: (invoiceNumber) => {
        const invoice: Invoice = {
          invoiceNumber,

          appointmentId: this.invoiceData.appointment.id,

          patientId: this.invoiceData.patient.id,

          doctorId: this.invoiceData.doctor.id,

          consultationFee: this.invoiceData.doctor.fee,

          discount: Number(this.invoiceForm.value.discount),
 
          gst: Number(this.invoiceForm.getRawValue().gst),

          total: Number(this.invoiceForm.getRawValue().total),

          paymentMethod: this.invoiceForm.value.paymentMethod!,

          paymentStatus: this.invoiceForm.value.paymentStatus!,

          createdDate: new Date().toISOString(),

        };

        this.createInvoice(invoice);
      },
    });
  }

  private createInvoice(invoice: Invoice): void {
    this.invoiceService.createInvoice(invoice).subscribe({
      next: () => {
        this.notificationService.success('Invoice generated successfully.');

        this.router.navigate(['/billing']);
      },
    });
  }
}
