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
import { DoctorDashboardViewModel } from '../../../../shared/models/doctor-dashboard.viewmodel';
import {
  CheckInItem,
  DoctorAvailabilityItem,
  ReceptionistDashboardViewModel,
} from '../../../../shared/models/receptionist-dashboard.viewmodel';

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

        const todayAppointments = data.appointments.filter(
          (appointment: any) => appointment.date == today,
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
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
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

        console.log(
          'data',
          todayAppointments,
          todayCollectedRevenue,
          data,
          today,
        );
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

 getDoctorDashboardData(
  doctorId: number,
): Observable<DoctorDashboardViewModel> {
  console.log('Doctor Dashboard ID:', doctorId);

  return forkJoin({
    patients: this.patientService.getPatients(),
    doctors: this.doctorService.getDoctors(),
    appointments: this.appointmentService.getAppointments(),
    invoices: this.invoiceService.getInvoices(),
  }).pipe(
    map((data) => {
      const doctor = data.doctors.find((d) => d.id === doctorId);

      const myAppointments = (data.appointments as any[]).filter(
        (a) => a.doctorId === doctorId,
      );

      const myInvoices = (data.invoices as any[]).filter(
        (inv) => inv.doctorId === doctorId,
      );

      const today = new Date().toISOString().split('T')[0];
      const now = new Date();

      const todaySchedule = myAppointments
        .filter((a) => (a.appointmentDate ?? a.date) === today)
        .sort((a, b) =>
          (a.appointmentTime ?? a.time).localeCompare(
            b.appointmentTime ?? b.time,
          ),
        )
        .map((a) => this.toScheduleItem(a, data.patients));

      const nowDate = new Date();
      const upcomingAppointments = myAppointments
        .filter((a) => {
          const time = a.appointmentTime ?? a.time;
          const apptDateTime = new Date(
            `${a.appointmentDate ?? a.date}T${time}`,
          );
          return (
            apptDateTime > nowDate &&
            a.status !== 'Cancelled' &&
            a.status !== 'Completed'
          );
        })
        .sort((a, b) => {
          const aTime = new Date(
            `${a.appointmentDate ?? a.date}T${a.appointmentTime ?? a.time}`,
          ).getTime();
          const bTime = new Date(
            `${b.appointmentDate ?? b.date}T${b.appointmentTime ?? b.time}`,
          ).getTime();
          return aTime - bTime;
        })
        .slice(0, 5)
        .map((a) => this.toScheduleItem(a, data.patients));

      const patientIds = Array.from(
        new Set(myAppointments.map((a) => a.patientId)),
      );

      const recentPatients: DoctorDashboardViewModel['recentPatients'] =
        patientIds
          .map((pid) => {
            const patient = data.patients.find((p: any) => p.id === pid);
            const visits = myAppointments.filter((a) => a.patientId === pid);
            const last = [...visits].sort(
              (a, b) =>
                new Date(b.appointmentDate ?? b.date).getTime() -
                new Date(a.appointmentDate ?? a.date).getTime(),
            )[0];
            return {
              name: patient?.name ?? 'Unknown',
              lastVisit: last ? (last.appointmentDate ?? last.date) : '',
              visitCount: visits.length,
            };
          })
          .sort(
            (a, b) =>
              new Date(b.lastVisit).getTime() -
              new Date(a.lastVisit).getTime(),
          )
          .slice(0, 5);

      const monthlyAppointmentsCount = myAppointments.filter((a) => {
        const d = new Date(a.appointmentDate ?? a.date);
        return (
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear()
        );
      }).length;

      // This month's realized income: PAID invoices only, created this month
      const monthlyIncome = myInvoices
        .filter((inv) => {
          if (inv.paymentStatus !== 'Paid') return false;
          const d = new Date(inv.createdDate);
          return (
            d.getMonth() === now.getMonth() &&
            d.getFullYear() === now.getFullYear()
          );
        })
        .reduce((sum, inv) => sum + (inv.total ?? 0), 0);

      // All-time total, in case you want to show both on the card
      const totalIncome = myInvoices
        .filter((inv) => inv.paymentStatus === 'Paid')
        .reduce((sum, inv) => sum + (inv.total ?? 0), 0);

      return {
        doctorName: doctor?.name ?? 'Doctor',
        specialization: doctor?.specialization ?? '',
        photoUrl: doctor?.photoUrl,
        todayAppointmentsCount: todaySchedule.length,
        totalPatients: patientIds.length,
        monthlyAppointmentsCount,
        monthlyIncome,
        totalIncome,
        todaySchedule,
        upcomingAppointments,
        recentPatients,
        monthlyTrend: this.buildDoctorMonthlyTrend(myAppointments),
      };
    }),
  );
}

private toScheduleItem(a: any, patients: any[]): any {
    const patient = patients.find((p) => p.id === a.patientId);
    return {
      patientName: patient?.name ?? 'Unknown',
      date: a.appointmentDate ?? a.date,
      time: a.appointmentTime ?? a.time,
      status: a.status,
    };
  }

  private buildDoctorMonthlyTrend(appointments: any[]) {
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
        (a) => new Date(a.appointmentDate ?? a.date).getMonth() === index,
      ).length,
    }));
  }

  getReceptionistDashboardData(): Observable<ReceptionistDashboardViewModel> {
    return forkJoin({
      patients: this.patientService.getPatients(),
      doctors: this.doctorService.getDoctors(),
      appointments: this.appointmentService.getAppointments(),
      invoices: this.invoiceService.getInvoices(),
    }).pipe(
      map((data) => {
        const today = new Date().toISOString().split('T')[0];

        const todaysAppointments = (data.appointments as any[]).filter(
          (a) => (a.appointmentDate ?? a.date) === today,
        );

        const todayCheckIns: CheckInItem[] = [...todaysAppointments]
          .sort((a, b) =>
            (a.appointmentTime ?? a.time ?? '').localeCompare(
              a.appointmentTime ?? b.time ?? '',
            ),
          )
          .map((a) => {
            const patient = data.patients.find(
              (p: any) => p.id === a.patientId,
            );
            const doctor = data.doctors.find((d: any) => d.id === a.doctorId);
            const invoice = data.invoices.find(
              (i: any) => i.appointmentId == a.id,
            );
            console.log('a:', a);
            console.log('Invoice:', invoice);
            return {
              appointmentId: a.id,
              patientName: patient?.name ?? 'Unknown',
              doctorName: doctor?.name ?? 'Unknown',
              time: a.appointmentTime ?? a.time,
              date: a.appointmentDate ?? a.date,
              status: a.status,
              payemntAmount: invoice?.total ?? 0,
              paymentStatus: invoice?.paymentStatus,
            };
          });

        const checkedInCount = todaysAppointments.filter(
          (a) => a.status === 'Completed',
        ).length;

        const waitingCount = todaysAppointments.filter(
          (a) => a.status === 'Scheduled',
        ).length;

        const doctorsAvailability: DoctorAvailabilityItem[] = (
          data.doctors as any[]
        ).map((d) => ({
          id: d.id,
          name: d.name,
          specialization: d.specialization,
          photoUrl: d.photoUrl,
          status: d.status,
          todayAppointmentsCount: todaysAppointments.filter(
            (a) => a.doctorId === d.id,
          ).length,
        }));

        const todayInvoices = data.invoices.filter(
          (inv) => inv.createdDate?.split('T')[0] === today,
        );

        const todayCollectedRevenue = todayInvoices
          .filter((inv) => inv.paymentStatus === PaymentStatus.PAID)
          .reduce((sum, inv) => sum + inv.total, 0);

        const pendingToday = todayInvoices.filter(
          (inv) => inv.paymentStatus === PaymentStatus.PENDING,
        );

        const todayPendingAmount = pendingToday.reduce(
          (sum, inv) => sum + inv.total,
          0,
        );

        const pendingInvoicesCount = data.invoices.filter(
          (inv) => inv.paymentStatus === PaymentStatus.PENDING,
        ).length;

        return {
          todayAppointmentsCount: todaysAppointments.length,
          checkedInCount,
          waitingCount,
          todayCollectedRevenue,
          todayPendingAmount,
          pendingInvoicesCount,
          todayCheckIns,
          doctorsAvailability,
        };
      }),
    );
  }



//   getDoctorDashboardData(doctorId: string): Observable<DoctorDashboardViewModel> {
//   return forkJoin({
//     // ...existing forkJoin members (todaySchedule, upcomingAppointments, recentPatients, monthlyTrend)...
//     monthlyIncome: this.invoiceService.getDoctorIncome(doctorId, {
//       from: startOfMonth(new Date()),
//       to: endOfMonth(new Date()),
//     }),
//   }).pipe(
//     map((data) => ({
//       ...data,
//       // shape into DoctorDashboardViewModel
//     })),
//   );
// }
}
