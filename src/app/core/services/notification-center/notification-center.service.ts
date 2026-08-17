import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { DashboardService } from '../../../features/dashboard/services/dashboard/dashboard.service';

export interface AppNotification {
  id: string;
  icon: string;
  title: string;
  message: string;
  type: 'appointment' | 'payment' | 'system';
  timestamp: Date;
  read: boolean;
}

const READ_IDS_KEY = 'medicare_read_notification_ids';

@Injectable({ providedIn: 'root' })
export class NotificationCenterService {
  private notificationsSubject = new BehaviorSubject<AppNotification[]>([]);
  notifications$ = this.notificationsSubject.asObservable();

  unreadCount$ = this.notifications$.pipe(
    map((list) => list.filter((n) => !n.read).length)
  );

  constructor(private dashboardService: DashboardService) {
    this.loadNotifications();
  }

  private getReadIds(): Set<string> {
    try {
      const raw = localStorage.getItem(READ_IDS_KEY);
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch {
      return new Set();
    }
  }

  private saveReadIds(ids: Set<string>): void {
    localStorage.setItem(READ_IDS_KEY, JSON.stringify(Array.from(ids)));
  }

  private loadNotifications(): void {
    const readIds = this.getReadIds();

    this.dashboardService.getDashboardData().subscribe((dashboard: any) => {
      const items: AppNotification[] = [];

      (dashboard.recentAppointments ?? []).slice(0, 5).forEach((a: any, i: number) => {
        const id = `appt-${a.id ?? i}`;
        items.push({
          id,
          icon: 'event_available',
          title: `Appointment with ${a.doctorName}`,
          message: `${a.patientName} · ${a.status}`,
          type: 'appointment',
          timestamp: new Date(a.appointmentDate ?? Date.now()),
          read: readIds.has(id),
        });
      });

      (dashboard.pendingInvoices ?? []).slice(0, 5).forEach((p: any, i: number) => {
        const id = `pay-${p.id ?? i}`;
        items.push({
          id,
          icon: 'payments',
          title: `Payment pending — ${p.invoiceNumber}`,
          message: `${p.patientName} · ₹${p.amount}`,
          type: 'payment',
          timestamp: new Date(),
          read: readIds.has(id),
        });
      });

      items.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      this.notificationsSubject.next(items);
    });
  }

  markAsRead(id: string): void {
    const readIds = this.getReadIds();
    readIds.add(id);
    this.saveReadIds(readIds);

    const updated = this.notificationsSubject.value.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    this.notificationsSubject.next(updated);
  }

  markAllAsRead(): void {
    const readIds = this.getReadIds();
    const updated = this.notificationsSubject.value.map((n) => {
      readIds.add(n.id);
      return { ...n, read: true };
    });
    this.saveReadIds(readIds);
    this.notificationsSubject.next(updated);
  }

  refresh(): void {
    this.loadNotifications();
  }
}