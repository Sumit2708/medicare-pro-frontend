import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCard } from '@angular/material/card';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DoctorService } from '../../services/doctor.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { NotificationService } from '../../../../core/services/notification/notification.service';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-edit-doctor',
  imports: [
    CommonModule,
    MatCard,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    PageHeaderComponent,
    MatChipsModule
  ],
  templateUrl: './edit-doctor.component.html',
  styleUrl: './edit-doctor.component.scss',
})
export class EditDoctorComponent {
  doctorForm: FormGroup;
  doctorId = '';
  isLoading = true;
  isSubmitting = false;
  photoError = '';

  constructor(
    private fb: FormBuilder,
    private doctorService: DoctorService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
  ) {
    this.doctorForm = this.fb.group({
      name: ['', Validators.required],
      specialization: ['', Validators.required],
      experience: ['', Validators.required],
      qualification: ['', Validators.required],
      fee: ['', Validators.required],
      status: ['Active', Validators.required],
      photoUrl: [''],
    });
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.doctorId = params['id'];
      if (this.doctorId) {
        this.getDoctorById();
      }
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

  getDoctorById() {
    this.doctorService.getDoctorById(this.doctorId as any).subscribe({
      next: (doctor: any) => {
        this.doctorForm.patchValue({
          name: doctor.name,
          specialization: doctor.specialization,
          experience: doctor.experience,
          qualification: doctor.qualification,
          fee: doctor.fee,
          status: doctor.status,
          photoUrl: doctor.photoUrl ?? '',
        });
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.notificationService.error('Failed to load doctor details.');
      },
    });
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
      this.doctorService.updateDoctor(this.doctorId as any, this.doctorForm.value).subscribe({
        next: () => {
          this.notificationService.success('Doctor updated successfully');
          this.router.navigate(['/doctors']);
        },
        error: () => {
          this.isSubmitting = false;
          this.notificationService.error('Failed to update doctor. Please try again.');
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