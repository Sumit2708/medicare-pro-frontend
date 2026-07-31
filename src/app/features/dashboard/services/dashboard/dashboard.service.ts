import { Injectable } from '@angular/core';
import { InvoiceService } from '../../../billing/services/invoice.service';
import { AppointmentService } from '../../../appointments/services/appointment.service';
import { DoctorService } from '../../../doctors/services/doctor.service';
import { PatientService } from '../../../patients/services/patient.service';
import { Observable } from 'rxjs/internal/Observable';
import { DashboardViewModel } from '../../models/dashboard.viewmodel';
import { forkJoin, map } from 'rxjs';
import { PaymentStatus } from '../../../../core/enums/payment-status.enum';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(
    private patientService: PatientService,
    private doctorService: DoctorService,
    private appointmentService: AppointmentService,
    private invoiceService: InvoiceService,
  ) {}

  getDashboardData() {
    return forkJoin({
      patients: this.patientService.getPatients(),

      doctors: this.doctorService.getDoctors(),

      appointments: this.appointmentService.getAppointments(),

      invoices: this.invoiceService.getInvoices(),
    }).pipe(
      map((data) => {
        const today = new Date().toISOString().split('T')[0];

        const totalPatients = data.patients.length;

        const totalDoctors = data.doctors.length;

        const todayAppointments = (data as any).appointments.filter(
          (appointment: any) => appointment.appointmentDate === today,
        ).length;

        const todayRevenue = data.invoices

          .filter(
            (invoice) =>
              invoice.paymentStatus === PaymentStatus.PAID &&
              invoice.createdDate === today,
          )

          .reduce(
            (total, invoice) => total + invoice.total,

            0,
          );

        return {
          totalPatients,

          totalDoctors,

          todayAppointments,

          todayRevenue,
        };
      }),
    );
  }
}
