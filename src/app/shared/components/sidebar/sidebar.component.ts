import { Component } from '@angular/core';
import { MatNavList } from '@angular/material/list';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth/auth.service';
import { User } from '../../models/user.model';
import { UserRole } from '../../../core/enums/user-role.enum';
import { SidebarService } from './service/sidebar.service';

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
  { label: 'Dashboard', icon: 'dashboard', route: '/dashboard', section: 'Overview',
    roles: [UserRole.ADMIN, UserRole.RECEPTIONIST] },
  { label: 'Doctor Dashboard', icon: 'dashboard', route: '/doctor-dashboard', section: 'Overview',
    roles: [UserRole.DOCTOR] },

  { label: 'Doctors', icon: 'medical_services', route: '/doctors', section: 'Patient care',
    roles: [UserRole.ADMIN] },
  { label: 'Patients', icon: 'groups', route: '/patients', section: 'Patient care',
    roles: [UserRole.ADMIN] },
  { label: 'Appointments', icon: 'event', route: '/appointments', section: 'Patient care',
    roles: [UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST] },

  { label: 'Billing', icon: 'receipt', route: '/billing', section: 'Admin',
    roles: [UserRole.ADMIN, UserRole.RECEPTIONIST] },
  { label: 'Reports', icon: 'assessment', route: '/reports', section: 'Admin',
    roles: [UserRole.ADMIN] },
  { label: 'Settings', icon: 'settings', route: '/settings', section: 'Admin',
    roles: [UserRole.ADMIN] },
];

get groupedMenuItems() {
  if (!this.currentUser) return [];
  const visible = this.menuItems.filter((item) =>
    item.roles.includes(this.currentUser!.role),
  );
  const sections = [...new Set(visible.map((i) => i.section))];
  return sections.map((label) => ({
    label,
    items: visible.filter((i) => i.section === label),
  }));
}
  constructor(private authService: AuthService, public sidebarService: SidebarService) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
  }

  get visibleMenuItems() {
    if (!this.currentUser) return [];
    return this.menuItems.filter((item) =>
      item.roles.includes(this.currentUser!.role),
    );
  }
}
