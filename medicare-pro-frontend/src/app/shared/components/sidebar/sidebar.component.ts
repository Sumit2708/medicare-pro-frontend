import { Component } from '@angular/core';
import { MatNavList } from "@angular/material/list";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-sidebar',
  imports: [MatNavList, RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

}
