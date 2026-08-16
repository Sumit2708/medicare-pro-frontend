// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import {
//   FormBuilder,
//   FormGroup,
//   ReactiveFormsModule,
//   Validators,
// } from '@angular/forms';
// import { MatButtonModule } from '@angular/material/button';
// import { MatCard } from '@angular/material/card';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatIconModule } from '@angular/material/icon';
// import { DoctorService } from '../../services/doctor.service';
// import { Router } from '@angular/router';
// import { Doctor } from '../../../../shared/models/doctor.model';
// import { NotificationService } from '../../../../core/services/notification/notification.service';
// import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';

// @Component({
//   selector: 'app-add-doctor',
//   imports: [
//     CommonModule,
//     MatCard,
//     ReactiveFormsModule,
//     MatFormFieldModule,
//     MatInputModule,
//     MatButtonModule,
//     MatIconModule,
//     PageHeaderComponent,
//   ],
//   templateUrl: './add-doctor.component.html',
//   styleUrl: './add-doctor.component.scss',
// })
// export class AddDoctorComponent {
//   doctorForm: FormGroup;
//   isSubmitting = false;

//   constructor(
//     private fb: FormBuilder,
//     private doctorService: DoctorService,
//     private router: Router,
//     private notificationService: NotificationService,
//   ) {
//     this.doctorForm = this.fb.group({
//       name: ['', Validators.required],
//       specialization: ['', Validators.required],
//       experience: ['', Validators.required],
//       qualification: ['', Validators.required],
//       fee: ['', Validators.required],
//     });
//   }

//   get initials(): string {
//     const name = this.doctorForm.value.name || '';
//     const parts = name.trim().split(' ').filter(Boolean);
//     if (!parts.length) return 'DR';
//     return parts.slice(0, 2).map((p: string) => p[0].toUpperCase()).join('');
//   }

//   get completionPercent(): number {
//     const controls = this.doctorForm.controls;
//     const keys = Object.keys(controls);
//     const filled = keys.filter((k) => {
//       const v = controls[k].value;
//       return v !== null && v !== undefined && v !== '';
//     }).length;
//     return Math.round((filled / keys.length) * 100);
//   }

//   get qualificationList(): string[] {
//     const raw = this.doctorForm.value.qualification || '';
//     return raw.split(',').map((q: string) => q.trim()).filter(Boolean);
//   }

//   onSubmit() {
//     if (this.doctorForm.valid) {
//       this.isSubmitting = true;
//       const doctor: Doctor = {
//         ...this.doctorForm.value,
//         status: 'Active',
//       };

//       this.doctorService.addDoctor(doctor).subscribe({
//         next: (res: any) => {
//           this.notificationService.success(`Doctor ${res.name} added successfully`);
//           this.router.navigate(['/doctors']);
//         },
//         error: () => {
//           this.isSubmitting = false;
//           this.notificationService.error('Failed to add doctor. Please try again.');
//         },
//       });
//     } else {
//       this.doctorForm.markAllAsTouched();
//       this.notificationService.error('Please fill in all required fields.');
//     }
//   }

//   onCancel() {
//     this.router.navigate(['/doctors']);
//   }
// }



import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { DoctorService } from '../../services/doctor.service';
import { Router } from '@angular/router';
import { Doctor } from '../../../../shared/models/doctor.model';
import { NotificationService } from '../../../../core/services/notification/notification.service';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-add-doctor',
  imports: [
    CommonModule,
    MatCard,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    PageHeaderComponent,
  ],
  templateUrl: './add-doctor.component.html',
  styleUrl: './add-doctor.component.scss',
})
export class AddDoctorComponent {
  doctorForm: FormGroup;
  isSubmitting = false;
  photoError = '';

  constructor(
    private fb: FormBuilder,
    private doctorService: DoctorService,
    private router: Router,
    private notificationService: NotificationService,
  ) {
    this.doctorForm = this.fb.group({
      name: ['', Validators.required],
      specialization: ['', Validators.required],
      experience: ['', Validators.required],
      qualification: ['', Validators.required],
      fee: ['', Validators.required],
      photoUrl: [''],
    });
  }

  get initials(): string {
    const name = this.doctorForm.value.name || '';
    const parts = name.trim().split(' ').filter(Boolean);
    if (!parts.length) return 'DR';
    return parts.slice(0, 2).map((p: string) => p[0].toUpperCase()).join('');
  }

  get completionPercent(): number {
    const controls = this.doctorForm.controls;
    const keys = Object.keys(controls).filter((k) => k !== 'photoUrl');
    const filled = keys.filter((k) => {
      const v = controls[k].value;
      return v !== null && v !== undefined && v !== '';
    }).length;
    return Math.round((filled / keys.length) * 100);
  }

  get qualificationList(): string[] {
    const raw = this.doctorForm.value.qualification || '';
    return raw.split(',').map((q: string) => q.trim()).filter(Boolean);
  }

  onPhotoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.photoError = '';

    if (!file.type.startsWith('image/')) {
      this.photoError = 'Please select an image file.';
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      this.photoError = 'Image must be under 2MB.';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.doctorForm.patchValue({ photoUrl: reader.result as string });
    };
    reader.readAsDataURL(file);

    input.value = '';
  }

  removePhoto(): void {
    this.doctorForm.patchValue({ photoUrl: '' });
    this.photoError = '';
  }

  onSubmit() {
    if (this.doctorForm.valid) {
      this.isSubmitting = true;
      const doctor: Doctor = {
        ...this.doctorForm.value,
        status: 'Active',
      };

      this.doctorService.addDoctor(doctor).subscribe({
        next: (res: any) => {
          this.notificationService.success(`Doctor ${res.name} added successfully`);
          this.router.navigate(['/doctors']);
        },
        error: () => {
          this.isSubmitting = false;
          this.notificationService.error('Failed to add doctor. Please try again.');
        },
      });
    } else {
      this.doctorForm.markAllAsTouched();
      this.notificationService.error('Please fill in all required fields.');
    }
  }

  onCancel() {
    this.router.navigate(['/doctors']);
  }
}