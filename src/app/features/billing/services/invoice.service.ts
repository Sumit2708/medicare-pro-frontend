import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment';
import { API_ENDPOINTS } from '../../../core/constants/api-endpoints';
import { Invoice } from '../models/invoice.model';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import { InvoiceViewModel } from '../../../shared/models/invoice-view.model';
import { DoctorService } from '../../doctors/services/doctor.service';
import { PatientService } from '../../patients/services/patient.service';
import { AppointmentService } from '../../appointments/services/appointment.service';
import { InvoiceTable } from '../models/invoice-table.model';
import { InvoiceDetails } from '../models/invoice-details.model';

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

  getInvoices(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(this.apiUrl);
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

  getInvoiceTableData(): Observable<InvoiceTable[]> {
    return forkJoin({
      invoices: this.getInvoices(),

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

  loadInvoiceDetails(id: number): Observable<InvoiceDetails> {
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
}
