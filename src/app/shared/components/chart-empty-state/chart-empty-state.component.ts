import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-chart-empty-state',
  imports: [],
  templateUrl: './chart-empty-state.component.html',
  styleUrl: './chart-empty-state.component.scss',
})
export class ChartEmptyStateComponent {
 @Input() icon: 'bar-chart' | 'pie-chart' | 'calendar' = 'bar-chart';
  @Input() title = 'No data available';
  @Input() subtitle?: string;
}
