import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chart-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './chart-card.component.html',
  styleUrls: ['./chart-card.component.scss']
})
export class ChartCardComponent {
@Input() title!: string;
@Input() subtitle?: string;
@Input() icon?: string;
@Input() actionLabel?: string;
@Input() actionRoute?: string;

constructor(private router: Router) {}

onAction(): void {
  if (this.actionRoute) {
    this.router.navigateByUrl(this.actionRoute);
  }
}
}