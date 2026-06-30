import { Component } from '@angular/core';
import { MatToolbar, MatToolbarModule } from '@angular/material/toolbar';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth/auth.service';
import { NotificationService } from '../../../core/services/notification/notification.service';
import { Router } from '@angular/router';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-navbar',
  imports: [MatToolbarModule, MatIconModule,MatMenuModule,MatMenuTrigger],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router,
  ) {}

  logout() {
    this.authService.logout();
    this.notificationService.success('Successfully logged out. See you soon!');
    this.router.navigate(['/login']);
  }

  navProfile() {
    // this.router.navigate(['/profile']);
    console.log('Comming Soon');
    
  }
}
