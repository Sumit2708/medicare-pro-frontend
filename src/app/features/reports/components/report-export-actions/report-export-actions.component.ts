import { Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-report-export-actions',
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './report-export-actions.component.html',
  styleUrl: './report-export-actions.component.scss'
})
export class ReportExportActionsComponent {

  @Output()
  exportPdf = new EventEmitter<void>();

  @Output()
  exportExcel = new EventEmitter<void>();

  @Output()
  print = new EventEmitter<void>();

}