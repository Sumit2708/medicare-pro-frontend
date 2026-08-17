import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

export interface AlertItem {
  icon: string;
  message: string;
  type: 'warning' | 'info' | 'danger';
}

@Component({
  selector: 'app-alert-banner',
  standalone: true,
  imports: [CommonModule, MatIconModule],
   templateUrl: './alert-baner.component.html',
  styleUrl: './alert-baner.component.scss'
})
export class AlertBannerComponent {
  @Input() alerts: AlertItem[] = [];
}