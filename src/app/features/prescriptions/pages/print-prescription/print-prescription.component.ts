import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { Prescription } from '../../model/prescription.model';
import { PrescriptionService } from '../../service/prescriptions.service';

@Component({
  selector: 'app-print-prescription',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './print-prescription.component.html',
  styleUrls: ['./print-prescription.component.scss'],
})
export class PrintPrescriptionComponent implements OnInit {
  prescription?: Prescription;

  clinicName = 'Your Clinic Name';
  clinicAddress = '123 Health Street, Pune, Maharashtra';
  clinicPhone = '+91 98765 43210';

  constructor(
    private route: ActivatedRoute,
    private prescriptionService: PrescriptionService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    console.log(id,'id');
    
    if (!id) return;

    this.prescriptionService
      .getById(id)
      .subscribe((p) => (this.prescription = p));
    console.log(this.prescription , 'prescription');
  }

  print(): void {
    window.print();
  }

  close(): void {
    window.close();
  }
}
