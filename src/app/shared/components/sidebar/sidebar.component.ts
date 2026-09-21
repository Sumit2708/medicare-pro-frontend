import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatNavList } from '@angular/material/list';
import { Router, RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth/auth.service';
import { User } from '../../models/user.model';
import { UserRole } from '../../../core/enums/user-role.enum';
import { SidebarService } from './service/sidebar.service';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule  , RouterLink, MatIcon],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
  currentUser: User | null = null;
  userRole = UserRole;

  readonly appVersion = '1.0.0';

  menuItems = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard', section: 'Overview',
      roles: [UserRole.ADMIN, UserRole.RECEPTIONIST, UserRole.DOCTOR] },
    // { label: 'Doctor Dashboard', icon: 'dashboard', route: '/doctor-dashboard', section: 'Overview',
    //   roles: [UserRole.DOCTOR] },
    { label: 'Doctors', icon: 'medical_services', route: '/doctors', section: 'Patient care',
      roles: [UserRole.ADMIN] },
    { label: 'Patients', icon: 'groups', route: '/patients', section: 'Patient care',
      roles: [UserRole.ADMIN , UserRole.RECEPTIONIST, UserRole.DOCTOR] },
    { label: 'Appointments', icon: 'event', route: '/appointments', section: 'Patient care',
      roles: [UserRole.ADMIN, UserRole.DOCTOR, UserRole.RECEPTIONIST] },
    { label: 'Billing', icon: 'receipt', route: '/billing', section: 'General',
      roles: [UserRole.ADMIN, UserRole.RECEPTIONIST, UserRole.DOCTOR] },
    { label: 'Reports', icon: 'assessment', route: '/reports', section: 'Admin',
      roles: [UserRole.ADMIN] },
    { label: 'Settings', icon: 'settings', route: '/settings', section: 'General',
      roles: [UserRole.ADMIN, UserRole.RECEPTIONIST, UserRole.DOCTOR] },
  ];

  constructor(
    private authService: AuthService,
    public sidebarService: SidebarService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
  }

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

  navProfile() {
    this.router.navigate(['/profile']);
    this.sidebarService.close();
  }
}