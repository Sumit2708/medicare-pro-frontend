import { Component } from '@angular/core';
import { MatCard } from '@angular/material/card';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { DoctorService } from '../../services/doctor.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-edit-doctor',
  imports: [MatCard, MatFormField, MatLabel, MatInput,ReactiveFormsModule, MatButtonModule],
  templateUrl: './edit-doctor.component.html',
  styleUrl: './edit-doctor.component.scss',
})
export class EditDoctorComponent {
  doctorForm: FormGroup;
  doctorId: any;
  constructor(
    private fb: FormBuilder,
    private doctorService: DoctorService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.doctorForm = this.fb.group({
      name: ['', Validators.required],
      specialization: ['', Validators.required],
      fee: ['', Validators.required],
      status: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.doctorId = params['id'];
    });
     if (this.doctorId) {
      this.getDoctorById();
    }
  }

  getDoctorById() {
    this.doctorService.getDoctors().subscribe((data: any) => {
      const doctor = data.find((d: any) => d.id == this.doctorId);

      if (doctor) {
        console.log(doctor,'doctor');
        
       this.doctorForm.patchValue({
        name: doctor.name,
        specialization: doctor.specialization,
        fee: doctor.fee,
        status: doctor.status ? 'Active' : 'Inactive',
      });
     console.log(this.doctorForm.value);
      }
    });
  }

  onSubmit() {
    if(this.doctorForm.valid){
      this.doctorService.updateDoctor(this.doctorId,this.doctorForm.value).subscribe(()=>{
        this.router.navigate(['/doctors'])
      })
    }
  }
}
