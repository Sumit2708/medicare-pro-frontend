import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientService } from '../../services/patient.service';
import { NotificationService } from '../../../../core/services/notification/notification.service';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { MatChipOption, MatChipsModule } from '@angular/material/chips';
import { Patient } from '../../../../shared/models/patient.model';
import { PrescriptionHistoryComponent } from "../../../prescriptions/components/prescription-history/prescription-history.component";
import { MatTab, MatTabGroup } from "@angular/material/tabs";

@Component({
  selector: 'app-edit-patient',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    PageHeaderComponent,
    MatChipsModule,
    PrescriptionHistoryComponent,
    MatTab,
    MatTabGroup
],
  templateUrl: './edit-patient.component.html',
  styleUrl: './edit-patient.component.scss',
})
export class EditPatientComponent {
  // patientForm: FormGroup;
  // patientId = '';
  isLoading = true;
  // isSubmitting = false;

  bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];


   patientForm: FormGroup;
  patientId:any='';
  isLoadingPatient = false;
  isSubmitting = false;
  selectedTabIndex = 0;
 
  private readonly tabIndexMap: Record<string, number> = {
    details: 0,
    prescriptions: 1,
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private patientService: PatientService,
    private notificationService: NotificationService,
  ) {
    this.patientForm = this.fb.group({
      name: ['', Validators.required],
      age: ['', Validators.required],
      gender: ['', Validators.required],
      mobile: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      alternateMobile: ['', [Validators.pattern(/^[6-9]\d{9}$/)]],
      bloodGroup: [''],
      address: [''],
      medicalHistory: [''],
      status: ['Active'],
    });
  }

  // ngOnInit() {
  //   this.route.queryParams.subscribe((params) => {
  //     this.patientId = params['id'];
  //     if (this.patientId) {
  //       this.getPatientById();
  //     }
  //   });
  // }

   ngOnInit(): void {
    this.route.queryParams.subscribe((params: any) => {
      this.patientId = params['id'];
 
      if (params['tab'] && this.tabIndexMap[params['tab']] !== undefined) {
        this.selectedTabIndex = this.tabIndexMap[params['tab']];
      }
 
      if (this.patientId) {
        this.getPatientById();
      } else {
        this.notificationService.error('No patient selected');
        this.router.navigate(['/patients']);
      }
    });
  }

  get initials(): string {
    const name = this.patientForm.value.name || '';
    const parts = name.trim().split(' ').filter(Boolean);
    if (!parts.length) return 'P';
    return parts
      .slice(0, 2)
      .map((p: string) => p[0].toUpperCase())
      .join('');
  }

  // getPatientById() {
  //   this.patientService.getPatientById(this.patientId as any).subscribe({
  //     next: (patient: any) => {
  //       this.patientForm.patchValue(patient);
  //       this.isLoading = false;
  //     },
  //     error: () => {
  //       this.isLoading = false;
  //       this.notificationService.error('Failed to load patient details.');
  //     },
  //   });
  // }

    getPatientById(): void {
    this.isLoadingPatient = true;
 
    this.patientService.getPatientById(this.patientId).subscribe({
      next: (patient: Patient) => {
        this.isLoadingPatient = false;
        this.patientForm.patchValue({
          name: patient.name,
          age: patient.age,
          gender: patient.gender,
          mobile: patient.mobile,
          alternateMobile: patient.alternateMobile,
          bloodGroup: patient.bloodGroup,
          address: patient.address,
          medicalHistory: patient.medicalHistory,
          status: patient.status,
        });
      },
      error: () => {
        this.notificationService.error('Patient not found');
        this.isLoadingPatient = false;
      },
    });
  }

  // onSubmit() {
  //   if (this.patientForm.valid) {
  //     this.isSubmitting = true;
  //     this.patientService
  //       .updatePatient(this.patientId as any, this.patientForm.value)
  //       .subscribe({
  //         next: (res: any) => {
  //           this.notificationService.success(
  //             `Patient ${res.name} updated successfully`,
  //           );
  //           this.router.navigate(['/patients']);
  //         },
  //         error: () => {
  //           this.isSubmitting = false;
  //           this.notificationService.error('Failed to update patient');
  //         },
  //       });
  //   } else {
  //     this.patientForm.markAllAsTouched();
  //     this.notificationService.error('Please fill all required fields');
  //   }
  // }

onSubmit(): void {
    if (this.patientForm.invalid) {
      this.patientForm.markAllAsTouched();
      this.notificationService.error('Please fill in all required fields.');
      return;
    }
 
    this.isSubmitting = true;
 
    this.patientService.updatePatient(this.patientId, this.patientForm.value).subscribe({
      next: () => {
        this.notificationService.success('Patient updated successfully');
        this.router.navigate(['/patients']);
      },
      error: () => {
        this.notificationService.error('Failed to update patient');
        this.isSubmitting = false;
      },
    });
  }

  navtoPatientList() {
    this.router.navigate(['/patients']);
  }

  get completionPercent(): number {
    const keys = ['name', 'age', 'gender', 'mobile'];
    const filled = keys.filter((k) => {
      const v = this.patientForm.get(k)?.value;
      return v !== null && v !== undefined && v !== '';
    }).length;
    return Math.round((filled / keys.length) * 100);
  }

   onCancel(): void {
    this.router.navigate(['/patients']);
  }
}
