import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { PatientListComponent } from './features/patients/patient-list/patient-list.component';
import { DoctorListComponent } from './features/doctors/pages/doctor-list/doctor-list.component';
import { InvoiceListComponent } from './features/billing/invoice-list/invoice-list.component';
import { AppointmentListComponent } from './features/appointments/appointment-list/appointment-list.component';

export const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'doctors', component: DoctorListComponent },
      { path: 'patients', component: PatientListComponent },
      { path: 'appointments', component: AppointmentListComponent },
      { path: 'billing', component: InvoiceListComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];
