import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, EMPTY, throwError } from 'rxjs';
import { switchMap, tap, catchError } from 'rxjs/operators';
import { environment } from '../../../../environment/environment';
import { Medicine, Prescription } from '../model/prescription.model';
import { PatientService } from '../../patients/services/patient.service';
import { AppointmentService } from '../../appointments/services/appointment.service';
import { DoctorService } from '../../doctors/services/doctor.service';
import { Patient } from '../../../shared/models/patient.model';
import { Appointment } from '../../../shared/models/appointment.model';
import { Doctor } from '../../../shared/models/doctor.model';

@Injectable({ providedIn: 'root' })
export class PrescriptionService {
  private readonly baseUrl = `${environment.API_URL}/prescriptions`;
  private readonly medicinesUrl = `${environment.API_URL}/medicines`;

  patient: Patient | null = null;
  appointment: Appointment | null = null;
  doctor: Doctor | null = null;
  patientName = '';

  constructor(
    private http: HttpClient,
    private patientService: PatientService,
    private appointmentService: AppointmentService,
    private doctorService: DoctorService,
  ) {}

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

  // ---- Master patient/appointment/doctor load for prescription context ----

  /**
   * Loads patient -> relevant Scheduled appointment -> doctor, storing each
   * on the service as it resolves, and returns an Observable<Doctor> so the
   * caller can subscribe and know exactly when it's safe to build a
   * prescription. Errors (including "no scheduled appointment") are surfaced
   * to the caller rather than swallowed here, so the component decides how
   * to show them.
   */
  loadPatientData(patientId: string): Observable<Doctor> {
    return this.patientService.getPatientById(patientId).pipe(
      tap((patient) => {
        this.patient = patient;
        this.patientName = patient.name;
      }),
      switchMap((patient) => this.appointmentService.getAppointmentsByPatientId(patient.id)),
      switchMap((appointments: Appointment[]) => {
        console.log(appointments,'appointemnt');
        
        const relevantAppointment = this.pickRelevantAppointment(appointments);
        if (!relevantAppointment) {
          return throwError(() => new Error('No scheduled appointment found for this patient'));
        }
        this.appointment = relevantAppointment;
        return this.doctorService.getDoctorById(relevantAppointment.doctorId);
      }),
      tap((doctor) => (this.doctor = doctor)),
    );
  }

 
  private pickRelevantAppointment(appointments: Appointment[]): Appointment | null {
    const scheduled = appointments?.filter((a) => a.status === 'Scheduled' || a.status === 'Completed' ) ?? [];
    if (!scheduled.length) return null;

    const today = new Date().toDateString();
    const todays = scheduled.find((a) => new Date(a.date).toDateString() === today);
    if (todays) return todays;

    return (
      scheduled
        .sort((a, b) => +new Date(a.date) - +new Date(b.date))
        .find((a) => new Date(a.date) >= new Date()) ?? null
    );
  }


   /** Clears context — call when leaving the prescription flow. */
  resetContext(): void {
    this.patient = null;
    this.appointment = null;
    this.doctor = null;
    this.patientName = '';
  }

}