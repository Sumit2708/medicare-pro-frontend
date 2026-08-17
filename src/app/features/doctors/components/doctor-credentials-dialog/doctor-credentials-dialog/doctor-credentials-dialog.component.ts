import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NotificationService } from '../../../../../core/services/notification/notification.service';

export interface DoctorCredentialsData {
  doctorName: string;
  email: string;
  password: string;
}

@Component({
  selector: 'app-doctor-credentials-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './doctor-credentials-dialog.component.html',
  styleUrl: './doctor-credentials-dialog.component.scss',
})
export class DoctorCredentialsDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DoctorCredentialsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DoctorCredentialsData,
    private notificationService: NotificationService,
  ) {}

  copy(text: string, label: string): void {
    navigator.clipboard.writeText(text).then(() => {
      this.notificationService.success(`${label} copied to clipboard`);
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}