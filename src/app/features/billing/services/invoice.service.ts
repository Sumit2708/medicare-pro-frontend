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

}
