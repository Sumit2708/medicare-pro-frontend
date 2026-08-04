import { CommonModule, DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';

import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { Appointment } from '../../../../shared/models/appointment.model';
import { RecentAppointmentViewModel } from './model/recent-appointment.viewmodel';

@Component({
  selector: 'app-recent-appointments',
  imports: [CommonModule, MatTableModule, MatChipsModule, DatePipe],
  templateUrl: './recent-appointments.component.html',
  styleUrl: './recent-appointments.component.scss',
})
export class RecentAppointmentsComponent {
  @Input({ required: true })
  appointments: RecentAppointmentViewModel[] = [];

  displayedColumns = ['date', 'time', 'doctor', 'patient', 'status'];


  getStatusClass(status: string): string {

  switch (status.toLowerCase()) {

    case 'completed':

      return 'completed';

    case 'pending':

      return 'pending';

    case 'cancelled':

      return 'cancelled';

    default:

      return '';

  }

}
}
