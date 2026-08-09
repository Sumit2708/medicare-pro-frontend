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
        if (filter.fromDate) {
          invoices = invoices.filter(
            (invoice) =>
              new Date(invoice.createdDate) >= new Date(filter.fromDate!),
          );
        }

        // To Date
        if (filter.toDate) {
          invoices = invoices.filter(
            (invoice) =>
              new Date(invoice.createdDate) <= new Date(filter.toDate!),
          );
        }

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

  getAppointmentReport(): Observable<{
    summary: AppointmentSummaryModel;
    appointments: AppointmentReportModel[];
  }> {
    return forkJoin({
      appointments: this.appointmentService.getAppointments(),

      patients: this.patientService.getPatients(),

      doctors: this.doctorService.getDoctors(),
    }).pipe(
      map((data) => {
        const appointments = data.appointments.map((appointment) => {
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
        });

        const summary: AppointmentSummaryModel = {
          totalAppointments: appointments.length,

          completedAppointments: appointments.filter(
            (x) => x.status ===AppointmentStatus.COMPLETED,
          ).length,

          pendingAppointments: appointments.filter(
            (x) => x.status === AppointmentStatus.SCHEDULED,
          ).length,

          cancelledAppointments: appointments.filter(
            (x) => x.status === AppointmentStatus.CANCELLED,
          ).length,
        };

        return {
          summary,

          appointments,
        };
      }),
    );
  }
}
