import { Component } from '@angular/core';
import { MatFormField, MatLabel, MatHint } from '@angular/material/form-field';
import { MatSelect, MatOption } from '@angular/material/select';
import { MatCard } from '@angular/material/card';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NotificationService } from '../../../../core/services/notification.service';
import { PatientService } from '../../services/patient.service';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-edit-patient',
  imports: [MatFormField, MatLabel, MatHint, MatSelect, MatOption, MatCard, ReactiveFormsModule, MatButtonModule, MatInputModule ],
  templateUrl: './edit-patient.component.html',
  styleUrl: './edit-patient.component.scss',
})
export class EditPatientComponent {
  patientForm: FormGroup;
 patientId: any;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private patientService: PatientService,
    private notificationService: NotificationService,
  ) {
    this.patientForm = this.fb.group({
      name: ['', Validators.required],
      age: ['', Validators.required],
      gender: ['', Validators.required],
      mobile: ['', Validators.required],
      address: [''],
      status: ['Active'],
    });
  }

  ngOnInit() {
    this.router.routerState.root.queryParams.subscribe((params) => {
      this.patientId = params['id'];
    });
    if (this.patientId) {
      this.getPatientById();
    }
  }

  getPatientById() {
    this.patientService.getPatients().subscribe((data: any) => {
      const patient = data.find((p: any) => p.id == this.patientId);
      if (patient) {
        this.patientForm.patchValue(patient);
      }
    });
  }

  onSubmit() {
    // Handle form submission
    if (this.patientForm.valid) {
      this.patientService.updatePatient(this.patientId, this.patientForm.value).subscribe({
        next: (res: any) => {
          this.notificationService.success(`Patient ${res.name} updated successfully`);
          this.router.navigate(['/patients']);
        },
        error: (error) => {
          this.notificationService.error('Failed to update patient');
        },
      });
    }
  }
}
