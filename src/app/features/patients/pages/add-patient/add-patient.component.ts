import { Component } from '@angular/core';
import { MatFormField, MatLabel, MatHint, MatFormFieldControl } from "@angular/material/form-field";
import { MatCard } from "@angular/material/card";
import { MatListOption, MatSelectionList } from '@angular/material/list';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { NotificationService } from '../../../../core/services/notification.service';
import { PatientService } from '../../services/patient.service';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-add-patient',
  imports: [MatSelectModule, MatFormField, MatLabel, MatHint, MatCard, ReactiveFormsModule, MatInputModule, MatButtonModule],
  templateUrl: './add-patient.component.html',
  styleUrl: './add-patient.component.scss'
})
export class AddPatientComponent {

  patientForm: FormGroup;

  constructor(
    private router: Router, 
    private fb: FormBuilder,
    private patientService: PatientService,
    private notificationService: NotificationService 
  ) {
    this.patientForm = this.fb.group({
      name: ['', Validators.required],
      age: ['', Validators.required],
      gender: ['', Validators.required],
      mobile: ['', Validators.required],
      address: ['',],
      status: ['Active']
    });
   }


onSubmit(){
  if(this.patientForm.valid){
    this.patientService.addPatient(this.patientForm.value).subscribe({
      next: (res: any) => {
        this.notificationService.success(`Patient ${res.name} added successfully`);
        this.router.navigate(['/patients']);
      },
      error: (error) => {
        this.notificationService.error('Failed to add patient');
      },
    });
  }else{
    this.notificationService.error('Please fill all required fields');
  }
}

}
