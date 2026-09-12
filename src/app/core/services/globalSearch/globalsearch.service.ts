import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { PatientService } from '../../../features/patients/services/patient.service';
import { DoctorService } from '../../../features/doctors/services/doctor.service';
import { AppointmentService } from '../../../features/appointments/services/appointment.service';

export interface SearchResultItem {
  name: string;
  meta: string;
  initials: string;
  chipBg: string;
  chipColor: string;
  route: string;
}

export interface SearchResultGroup {
  label: string;
  items: SearchResultItem[];
}

@Injectable({ providedIn: 'root' })
export class GlobalSearchService {
  constructor(
    private patientService: PatientService,
    private doctorService: DoctorService,
    private appointmentService: AppointmentService
  ) {}

  searchAll(term: string): Observable<SearchResultGroup[]> {
    const q = term.trim().toLowerCase();
    if (!q) return of([]);

    return forkJoin({
      patients: this.patientService.getPatients().pipe(catchError(() => of([]))),
      doctors: this.doctorService.getDoctors().pipe(catchError(() => of([]))),
      appointments: this.appointmentService.getAppointments().pipe(catchError(() => of([]))),
    }).pipe(
      map(({ patients, doctors, appointments }) => {
        const groups: SearchResultGroup[] = [];

        const p = patients
          .filter((x: any) => x.name?.toLowerCase().includes(q))
          .slice(0, 5)
          .map((x: any) => ({
            name: x.name, meta: x.phone ?? 'Patient',
            initials: this.initials(x.name), chipBg: '#e4f0ee', chipColor: '#0f5e5a',
            route: `/patients/${x.id}`,
          }));
        if (p.length) groups.push({ label: 'Patients', items: p });

        const d = doctors
          .filter((x: any) => x.name?.toLowerCase().includes(q))
          .slice(0, 5)
          .map((x: any) => ({
            name: x.name, meta: x.specialization ?? 'Doctor',
            initials: this.initials(x.name), chipBg: '#fbf1e3', chipColor: '#854f0b',
            route: `/doctors/${x.id}`,
          }));
        if (d.length) groups.push({ label: 'Doctors', items: d });

        const a = appointments
          .filter((x: any) =>
            x.patientName?.toLowerCase().includes(q) || x.doctorName?.toLowerCase().includes(q))
          .slice(0, 5)
          .map((x: any) => ({
            name: `${x.patientName} → ${x.doctorName}`, meta: x.date,
            initials: 'AP', chipBg: '#eef0ef', chipColor: '#5b6b72',
            route: `/appointments/${x.id}`,
          }));
        if (a.length) groups.push({ label: 'Appointments', items: a });

        return groups;
      })
    );
  }

  private initials(name: string): string {
    return name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();
  }
}