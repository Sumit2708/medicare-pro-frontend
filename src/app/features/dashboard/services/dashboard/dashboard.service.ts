import { Injectable } from '@angular/core';
import { InvoiceService } from '../../../billing/services/invoice.service';
import { AppointmentService } from '../../../appointments/services/appointment.service';
import { DoctorService } from '../../../doctors/services/doctor.service';
import { PatientService } from '../../../patients/services/patient.service';
import { Observable } from 'rxjs/internal/Observable';
import { DashboardViewModel } from '../../models/dashboard.viewmodel';
import { forkJoin, map } from 'rxjs';
import { PaymentStatus } from '../../../../core/enums/payment-status.enum';
import { RevenueChartModel } from '../../models/revenue-chart.model';
import { Invoice } from '../../../../shared/models/invoice.model';
import { Appointment } from '../../../../shared/models/appointment.model';
import { AppointmentChartModel } from '../../models/appointment-chart.model';
import { PaymentChartModel } from '../../models/payment-summary.model';
import { DashboardFilter } from '../../../../core/enums/dashboard-filter.enum';

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

        const todayCollectedRevenue = data.invoices
          .filter(
            (invoice) =>
              invoice.paymentStatus === PaymentStatus.PAID &&
              invoice.createdDate.split('T')[0] === today,
          )
          .reduce((sum, invoice) => sum + invoice.total, 0);

        // const recentAppointments = [...data.appointments]
        //   .sort(
        //     (a, b) =>
        //       new Date(b.appointmentDate).getTime() -
        //       new Date(a.appointmentDate).getTime(),
        //   )
        //   .slice(0, 5);

        const recentAppointments = [...data.appointments]
          .sort(
            (a, b) =>
              new Date(b.appointmentDate).getTime() -
              new Date(a.appointmentDate).getTime(),
          )
          .slice(0, 5)
          .map((appointment) => {
            const doctor = data.doctors.find(
              (d) => d.id === appointment.doctorId,
            );

            const patient = data.patients.find(
              (p) => p.id === appointment.patientId,
            );

            return {
              appointmentDate: appointment.appointmentDate
                ? appointment.appointmentDate
                : appointment.date,

              appointmentTime: appointment.appointmentTime
                ? appointment.appointmentTime
                : appointment.time,

              doctorName: doctor?.name ?? 'Unknown',

              patientName: patient?.name ?? 'Unknown',

              status: appointment.status,
            };
          });

        // const pendingInvoices = data.invoices.filter(
        //   (invoice) => invoice.paymentStatus === PaymentStatus.PENDING,
        // );

        const pendingInvoices = data.invoices

          .filter((invoice) => invoice.paymentStatus === PaymentStatus.PENDING)

          .map((invoice) => {
            const patient = data.patients.find(
              (p) => p.id === invoice.patientId,
            );

            return {
              invoiceNumber: invoice.invoiceNumber,

              patientName: patient?.name ?? 'Unknown',

              amount: invoice.total,

              paymentStatus: invoice.paymentStatus,
            };
          });

        //     const filteredInvoices =
        // this.filterInvoices(
        //     data.invoices,
        //     filter
        // );

        // const filteredAppointments =
        // this.filterAppointments(
        //     data.appointments,
        //     filter
        // );

        return {
          totalPatients,

          totalDoctors,

          todayAppointments,

          todayCollectedRevenue,

          monthlyRevenue: this.buildMonthlyRevenueChart(data.invoices),

          monthlyAppointments: this.buildAppointmentChart(data.appointments),

          paymentSummary: this.buildPaymentSummary(data.invoices),

          recentAppointments,

          pendingInvoices,

          data: data,
        };
      }),
    );
  }

  private buildMonthlyRevenueChart(invoices: Invoice[]): RevenueChartModel[] {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    return months.map((month, index) => ({
      month,

      revenue: invoices

        .filter((invoice) => {
          const date = new Date(invoice.createdDate);

          return (
            date.getMonth() === index &&
            invoice.paymentStatus == PaymentStatus.PAID
          );
        })

        .reduce(
          (sum, invoice) => sum + invoice.total,

          0,
        ),
    }));
  }

  private buildAppointmentChart(
    appointments: Appointment[],
  ): AppointmentChartModel[] {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    return months.map((month, index) => ({
      month,
      appointments: appointments.filter(
        (a) =>
          new Date(
            a.appointmentDate ? a.appointmentDate : a.date,
          ).getMonth() === index,
      ).length,
    }));
  }

  private buildPaymentSummary(invoices: Invoice[]): PaymentChartModel[] {
    const summary = new Map<string, number>();

    invoices.forEach((invoice) => {
      summary.set(
        invoice.paymentStatus,

        (summary.get(invoice.paymentStatus) ?? 0) + 1,
      );
    });

    return Array.from(summary).map(([status, count]) => ({
      status,

      count,
    }));
  }

  //   private filterInvoices(

  //     invoices:Invoice[],

  //     filter:DashboardFilter

  // ):Invoice[]{

  //     switch(filter){

  //         case DashboardFilter.TODAY:

  //             ...

  //         case DashboardFilter.WEEK:

  //             ...

  //         case DashboardFilter.MONTH:

  //             ...

  //         case DashboardFilter.YEAR:

  //             ...

  //         default:

  //             return invoices;

  //     }

  // }
}
