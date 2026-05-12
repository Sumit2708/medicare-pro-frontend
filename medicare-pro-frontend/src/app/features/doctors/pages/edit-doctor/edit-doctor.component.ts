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

@Component({
  selector: 'app-edit-doctor',
  imports: [MatCard, MatFormField, MatLabel, MatInput],
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
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.doctorId = params['id'];
    });
    this.getDoctorById();
  }

  getDoctorById() {
    this.doctorService.getDoctors().subscribe((data: any) => {
      const doctor = data.find((d: any) => d.id == this.doctorId);

      if (doctor) {
        this.doctorForm.patchValue(doctor);
      }
    });
  }

  onSubmit() {}
}
