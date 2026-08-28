import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ToastComponent, ToastData, ToastType } from '../../../shared/components/toast/toast/toast.component';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
   constructor(private snackBar: MatSnackBar) {}
 
  private show(type: ToastType, message: string, title?: string, durationMs = 4000): void {
    const config: MatSnackBarConfig<ToastData> = {
      data: { type, message, title },
      duration: durationMs,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['app-toast-panel']
    };
    this.snackBar.openFromComponent(ToastComponent, config);
  }
 
  success(message: string, title = 'Success'): void {
    this.show('success', message, title);
  }
 
  error(message: string, title = 'Something went wrong'): void {
    this.show('error', message, title, 6000);
  }
 
  info(message: string, title?: string): void {
    this.show('info', message, title);
  }
 
  warning(message: string, title = 'Heads up'): void {
    this.show('warning', message, title, 5000);
  }
}