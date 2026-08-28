import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export type EmptyStateVariant = 'empty' | 'error' | 'no-results';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './empty-state.component.html',
  styleUrls: ['./empty-state.component.scss']
})
export class EmptyStateComponent {
  /** 'empty' = no data yet, 'no-results' = filters/search returned nothing, 'error' = request failed */
  @Input() variant: EmptyStateVariant = 'empty';

  @Input() title = 'No data found';
  @Input() message = 'There\u2019s nothing to show here yet.';

  /** Optional call-to-action button text. Omit to hide the button entirely. */
  @Input() actionLabel?: string;

  @Input() showAction = true;

  @Output() actionClick = new EventEmitter<void>();

  get iconPath(): string {
    switch (this.variant) {
      case 'error':
        // triangle-alert (Lucide)
        return 'M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0ZM12 9v4M12 17h.01';
      case 'no-results':
        // search-x (Lucide)
        return 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM21 21l-4.35-4.35M9 9l4 4M13 9l-4 4';
      default:
        // inbox (Lucide)
        return 'M22 12h-6l-2 3h-4l-2-3H2M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11Z';
    }
  }
}