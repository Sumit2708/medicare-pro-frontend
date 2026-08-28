import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastData {
  type: ToastType;
  message: string;
  title?: string;
}

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: ToastData,
    private snackBarRef: MatSnackBarRef<ToastComponent>
  ) {}

  close(): void {
    this.snackBarRef.dismiss();
  }

  get iconPath(): string {
    switch (this.data.type) {
      case 'success':
        // check-circle (Lucide)
        return 'M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4 12 14.01l-3-3';
      case 'error':
        // x-circle (Lucide)
        return 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM15 9l-6 6M9 9l6 6';
      case 'warning':
        // alert-triangle (Lucide)
        return 'M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0ZM12 9v4M12 17h.01';
      default:
        // info (Lucide)
        return 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM12 16v-4M12 8h.01';
    }
  }
}