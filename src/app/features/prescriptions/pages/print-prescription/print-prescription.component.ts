import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Prescription } from '../../model/prescription.model';
import { PrescriptionService } from '../../service/prescriptions.service';
import { PatientService } from '../../../patients/services/patient.service';
import { CLINIC_INFO } from '../../../../core/constants/clinic-info';

@Component({
  selector: 'app-print-prescription',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './print-prescription.component.html',
  styleUrl: './print-prescription.component.scss',
})
export class PrintPrescriptionComponent {
  prescription!: Prescription;
  patient: any = null;
  clinicInfo = CLINIC_INFO;
  loading = true;
  loadFailed = false;

  constructor(
    private prescriptionService: PrescriptionService,
    private patientService: PatientService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.loading = false;
      this.loadFailed = true;
      return;
    }

    window.onafterprint = () => {
      this.router.navigate(['/patients/edit'], {
        queryParams: { id: this.prescription?.patientId, tab: 'prescriptions' },
      });
      window.close();
    };

    this.loadPrescription(id);
  }

  ngViewAfterInit(): void {
    window.onafterprint = () => {
      this.router.navigate(['/patients/edit'], {
        queryParams: { id: this.prescription?.patientId, tab: 'prescriptions' },
      });
    };
  }

  private loadPrescription(id: string): void {
    this.prescriptionService.getById(id).subscribe({
      next: (p) => {
        this.prescription = p;
        console.log(p,'prescription');
        this.loadPatient(p.patientId);
      },
      error: () => {
        this.loading = false;
        this.loadFailed = true;
      },
    });
  }

  private loadPatient(patientId: string): void {
    this.patientService.getPatientById(patientId).subscribe({
      next: (patient: any) => {
        this.patient = patient;
        this.finishLoading();
      },
      error: () => {
        // Missing patient details shouldn't block printing the
        // prescription itself — just fall back to '—' in the template.
        this.finishLoading();
      },
    });
  }

  private finishLoading(): void {
    this.loading = false;
    setTimeout(() => window.print(), 10);
  }
}