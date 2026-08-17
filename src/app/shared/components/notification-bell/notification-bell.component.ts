import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { Observable } from 'rxjs';
import { NotificationCenterService, AppNotification } from '../../../core/services/notification-center/notification-center.service';

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatMenuModule, MatButtonModule],
  templateUrl: './notification-bell.component.html',
  styleUrl: './notification-bell.component.scss',
})
export class NotificationBellComponent {
  notifications$: Observable<AppNotification[]>;
  unreadCount$: Observable<number>;

  constructor(private notificationCenter: NotificationCenterService) {
    this.notifications$ = this.notificationCenter.notifications$;
    this.unreadCount$ = this.notificationCenter.unreadCount$;
  }

  markAsRead(n: AppNotification): void {
    this.notificationCenter.markAsRead(n.id);
  }

  markAllAsRead(): void {
    this.notificationCenter.markAllAsRead();
  }

  timeAgo(date: Date): string {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  }
}