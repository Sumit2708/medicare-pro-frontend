import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-report-summary-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './report-summary-card.component.html',
  styleUrl: './report-summary-card.component.scss',
})
export class ReportSummaryCardComponent {
  // @Input({ required: true })
  // title!: string;

  // @Input({ required: true })
  // value!: string | number | null;

  // @Input()
  // icon = 'analytics';

  // @Input()
  // color = '#1976D2';

  @Input() icon!: string;
  @Input() title!: string;
  @Input() value!: string | number | null;
  @Input() iconBg!: string; // e.g. 'var(--color-primary-light)'
  @Input() iconColor!: string; // e.g. 'var(--color-primary)'
}
