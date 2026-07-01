import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-page-not-found',
  imports: [MatIcon, RouterLink, MatButtonModule],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.scss',
})
export class PageNotFoundComponent {
  isLoggedIn:boolean = false;

  constructor() {}

  ngOnInit() {
    // this.isLoggedIn = !!localStorage.getItem('token');
    
    this.isLoggedIn = !!localStorage.getItem('token');
    console.log(this.isLoggedIn);
    
  }
}
