import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { API_ENDPOINTS } from '../../../core/constants/api-endpoints';
import { Invoice } from '../models/invoice.model';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import { InvoiceViewModel } from '../../../shared/models/invoice-view.model';
import { DoctorService } from '../../doctors/services/doctor.service';
import { PatientService } from '../../patients/services/patient.service';
import { AppointmentService } from '../../appointments/services/appointment.service';
import { InvoiceTable } from '../models/invoice-table.model';
import { InvoiceDetails } from '../models/invoice-details.model';
import { PaymentStatus } from '../../../core/enums/payment-status.enum';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  private apiUrl = `${environment.API_URL}${API_ENDPOINTS.INVOICES}`;

  constructor(
    private http: HttpClient,
    private appointmentService: AppointmentService,
    private doctorService: DoctorService,
    private patientService: PatientService,
  ) {}

  // getInvoices(doctorId?: string): Observable<Invoice[]> {
  //   // json-server supports query-param filtering directly
  //   const url = doctorId ? `${this.apiUrl}?doctorId=${doctorId}` : this.apiUrl;
  //   return this.http.get<Invoice[]>(url);
  // }


  getInvoices(doctorId?: string): Observable<Invoice[]> {
  const url = doctorId ? `${this.apiUrl}?doctorId=${doctorId}` : this.apiUrl;
  return this.http.get<Invoice[]>(url).pipe(
    map((invoices) =>
      doctorId
        ? invoices.filter((inv) => String(inv.doctorId) === String(doctorId))
        : invoices,
    ),
  );
}

  createInvoice(invoice: Invoice): Observable<Invoice> {
    return this.http.post<Invoice>(this.apiUrl, invoice);
  }

  getInvoiceById(id: number): Observable<Invoice> {
    return this.http.get<Invoice>(`${this.apiUrl}/${id}`);
  }

  loadInvoiceData(appointmentId: number): Observable<any> {
    return this.appointmentService.getAppointmentById(appointmentId).pipe(
      switchMap((appointment: any) =>
        forkJoin({
          doctor: this.doctorService.getDoctorById(appointment.doctorId),
          patient: this.patientService.getPatientById(appointment.patientId),
        }).pipe(
          map(({ doctor, patient }) => ({
            appointment,
            doctor,
            patient,
          })),
        ),
      ),
    );
  }

  checkInvoiceExists(appointmentId: number): Observable<boolean> {
    return this.http
      .get<Invoice[]>(`${this.apiUrl}?appointmentId=${appointmentId}`)
      .pipe(map((invoices) => invoices.length > 0));
  }

  generateInvoiceNumber(): Observable<string> {
    return this.getInvoices().pipe(
      map((invoices) => {
        const nextNumber = invoices.length + 1;
        const year = new Date().getFullYear();
        return `INV-${year}-${nextNumber.toString().padStart(5, '0')}`;
      }),
    );
  }

  /**
   * @param doctorId When provided, scopes the table data to a single doctor's invoices
   * (e.g. for the doctor-role invoice list, or a doctor's own income view).
   */
  getInvoiceTableData(doctorId?: string): Observable<InvoiceTable[]> {
    return forkJoin({
      invoices: this.getInvoices(doctorId),
      patients: this.patientService.getPatients(),
      doctors: this.doctorService.getDoctors(),
    }).pipe(
      map(({ invoices, patients, doctors }) => {
        return invoices.map((invoice) => {
          const patient = patients.find((p) => p.id === invoice.patientId);
          const doctor = doctors.find((d) => d.id === invoice.doctorId);

          return {
            id: invoice.id!,
            invoiceNumber: invoice.invoiceNumber,
            patientName: patient?.name ?? '-',
            doctorName: doctor?.name ?? '-',
            total: invoice.total,
            paymentMethod: invoice.paymentMethod,
            paymentStatus: invoice.paymentStatus,
            createdDate: invoice.createdDate,
          };
        });
      }),
    );
  }

  loadInvoiceDetails(id: any): Observable<InvoiceDetails> {
    return this.getInvoiceById(id).pipe(
      switchMap((invoice) => {
        return forkJoin({
          patient: this.patientService.getPatientById(invoice.patientId),
          doctor: this.doctorService.getDoctorById(invoice.doctorId),
        }).pipe(
          map(({ patient, doctor }) => ({
            invoice,
            patient,
            doctor,
          })),
        );
      }),
    );
  }

  updateInvoice(invoice: Invoice): Observable<Invoice> {
    return this.http.put<Invoice>(`${this.apiUrl}/${invoice.id}`, invoice);
  }

  markInvoiceAsPaid(id: number): Observable<Invoice> {
    return this.http.patch<Invoice>(`${this.apiUrl}/${id}`, {
      paymentStatus: PaymentStatus.PAID,
    });
  }

  /**
   * Sum of PAID invoice totals for a given doctor — the doctor's realized income.
   * Pass a date range if you want "this month's income" rather than all-time.
   */
  getDoctorIncome(
    doctorId: string,
    range?: { from: Date; to: Date },
  ): Observable<number> {
    return this.getInvoices(doctorId).pipe(
      map((invoices) =>
        invoices
          .filter((inv) => {
            if (inv.paymentStatus !== PaymentStatus.PAID) return false;
            if (!range) return true;
            const created = new Date(inv.createdDate);
            return created >= range.from && created <= range.to;
          })
          .reduce((sum, inv) => sum + inv.total, 0),
      ),
    );
  }
}