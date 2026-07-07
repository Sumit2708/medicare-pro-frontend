import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { DoctorListComponent } from './features/doctors/pages/doctor-list/doctor-list.component';
import { AddDoctorComponent } from './features/doctors/pages/add-doctor/add-doctor.component';
import { EditDoctorComponent } from './features/doctors/pages/edit-doctor/edit-doctor.component';
import { PatientListComponent } from './features/patients/pages/patient-list/patient-list.component';
import { EditPatientComponent } from './features/patients/pages/edit-patient/edit-patient.component';
import { AddPatientComponent } from './features/patients/pages/add-patient/add-patient.component';
import { AppointmentListComponent } from './features/appointments/pages/appointment-list/appointment-list.component';
import { AddAppointmentComponent } from './features/appointments/pages/add-appointment/add-appointment.component';
import { EditAppointmentComponent } from './features/appointments/pages/edit-appointment/edit-appointment.component';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { authGuard } from './core/guards/auth/auth.guard';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';
import { roleGuard } from './core/guards/role/role.guard';
import { UserRole } from './core/enums/user-role.enum';
import { AccessDeniedComponent } from './shared/components/access-denied/access-denied.component';
import { InvoiceListComponent } from './features/billing/pages/invoice-list/invoice-list.component';

const ADMIN = [UserRole.ADMIN];

const ADMIN_RECEPTION = [UserRole.ADMIN, UserRole.RECEPTIONIST];

const DOCTOR_RECEPTION = [UserRole.DOCTOR, UserRole.RECEPTIONIST];

const ALL_USERS = [UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST];

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'access-denied',
    component: AccessDeniedComponent,
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [roleGuard],
        data: {
          roles: ALL_USERS,
        },
      },

      {
        path: 'doctors',
        component: DoctorListComponent,
        canActivate: [roleGuard],
        data: {
          roles: ADMIN,
        },
      },

      {
        path: 'doctors/add',
        component: AddDoctorComponent,
        canActivate: [roleGuard],
        data: {
          roles: ADMIN,
        },
      },

      {
        path: 'doctors/edit/:id',
        component: EditDoctorComponent,
        canActivate: [roleGuard],
        data: {
          roles: ADMIN,
        },
      },

      {
        path: 'patients',
        component: PatientListComponent,
        canActivate: [roleGuard],
        data: {
          roles: DOCTOR_RECEPTION,
        },
      },

      {
        path: 'patients/add',
        component: AddPatientComponent,
        canActivate: [roleGuard],
        data: {
          roles: DOCTOR_RECEPTION,
        },
      },

      {
        path: 'patients/edit/:id',
        component: EditPatientComponent,
        canActivate: [roleGuard],
        data: {
          roles: DOCTOR_RECEPTION,
        },
      },

      {
        path: 'appointments',
        component: AppointmentListComponent,
        canActivate: [roleGuard],
        data: {
          roles: ALL_USERS,
        },
      },

      {
        path: 'appointments/add',
        component: AddAppointmentComponent,
        canActivate: [roleGuard],
        data: {
          roles: ALL_USERS,
        },
      },

      {
        path: 'appointments/edit/:id',
        component: EditAppointmentComponent,
        canActivate: [roleGuard],
        data: {
          roles: ALL_USERS,
        },
      },
      {
        path: 'billing',
        component: InvoiceListComponent,
        canActivate: [roleGuard],
        data: {
          roles: ADMIN_RECEPTION,
        },
      },
    ],
  },

  {
    path: '**',
    component: PageNotFoundComponent,
  },
];
