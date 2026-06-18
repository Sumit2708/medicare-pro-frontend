import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { DoctorListComponent } from './features/doctors/pages/doctor-list/doctor-list.component';
import { InvoiceListComponent } from './features/billing/invoice-list/invoice-list.component';
import { AppointmentListComponent } from './features/appointments/appointment-list/appointment-list.component';
import { AddDoctorComponent } from './features/doctors/pages/add-doctor/add-doctor.component';
import { EditDoctorComponent } from './features/doctors/pages/edit-doctor/edit-doctor.component';
import { PatientListComponent } from './features/patients/pages/patient-list/patient-list.component';
import { EditPatientComponent } from './features/patients/pages/edit-patient/edit-patient.component';
import { AddPatientComponent } from './features/patients/pages/add-patient/add-patient.component';

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
      {
        path: 'doctors/add',
        component: AddDoctorComponent,
      },
       {
        path: 'doctors/edit',
        component: EditDoctorComponent,
      },
      {
        path: 'patients/add',
        component: AddPatientComponent,
      },
      {
        path: 'patients/edit',
        component: EditPatientComponent,
      },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];
