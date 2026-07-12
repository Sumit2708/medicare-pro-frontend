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
import { PageHeaderComponent } from "../../../../shared/components/page-header/page-header.component";
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatCard } from "@angular/material/card";
import { MatOption } from "@angular/material/core";

@Component({
  selector: 'app-create-invoice',
  imports: [ReactiveFormsModule, PageHeaderComponent, MatFormField, MatLabel, MatCard, MatOption],
  templateUrl: './create-invoice.component.html',
  styleUrl: './create-invoice.component.scss',
})
export class CreateInvoiceComponent {
  appointmentId: any;
  doctors: any;
  patients: any;
  invoiceForm: FormGroup;

  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private doctorService: DoctorService,
    private patientService: PatientService,
    private appointmentService: AppointmentService,
    private fb: FormBuilder,
    private invoiceService: InvoiceService,
  ) {
    this.invoiceForm = this.fb.group({
      patientName: [''],
      doctorName: [''],
      consultationFee: [0],
      discount: [0],
      gst: [{ value: 0, disabled: true }],
      total: [{ value: 0, disabled: true }],
      paymentMethod: ['Cash'],
      paymentStatus: ['Pending'],
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: any) => {
      console.log(params, 'params');
      this.appointmentId = params['data'];
      console.log(this.appointmentId, 'appointmentId test');
    });

    this.loadInvoiceData(this.appointmentId);

    this.invoiceForm.get('discount')?.valueChanges.subscribe(() => {
      this.calculateTotal();
    });
  }

  loadInvoiceData(appointmentId: number): void {
    this.invoiceService.loadInvoiceData(appointmentId).subscribe({
      next: (data) => {
        this.invoiceForm.patchValue({
          patientName: data.patient.name,

          doctorName: data.doctor.name,

          consultationFee: data.doctor.fee,

          paymentMethod: 'Cash',

          paymentStatus: 'Pending',
        });

        this.calculateTotal();
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
}
