import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormArray,
  FormControl,
  AbstractControl,
} from '@angular/forms';

import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { MatOption } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { Settings } from '../../model/settings.model';
import { SettingsService } from '../../services/settings.service';
import { WorkingDay } from '../../model/working-hours.model';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
type WorkingDayForm = FormGroup<{
  day: FormControl<string>;
  enabled: FormControl<boolean>;
  startTime: FormControl<string>;
  endTime: FormControl<string>;
}>;
@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    PageHeaderComponent,
    MatOption,
    MatSelectModule,
    MatSlideToggleModule,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent {
  clinicForm: FormGroup;
  billingForm: FormGroup;
  workingHoursForm: FormGroup;
  settings!: Settings;

  constructor(
    private fb: FormBuilder,
    private settingsService: SettingsService,
  ) {
    this.clinicForm = this.fb.nonNullable.group({
      clinicName: ['Medicare Pro', Validators.required],
      address: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      gstNumber: [''],
    });
    this.billingForm = this.fb.nonNullable.group({
      consultationFee: [500, [Validators.required, Validators.min(0)]],

      gstPercentage: [
        18,
        [Validators.required, Validators.min(0), Validators.max(100)],
      ],

      currency: ['INR', Validators.required],

      invoicePrefix: ['INV', [Validators.required, Validators.maxLength(10)]],
    });
    this.workingHoursForm = this.fb.nonNullable.group({
      days: new FormArray<WorkingDayForm>([]),
    });
  }

  ngOnInit(): void {
    this.loadSettings();
  }

  saveClinicInformation(): void {
    if (this.clinicForm.invalid || !this.settings) {
      this.clinicForm.markAllAsTouched();

      return;
    }

    const clinic = this.clinicForm.getRawValue();

    this.settingsService.updateClinic(clinic, this.settings).subscribe({
      next: (updatedSettings) => {
        this.settings = updatedSettings;

        console.log('Clinic settings saved successfully');
      },

      error: (error) => {
        console.error('Unable to save clinic settings', error);
      },
    });
  }

  saveBillingSettings(): void {
    if (this.billingForm.invalid || !this.settings) {
      this.billingForm.markAllAsTouched();

      return;
    }

    const billing = this.billingForm.getRawValue();

    this.settingsService.updateBilling(billing, this.settings).subscribe({
      next: (updatedSettings) => {
        this.settings = updatedSettings;

        console.log('Billing settings saved successfully');
      },

      error: (error) => {
        console.error('Unable to save billing settings', error);
      },
    });
  }

  private loadSettings(): void {
    this.settingsService.getSettings().subscribe({
      next: (settings) => {
        this.settings = settings;

        this.clinicForm.patchValue(settings.clinic);

        this.billingForm.patchValue(settings.billing);

        this.workingHoursForm.setControl(
          'days',
          new FormArray<WorkingDayForm>(
            settings.workingHours.days.map((day) => this.createWorkingDay(day)),
          ),
        );
      },

      error: (error) => {
        console.error('Unable to load settings', error);
      },
    });
  }

  saveWorkingHours(): void {
    if (!this.settings) {
      return;
    }

    const valid = this.validateWorkingHours();

    if (!valid) {
      this.workingHoursForm.markAllAsTouched();

      return;
    }

    const workingHours = this.workingHoursForm.getRawValue();

    this.settingsService
      .updateWorkingHours(workingHours, this.settings)
      .subscribe({
        next: (updatedSettings) => {
          this.settings = updatedSettings;

          console.log('Working hours saved successfully');
        },

        error: (error) => {
          console.error('Unable to save working hours', error);
        },
      });
  }

  private createWorkingDay(
  day: WorkingDay
): WorkingDayForm {

  const group = this.fb.nonNullable.group({

    day: day.day,

    enabled: day.enabled,

    startTime: day.startTime,

    endTime: day.endTime

  });

  group.controls['startTime']
    .valueChanges
    .subscribe(() => {

      this.validateWorkingDay(group);

    });

  group.controls['endTime']
    .valueChanges
    .subscribe(() => {

      this.validateWorkingDay(group);

    });

  group.controls['enabled']
    .valueChanges
    .subscribe(() => {

      this.validateWorkingDay(group);

    });

  // Validate initial value
  this.validateWorkingDay(group);

  return group;

}

  get workingDays(): FormArray<WorkingDayForm> {
    return this.workingHoursForm.get('days') as FormArray<WorkingDayForm>;
  }

  // getWorkingDay(index: number): WorkingDayForm {
  //   return this.workingDays.at(index);
  // }

  // private createWorkingDay(day: WorkingDay) {
  //   return this.fb.nonNullable.group({
  //     day: [day.day],

  //     enabled: [day.enabled],

  //     startTime: [day.startTime],

  //     endTime: [day.endTime],
  //   });
  // }

hasWorkingTimeError(index: number): boolean {

  return this.workingDays
    .at(index)
    .hasError('invalidTimeRange');

}

  private validateWorkingHours(): boolean {
    let isValid = true;

    for (const day of this.workingDays.controls) {
      const group = day;

      // Clear previous time-range error
      group.setErrors(null);

      // Closed day doesn't need validation
      if (!group.controls['enabled'].value) {
        continue;
      }

      const start = group.controls['startTime'].value;

      const end = group.controls['endTime'].value;

      // Both times are required for an open day
      if (!start || !end) {
        group.setErrors({
          invalidTimeRange: true,
        });

        isValid = false;

        continue;
      }

      // Opening time must be before closing time
      if (start >= end) {
        group.setErrors({
          invalidTimeRange: true,
        });

        isValid = false;
      }
    }

    return isValid;
  }

 private validateWorkingDay(
  day: WorkingDayForm
): void {

  // Clear previous error
  day.setErrors(null);

  // Closed day doesn't need time validation
  if (!day.controls['enabled'].value) {
    return;
  }

  const start =
    day.controls['startTime'].value;

  const end =
    day.controls['endTime'].value;

  // No time values
  if (!start || !end) {
    day.setErrors({
      invalidTimeRange: true
    });

    return;
  }

  // Opening must be before closing
  if (start >= end) {
    day.setErrors({
      invalidTimeRange: true
    });
  }

}



}
