import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validator,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DoctorService } from '../../services/doctor.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-doctor',
  imports: [
    MatCard,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './add-doctor.component.html',
  styleUrl: './add-doctor.component.scss',
})
export class AddDoctorComponent {
  doctorForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private doctorService: DoctorService,
    private router: Router,
  ) {
    this.doctorForm = this.fb.group({
      name: ['', Validators.required],
      specialization: ['', Validators.required],
      fee: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.doctorForm.valid) {
      this.doctorService.addDoctor(this.doctorForm.value).subscribe(() => {
        this.router.navigate(['/doctors']);
      });
    }
  }
}
