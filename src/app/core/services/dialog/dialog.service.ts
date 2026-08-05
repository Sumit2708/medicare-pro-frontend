import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ConfirmationDialogData } from '../../../shared/models/confirmation-dialog.model';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(private dialog: MatDialog) {}

  confirm(data: ConfirmationDialogData): Observable<boolean> {
    return this.dialog
      .open(ConfirmationDialogComponent, {
        width: '420px',
        disableClose: true,
        data,
      })
      .afterClosed();
  }
}
