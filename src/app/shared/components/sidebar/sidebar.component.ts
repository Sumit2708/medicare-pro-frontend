import { Component } from '@angular/core';
import { MatNavList } from '@angular/material/list';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth/auth.service';
import { User } from '../../models/user.model';
import { UserRole } from '../../../core/enums/user-role.enum';

@Component({
  selector: 'app-sidebar',
  imports: [MatNavList, RouterLink, MatIcon],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  currentUser: User | null = null;
  userRole = UserRole;

  menuItems = [
    {
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/dashboard',
      roles: [UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST],
    },
    {
      label: 'Doctors',
      icon: 'medical_services',
      route: '/doctors',
      roles: [UserRole.ADMIN],
    },
    {
      label: 'Patients',
      icon: 'groups',
      route: '/patients',
      roles: [UserRole.ADMIN],
    },
    {
      label: 'Appointments',
      icon: 'event',
      route: '/appointments',
      roles: [UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST],
    },
    {
      label: 'Billing',
      icon: 'receipt',
      route: '/billing',
      roles: [UserRole.ADMIN, UserRole.RECEPTIONIST],
    },
    {
      label: 'Reports',
      icon: 'assessment',
      route: '/reports',
      roles: [UserRole.ADMIN],
    },
  ];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
  }
}
