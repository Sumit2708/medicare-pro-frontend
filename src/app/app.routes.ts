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
import { CreateInvoiceComponent } from './features/billing/pages/create-invoice/create-invoice.component';
import { InvoiceDetailsComponent } from './features/billing/pages/invoice-details/invoice-details.component';
import { PrintInvoiceComponent } from './features/billing/pages/print-invoice/print-invoice.component';
import { DoctorPerformanceReportComponent } from './features/reports/pages/doctor-performance-report/doctor-performance-report.component';
import { AppointmentReportComponent } from './features/reports/pages/appointment-report/appointment-report.component';
import { RevenueReportComponent } from './features/reports/pages/revenue-report/revenue-report.component';
import { ReportsDashboardComponent } from './features/reports/pages/reports-dashboard/reports-dashboard.component';

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
      // {
      //   path: '',
      //   redirectTo: 'dashboard',
      //   pathMatch: 'full',
      // },
      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [roleGuard],
        data: {
          roles: ADMIN_RECEPTION,
        },
      },
      {
        path: '',
        component: DashboardComponent,
        canActivate: [roleGuard],
        data: {
          roles: ADMIN_RECEPTION,
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
        path: 'doctors/edit',
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
          // roles: DOCTOR_RECEPTION,
          roles: ALL_USERS,
        },
      },

      {
        path: 'patients/add',
        component: AddPatientComponent,
        canActivate: [roleGuard],
        data: {
          // roles: DOCTOR_RECEPTION,
          roles: ALL_USERS,
        },
      },

      {
        path: 'patients/edit',
        component: EditPatientComponent,
        canActivate: [roleGuard],
        data: {
          // roles: DOCTOR_RECEPTION,
          roles: ALL_USERS,
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
        path: 'appointments/edit',
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
      {
        path: 'billing/create',
        component: CreateInvoiceComponent,
        canActivate: [roleGuard],
        data: {
          roles: ADMIN_RECEPTION,
        },
      },
      {
        path: 'billing/:id',
        component: InvoiceDetailsComponent,
        canActivate: [roleGuard],
        data: {
          roles: ADMIN_RECEPTION,
        },
      },
      {
        path: 'billing/print/:id',
        component: PrintInvoiceComponent,
        canActivate: [roleGuard],
        data: {
          roles: ADMIN_RECEPTION,
        },
      },
      {
        path: 'reports',
        component: ReportsDashboardComponent,
        canActivate: [roleGuard],
        data: {
          roles: [UserRole.ADMIN],
        },
      },
      {
        path: 'reports/revenue',
        component: RevenueReportComponent,
        canActivate: [roleGuard],
        data: {
          roles: [UserRole.ADMIN],
        },
      },
      {
        path: 'reports/appointments',
        component: AppointmentReportComponent,
        canActivate: [roleGuard],
        data: {
          roles: [UserRole.ADMIN],
        },
      },
      {
        path: 'reports/doctors',
        component: DoctorPerformanceReportComponent,
        canActivate: [roleGuard],
        data: {
          roles: [UserRole.ADMIN],
        },
      },
    ],
  },

  {
    path: '**',
    component: PageNotFoundComponent,
  },
];
