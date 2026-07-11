import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../../../core/services/notification/notification.service';
import { forkJoin } from 'rxjs';
import { DoctorService } from '../../../doctors/services/doctor.service';
import { AppointmentService } from '../../../appointments/services/appointment.service';
import { PatientService } from '../../../patients/services/patient.service';

@Component({
  selector: 'app-create-invoice',
  imports: [],
  templateUrl: './create-invoice.component.html',
  styleUrl: './create-invoice.component.scss',
})
export class CreateInvoiceComponent {
  appointmentId: any;
  doctors: any;
  patients: any;
  appointments: any;

  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private doctorService: DoctorService,
    private patientService: PatientService,
    private appointmentService: AppointmentService,
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: any) => {
      console.log(params, 'params');
      this.appointmentId = params['data'];
      console.log(this.appointmentId, 'appointmentId test');
    });
  }

  loadinvoiceData() {
    forkJoin([
      this.doctorService.getDoctors(),
      this.patientService.getPatients(),
      this.appointmentService.getAppointments(),
    ]).subscribe({
      next: ([doctors, patients, appointments]) => {
        this.doctors = doctors;
        this.patients = patients;
        this.appointments = appointments;
      },

      error: () => {
        this.notificationService.error('Failed to load data');
      },
    });
  }
}
