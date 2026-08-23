import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from "@angular/material/icon";
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { Location } from '@angular/common';


@Component({
  selector: 'app-access-denied',
  imports: [MatIcon,RouterLink,MatInputModule,MatButtonModule],
  templateUrl: './access-denied.component.html',
  styleUrl: './access-denied.component.scss'
})
export class AccessDeniedComponent {

  constructor(
    private location: Location
  ) {}

   goBack(): void {
    this.location.back();
  }
}
