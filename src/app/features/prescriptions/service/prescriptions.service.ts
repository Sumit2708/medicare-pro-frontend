import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment';
import { Medicine, Prescription } from '../model/prescription.model';


@Injectable({ providedIn: 'root' })
export class PrescriptionService {
  private readonly baseUrl = `${environment.API_URL}/prescriptions`;
  private readonly medicinesUrl = `${environment.API_URL}/medicines`;

  constructor(private http: HttpClient) {}

  // ---- Prescriptions ----

  getByPatient(patientId: string): Observable<Prescription[]> {
    return this.http.get<Prescription[]>(`${this.baseUrl}?patientId=${patientId}`);
  }

  getByAppointment(appointmentId: string): Observable<Prescription[]> {
    return this.http.get<Prescription[]>(`${this.baseUrl}?appointmentId=${appointmentId}`);
  }

  getById(id: string): Observable<Prescription> {
    return this.http.get<Prescription>(`${this.baseUrl}/${id}`);
  }

  create(prescription: Omit<Prescription, 'id'>): Observable<Prescription> {
    return this.http.post<Prescription>(this.baseUrl, prescription);
  }

  update(id: string, prescription: Partial<Prescription>): Observable<Prescription> {
    return this.http.patch<Prescription>(`${this.baseUrl}/${id}`, prescription);
  }

  cancel(id: string): Observable<Prescription> {
    return this.update(id, { status: 'cancelled' });
  }

  // ---- Medicine master ----

  getAllMedicines(): Observable<Medicine[]> {
    return this.http.get<Medicine[]>(this.medicinesUrl);
  }

  searchMedicines(query: string): Observable<Medicine[]> {
    return this.http.get<Medicine[]>(`${this.medicinesUrl}?name_like=${encodeURIComponent(query)}`);
  }

  addMedicine(medicine: Omit<Medicine, 'id'>): Observable<Medicine> {
    return this.http.post<Medicine>(this.medicinesUrl, medicine);
  }
}