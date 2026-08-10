import { Injectable } from '@angular/core';
import { Doctor } from '../../../shared/models/doctor.model';
import { API_ENDPOINTS } from '../../../core/constants/api-endpoints';
import { forkJoin, map, Observable } from 'rxjs';
import { DoctorPerformanceModel } from '../models/doctor-performance.model';
import { HttpClient } from '@angular/common/http';
import { Appointment } from '../../../shared/models/appointment.model';
import { Invoice } from '../../billing/models/invoice.model';
import { environment } from '../../../../environment/environment';
import { DoctorService } from '../../doctors/services/doctor.service';
import { AppointmentService } from '../../appointments/services/appointment.service';
import { InvoiceService } from '../../billing/services/invoice.service';
import { RevenueReportModel } from '../models/revenue-report.model';
import { PatientService } from '../../patients/services/patient.service';
import { RevenueSummaryModel } from '../models/revenue-summary.model';
import { RevenueReportResponse } from '../models/revenue-report-response.model';
import { RevenueReportFilter } from '../models/report-filter.model';
import { AppointmentSummaryModel } from '../models/appointment-summary.model';
import { AppointmentReportModel } from '../models/appointment-report.model';
import { AppointmentStatus } from '../../../core/enums/appointment-status.enum';
import { AppointmentReportFilter } from '../models/appointment-report-filter.model';

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  private apiUrl = `${environment.API_URL}
`;
  constructor(
    private http: HttpClient,
    private doctorService: DoctorService,
    private appointmentService: AppointmentService,
    private invoiceService: InvoiceService,
    private patientService: PatientService,
  ) {}

  getDoctorPerformance(): Observable<DoctorPerformanceModel[]> {
    return forkJoin({
      doctors: this.doctorService.getDoctors(),

      appointments: this.appointmentService.getAppointments(), //this.http.get<Appointment[]>(this.apiUrl + API_ENDPOINTS.APPOINTMENTS),

      invoices: this.invoiceService.getInvoices(),
    }).pipe(
      map((data) => {
        return data.doctors.map((doctor) => {
          const doctorAppointments = data.appointments.filter(
            (appointment) => appointment.doctorId === doctor.id,
          );

          const doctorInvoices = data.invoices.filter(
            (invoice) => invoice.doctorId === doctor.id,
          );

          const revenue = doctorInvoices.reduce(
            (sum, invoice) => sum + invoice.total,

            0,
          );

          return {
            doctorId: doctor.id,

            doctorName: doctor.name,

            specialization: doctor.specialization,

            appointments: doctorAppointments.length,

            revenue,

            averageFee: doctorAppointments.length
              ? revenue / doctorAppointments.length
              : 0,
          };
        });
      }),
    );
  }

  getRevenueReport(
    filter: RevenueReportFilter,
  ): Observable<RevenueReportResponse> {
    return forkJoin({
      invoices: this.invoiceService.getInvoices(),
      patients: this.patientService.getPatients(),
      doctors: this.doctorService.getDoctors(),
    }).pipe(
      map((data) => {
        let invoices = [...data.invoices];

        // From Date
        // From Date
        if (filter.fromDate) {
          const fromDate = new Date(filter.fromDate);
          fromDate.setHours(0, 0, 0, 0);

          invoices = invoices.filter(
            (invoice) => new Date(invoice.createdDate) >= fromDate,
          );
        }

        // To Date
        if (filter.toDate) {
          const toDate = new Date(filter.toDate);
          toDate.setHours(23, 59, 59, 999);

          invoices = invoices.filter(
            (invoice) => new Date(invoice.createdDate) <= toDate,
          );
        }

        console.log(filter, 'filter');

        // Status
        if (filter.paymentStatus && filter.paymentStatus !== 'ALL') {
          invoices = invoices.filter(
            (invoice) => invoice.paymentStatus === filter.paymentStatus,
          );
        }

        const report = invoices.map((invoice) => {
          const patient = data.patients.find((p) => p.id === invoice.patientId);

          const doctor = data.doctors.find((d) => d.id === invoice.doctorId);

          return {
            invoiceId: invoice.id,

            invoiceNumber: invoice.invoiceNumber,

            patientName: patient?.name ?? 'Unknown',

            doctorName: doctor?.name ?? 'Unknown',

            invoiceDate: invoice.createdDate,

            paymentStatus: invoice.paymentStatus,

            consultationFee: invoice.consultationFee,

            discount: invoice.discount,

            gst: invoice.gst,

            total: invoice.total,
          };
        });

        const summary = {
          totalRevenue: report.reduce((sum, x) => sum + x.total, 0),

          totalInvoices: report.length,

          averageInvoice: report.length
            ? report.reduce((sum, x) => sum + x.total, 0) / report.length
            : 0,

          totalGST: report.reduce((sum, x) => sum + x.gst, 0),
        };

        return {
          summary,

          invoices: report,
        };
      }),
    );
  }

  // getAppointmentReport(): Observable<{
  //   summary: AppointmentSummaryModel;
  //   appointments: AppointmentReportModel[];
  // }> {
  //   return forkJoin({
  //     appointments: this.appointmentService.getAppointments(),

  //     patients: this.patientService.getPatients(),

  //     doctors: this.doctorService.getDoctors(),
  //   }).pipe(
  //     map((data) => {
  //       const appointments = data.appointments.map((appointment) => {
  //         const patient = data.patients.find(
  //           (p) => p.id === appointment.patientId,
  //         );

  //         const doctor = data.doctors.find(
  //           (d) => d.id === appointment.doctorId,
  //         );

  //         let report = appointments;

  //         return {
  //           appointmentId: appointment.id!,

  //           appointmentDate: appointment.date,

  //           appointmentTime: appointment.time,

  //           patientName: patient?.name ?? 'Unknown',

  //           doctorName: doctor?.name ?? 'Unknown',

  //           specialization: doctor?.specialization ?? 'Unknown',

  //           status: appointment.status,
  //         };
  //       });

  //       const summary: AppointmentSummaryModel = {
  //         totalAppointments: appointments.length,

  //         completedAppointments: appointments.filter(
  //           (x) => x.status ===AppointmentStatus.COMPLETED,
  //         ).length,

  //         pendingAppointments: appointments.filter(
  //           (x) => x.status === AppointmentStatus.SCHEDULED,
  //         ).length,

  //         cancelledAppointments: appointments.filter(
  //           (x) => x.status === AppointmentStatus.CANCELLED,
  //         ).length,
  //       };

  //       return {
  //         summary,

  //         appointments,
  //       };
  //     }),
  //   );
  // }

  getAppointmentReport(filter?: AppointmentReportFilter): Observable<{
    summary: AppointmentSummaryModel;
    appointments: AppointmentReportModel[];
  }> {
    return forkJoin({
      appointments: this.appointmentService.getAppointments(),

      patients: this.patientService.getPatients(),

      doctors: this.doctorService.getDoctors(),
    }).pipe(
      map((data) => {
        // 1. Convert original appointments into report rows
        let report: AppointmentReportModel[] = data.appointments.map(
          (appointment) => {
            const patient = data.patients.find(
              (p) => p.id === appointment.patientId,
            );

            const doctor = data.doctors.find(
              (d) => d.id === appointment.doctorId,
            );

            return {
              appointmentId: appointment.id!,

              appointmentDate: appointment.date,

              appointmentTime: appointment.time,

              patientName: patient?.name ?? 'Unknown',

              doctorName: doctor?.name ?? 'Unknown',

              specialization: doctor?.specialization ?? 'Unknown',

              status: appointment.status,
            };
          },
        );

        // 2. FROM DATE FILTER

        if (filter?.fromDate) {
          report = report.filter(
            (appointment) => new Date(appointment.appointmentDate) >= new Date(filter.fromDate!),
          );
        }

        // 3. TO DATE FILTER

        if (filter?.toDate) {
          report = report.filter(
            (appointment) => new Date(appointment.appointmentDate) <= new Date(filter.toDate!),
          );
        }

        // 4. DOCTOR FILTER

        if (filter?.doctorId !== null && filter?.doctorId !== undefined) {
          report = report.filter((appointment) => {
            const originalAppointment = data.appointments.find(
              (a) => a.id === appointment.appointmentId,
            );

            return originalAppointment?.doctorId === filter.doctorId;
          });
        }

        // 5. STATUS FILTER

        console.log(filter, 'filter');

        if (filter?.status && filter.status !== 'ALL') {
          report = report.filter(
            (appointment) => appointment.status === filter.status,
          );
        }

        // 6. CALCULATE SUMMARY
        // IMPORTANT: calculate from filtered report

        const summary: AppointmentSummaryModel = {
          totalAppointments: report.length,

          completedAppointments: report.filter(
            (x) => x.status === AppointmentStatus.COMPLETED,
          ).length,

          pendingAppointments: report.filter(
            (x) => x.status === AppointmentStatus.SCHEDULED,
          ).length,

          cancelledAppointments: report.filter(
            (x) => x.status === AppointmentStatus.CANCELLED,
          ).length,
        };

        // 7. RETURN FILTERED DATA

        return {
          summary,

          appointments: report,
        };
      }),
    );
  }
}
