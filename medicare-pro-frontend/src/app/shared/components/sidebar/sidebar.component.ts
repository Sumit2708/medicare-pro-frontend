import { Component } from '@angular/core';
import { MatNavList } from '@angular/material/list';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-sidebar',
  imports: [MatNavList, RouterLink, MatIcon],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {}
