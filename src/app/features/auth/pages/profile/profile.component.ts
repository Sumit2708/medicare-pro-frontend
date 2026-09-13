import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { User } from '../../../../shared/models/user.model';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../../../core/services/notification/notification.service';

@Component({
  selector: 'app-profile',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatSlideToggleModule,
    FormsModule,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  currentUser: User | null = null;

  emailNotifications = true;
  appointmentReminders = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService,
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
  }

  getInitials(name?: string | null): string {
    if (!name) return '?';
    return name
      .split(' ')
      .map((p) => p[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }

  changePassword() {
    // TODO: route to your actual change-password flow/dialog
    this.router.navigate(['/settings']);
  }

  editProfile() {
    this.notificationService.info('Coming soon: Edit profile feature is under development.');
    // TODO: route to your actual edit-profile flow/dialog
    // this.router.navigate(['/settings']);
  }
}
