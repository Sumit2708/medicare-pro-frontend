import { Component } from '@angular/core';
import { MatNavList } from '@angular/material/list';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-sidebar',
  imports: [MatNavList, RouterLink, MatIcon],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {

  currentUser: User | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
  }
}
