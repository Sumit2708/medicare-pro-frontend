import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { Prescription } from '../../model/prescription.model';
import { PrescriptionService } from '../../service/prescriptions.service';

@Component({
  selector: 'app-prescription-history',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './prescription-history.component.html',
  styleUrls: ['./prescription-history.component.scss'],
})
export class PrescriptionHistoryComponent implements OnInit {
  /** Passed in from EditPatientComponent's / EditAppointmentComponent's Prescriptions tab */
  @Input({ required: true }) patientId!: string;
  @Input({ required: true }) patientName!: string;

  /** When true, hides "New Prescription" and "Edit" actions — view/print only. */
  @Input() readOnly = false;

  prescriptions: Prescription[] = [];
  columns = ['date', 'doctor', 'diagnosis', 'medicines', 'status', 'actions'];

  constructor(
    private prescriptionService: PrescriptionService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.load();
  }

  private load(): void {
    this.prescriptionService.getByPatient(this.patientId).subscribe((data) => {
      this.prescriptions = data;
    });
  }

  initials(name: string): string {
    return name
      .split(' ')
      .map((p) => p[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }

  onNewPrescription(): void {
    this.router.navigate(['/prescriptions/add'], {
      queryParams: { patientId: this.patientId },
    });
  }

  onEdit(p: Prescription): void {
    this.router.navigate(['/prescriptions/edit'], {
      queryParams: { id: p.id, patientId: this.patientId },
    });
  }

  onPrint(p: Prescription): void {
    // real route param — this opens in a new tab via window.open, so query
    // params/state from this component can't travel with it anyway
    window.open(`/prescriptions/print/${p.id}`, '_blank');
  }
}