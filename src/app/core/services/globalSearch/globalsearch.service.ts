import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { map, catchError, shareReplay } from 'rxjs/operators';

import { PatientService } from '../../../features/patients/services/patient.service';
import { DoctorService } from '../../../features/doctors/services/doctor.service';
import { AppointmentService } from '../../../features/appointments/services/appointment.service';
import { InvoiceService } from '../../../features/billing/services/invoice.service';
import { InvoiceTable } from '../../../features/billing/models/invoice-table.model';
import { PaymentStatus } from '../../../core/enums/payment-status.enum';

export interface SearchResultItem {
  name: string;
  meta: string;
  initials: string;
  chipBg: string;
  chipColor: string;
  route: string;
  id: string | number;
}

export interface SearchResultGroup {
  label: string;
  items: SearchResultItem[];
}

@Injectable({
  providedIn: 'root',
})
export class GlobalSearchService {
  private searchData$: Observable<{
    patients: any[];
    doctors: any[];
    appointments: any[];
    invoices: InvoiceTable[];
  }>;

  constructor(
    private patientService: PatientService,
    private doctorService: DoctorService,
    private appointmentService: AppointmentService,
    private invoiceService: InvoiceService,
  ) {
    // Initialize AFTER services are available
    this.searchData$ = forkJoin({
      patients: this.patientService
        .getPatients()
        .pipe(catchError(() => of([]))),

      doctors: this.doctorService
        .getDoctors()
        .pipe(catchError(() => of([]))),

      appointments: this.appointmentService
        .getAppointments()
        .pipe(catchError(() => of([]))),

      invoices: this.invoiceService
        .getInvoiceTableData()
        .pipe(catchError(() => of([]))),
    }).pipe(
      shareReplay({
        bufferSize: 1,
        refCount: true,
      }),
    );
  }

  searchAll(term: string): Observable<SearchResultGroup[]> {
    const q = term.trim().toLowerCase();

    if (!q) {
      return of([]);
    }

    return this.searchData$.pipe(
      map(({ patients, doctors, appointments, invoices }) => {
        const groups: SearchResultGroup[] = [];

        // =========================
        // PATIENTS
        // =========================

        const patientResults: SearchResultItem[] = patients
          .filter((patient: any) =>
            patient.name?.toLowerCase().includes(q),
          )
          .slice(0, 5)
          .map((patient: any) => ({
            name: patient.name,
            meta: patient.phone ?? 'Patient',
            initials: this.initials(patient.name),
            chipBg: '#e4f0ee',
            chipColor: '#0f5e5a',
            route: '/patients/edit',
            id: patient.id,
          }));

        if (patientResults.length) {
          groups.push({
            label: 'Patients',
            items: patientResults,
          });
        }

        // =========================
        // DOCTORS
        // =========================

        const doctorResults: SearchResultItem[] = doctors
          .filter((doctor: any) =>
            doctor.name?.toLowerCase().includes(q),
          )
          .slice(0, 5)
          .map((doctor: any) => ({
            name: doctor.name,
            meta: doctor.specialization ?? 'Doctor',
            initials: this.initials(doctor.name),
            chipBg: '#fbf1e3',
            chipColor: '#854f0b',
            route: '/doctors/edit',
            id: doctor.id,
          }));

        if (doctorResults.length) {
          groups.push({
            label: 'Doctors',
            items: doctorResults,
          });
        }

        // =========================
        // APPOINTMENTS
        // =========================

        const appointmentResults: SearchResultItem[] = appointments
          .filter(
            (appointment: any) =>
              appointment.patientName
                ?.toLowerCase()
                .includes(q) ||
              appointment.doctorName
                ?.toLowerCase()
                .includes(q),
          )
          .slice(0, 5)
          .map((appointment: any) => ({
            name: `${appointment.patientName} → ${appointment.doctorName}`,
            meta:
              appointment.date
                ?.split('-')
                .reverse()
                .join('-') ?? '',
            initials: 'AP',
            chipBg: '#eef0ef',
            chipColor: '#5b6b72',
            route: '/appointments/edit',
            id: appointment.id,
          }));

        if (appointmentResults.length) {
          groups.push({
            label: 'Appointments',
            items: appointmentResults,
          });
        }

        // =========================
        // INVOICES
        // =========================

        const invoiceResults: SearchResultItem[] = invoices
          .filter(
            (invoice) =>
              invoice.invoiceNumber?.toLowerCase().includes(q) ||
              invoice.patientName?.toLowerCase().includes(q) ||
              invoice.doctorName?.toLowerCase().includes(q),
          )
          .slice(0, 5)
          .map((invoice) => {
            const { chipBg, chipColor } = this.invoiceChip(
              invoice.paymentStatus,
            );

            return {
              name: invoice.patientName,
              meta: `#${invoice.invoiceNumber} · ${invoice.paymentStatus}`,
              initials: this.initials(invoice.patientName),
              chipBg,
              chipColor,
              route: '/billing',
              id: invoice.id,
            };
          });

        if (invoiceResults.length) {
          groups.push({
            label: 'Invoices',
            items: invoiceResults,
          });
        }

        return groups;
      }),
    );
  }

  private invoiceChip(status: PaymentStatus): {
    chipBg: string;
    chipColor: string;
  } {
    if (status === PaymentStatus.PAID) {
      return { chipBg: '#e4f5ec', chipColor: '#2f9e68' };
    }

    return { chipBg: '#fbeee0', chipColor: '#e8a33d' };
  }

  private initials(name: string): string {
    if (!name) {
      return '';
    }

    return name
      .trim()
      .split(/\s+/)
      .map((part) => part.charAt(0))
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }
}