import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { ChartCardComponent } from '../../../shared/components/chart-card/chart-card.component';
import { CheckInItem, CheckInRow, ReceptionistDashboardViewModel, WaitingQueueItem } from '../../../shared/models/receptionist-dashboard.viewmodel';
import { SummaryCardsComponent } from "../components/summary-cards/summary-cards.component";
import { MatButtonModule } from '@angular/material/button';
import { AlertItem, AlertBannerComponent } from '../../../shared/components/alert-baner/alert-baner.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { AppointmentService } from '../../appointments/services/appointment.service';
import { NotificationService } from '../../../core/services/notification/notification.service';


@Component({
  selector: 'app-receptionist-dashboard',
  standalone: true,
  imports: [CommonModule, MatCard, MatCardContent, MatIcon, MatTooltip, ChartCardComponent, SummaryCardsComponent, MatButtonModule, AlertBannerComponent, EmptyStateComponent],
  templateUrl: './receptionist-dashboard.component.html',
  styleUrl: './receptionist-dashboard.component.scss',
})
export class ReceptionistDashboardComponent {
  @Input({ required: true }) dashboard!: ReceptionistDashboardViewModel;
    checkingInId: string | null = null;
    waitingQueue: WaitingQueueItem[] = [];


  today = new Date();

  constructor(private router: Router,
    private appointmentService: AppointmentService,
    private notificationService: NotificationService
  ) {}

  getInitials(name: string): string {
    if (!name) return 'DR';
    const parts = name.trim().split(' ').filter(Boolean);
    return parts.slice(0, 2).map((p) => p[0].toUpperCase()).join('');
  }

  get latestCheckIns() {
  return this.dashboard.todayCheckIns.slice(0, 5);
}

  statusClass(status: string): string {
    switch (status) {
      case 'Completed':
        return 'status-success';
      case 'Cancelled':
        return 'status-danger';
      default:
        return 'status-info';
    }
  }

  trackByCheckIn(index: number, item: CheckInItem): number {
    return item.appointmentId;
  }

  goTo(path: string): void {
    this.router.navigate([path]);
  }

  getAlerts(dashboard: ReceptionistDashboardViewModel): AlertItem[] {
      const alerts: AlertItem[] = [];
  
      const pending = dashboard.pendingInvoicesCount ?? 0;
  
      if (pending > 0) {
        alerts.push({
          icon: 'payments',
          type: 'warning',
          message: `${pending} pending payment${
            pending > 1 ? 's' : ''
          } need attention`,
        });
      }
  
      const todayAppts = dashboard.todayAppointmentsCount ?? 0;
  
      if (todayAppts > 0) {
        alerts.push({
          icon: 'event_available',
          type: 'info',
          message: `${todayAppts} appointment${
            todayAppts > 1 ? 's' : ''
          } scheduled today`,
        });
      }
  
      return alerts;
    }




markAsSeen(item: WaitingQueueItem): void {
  this.appointmentService.updateAppointmentStatus(item.appointmentId, 'Completed').subscribe({
    next: () => {
      this.waitingQueue = this.waitingQueue.filter(
        (w) => w.appointmentId !== item.appointmentId
      );
      this.dashboard.waitingCount--;
    },
    error: () => {
      this.notificationService.error('Could not mark as seen. Try again.');
 },
  });
}

trackByWaiting(_: number, item: WaitingQueueItem): string {
  return item.appointmentId;
}


checkInPatient(item: CheckInRow): void {
  if (item.status !== 'Scheduled' || this.checkingInId) return;

  this.checkingInId = item.appointmentId;

  this.appointmentService.updateAppointmentStatus(item.appointmentId, 'CheckedIn').subscribe({
    next: () => {
      item.status = 'CheckedIn';
      this.dashboard.checkedInCount++;
      this.dashboard.waitingCount++;
      this.waitingQueue = [
        ...this.waitingQueue,
        {
          appointmentId: item.appointmentId,
          patientName: item.patientName,
          doctorName: item.doctorName,
          checkedInAt: new Date(),
        },
      ];
      this.checkingInId = null;
    },
    error: () => {
      this.notificationService.error('Could not check in. Try again.');
      this.checkingInId = null;
    },
  });
}

navigateToWaitingQueue(): void {
  this.router.navigate(['appointments'], { queryParams: { status: 'Pending' } });
}


}