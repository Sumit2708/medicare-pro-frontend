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
import { User } from '../../../../shared/models/user.model';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { ProfileService } from '../../services/profile/profile.service';
import { MatIcon } from '@angular/material/icon';
import { NotificationService } from '../../../../core/services/notification/notification.service';
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
    MatIcon,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent {
  clinicForm: FormGroup;
  billingForm: FormGroup;
  profileForm!: FormGroup;
  passwordForm!: FormGroup;

  workingHoursForm: FormGroup;
  settings!: Settings;

  currentUser: User | null = null;

  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  constructor(
    private fb: FormBuilder,
    private settingsService: SettingsService,
    private authService: AuthService,
    private profileService: ProfileService,
    private notificationService: NotificationService,
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

    this.profileForm = this.fb.nonNullable.group({
      name: ['', [Validators.required, Validators.minLength(2)]],

      email: [
        {
          value: '',
          disabled: true,
        },
      ],

      role: [
        {
          value: '',
          disabled: true,
        },
      ],
    });

    this.passwordForm = this.fb.nonNullable.group({
      currentPassword: ['', Validators.required],

      newPassword: ['', [Validators.required, Validators.minLength(8)]],

      confirmPassword: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadSettings();
    this.loadProfile();
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

        this.notificationService.success('Clinic settings saved successfully');
        // console.log('Clinic settings saved successfully');
      },

      error: (error) => {
        this.notificationService.error('Unable to save clinic settings');
        // console.error('Unable to save clinic settings', error);
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

        this.notificationService.success('Billing settings saved successfully');
        console.log('Billing settings saved successfully');
      },

      error: (error) => {
        this.notificationService.error('Unable to save billing settings');
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
        this.notificationService.error('Unable to load settings');
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

          this.notificationService.success('Working hours saved successfully');
          console.log('Working hours saved successfully');
        },

        error: (error) => {
          this.notificationService.error('Unable to save working hours');
          console.error('Unable to save working hours', error);
        },
      });
  }

  private createWorkingDay(day: WorkingDay): WorkingDayForm {
    const group = this.fb.nonNullable.group({
      day: day.day,

      enabled: day.enabled,

      startTime: day.startTime,

      endTime: day.endTime,
    });

    group.controls['startTime'].valueChanges.subscribe(() => {
      this.validateWorkingDay(group);
    });

    group.controls['endTime'].valueChanges.subscribe(() => {
      this.validateWorkingDay(group);
    });

    group.controls['enabled'].valueChanges.subscribe(() => {
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
    return this.workingDays.at(index).hasError('invalidTimeRange');
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

  private validateWorkingDay(day: WorkingDayForm): void {
    // Clear previous error
    day.setErrors(null);

    // Closed day doesn't need time validation
    if (!day.controls['enabled'].value) {
      return;
    }

    const start = day.controls['startTime'].value;

    const end = day.controls['endTime'].value;

    // No time values
    if (!start || !end) {
      day.setErrors({
        invalidTimeRange: true,
      });

      return;
    }

    // Opening must be before closing
    if (start >= end) {
      day.setErrors({
        invalidTimeRange: true,
      });
    }
  }

  private loadProfile(): void {
    const user = this.authService.getCurrentUser();

    if (!user) {
      return;
    }

    this.currentUser = user;

    this.profileForm.patchValue({
      name: user.name,

      email: user.email,

      role: user.role,
    });
  }

  saveProfile(): void {
    if (this.profileForm.invalid || !this.currentUser) {
      this.profileForm.markAllAsTouched();

      return;
    }

    const { name } = this.profileForm.getRawValue();

    this.profileService.updateProfile(this.currentUser.id, { name }).subscribe({
      next: (updatedUser) => {
        this.currentUser = updatedUser;

        this.authService.updateCurrentUser(updatedUser);

        this.notificationService.success('Profile updated successfully');
        console.log('Profile updated successfully');
      },

      error: (error) => {
        this.notificationService.error('Unable to update profile');
        console.error('Unable to update profile', error);
      },
    });
  }

  private passwordsMatch(): boolean {
    const newPassword = this.passwordForm.controls['newPassword'].value;

    const confirmPassword = this.passwordForm.controls['confirmPassword'].value;

    return newPassword === confirmPassword;
  }

  hasPasswordMismatch(): boolean {
    const confirmControl = this.passwordForm.controls['confirmPassword'];

    if (!confirmControl.touched) {
      return false;
    }

    return !this.passwordsMatch();
  }

  changePassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();

      return;
    }

    if (!this.passwordsMatch()) {
      this.passwordForm.controls['confirmPassword'].setErrors({
        passwordMismatch: true,
      });

      return;
    }

    const user = this.authService.getCurrentUser();

    if (!user) {
      return;
    }

    const { currentPassword, newPassword } = this.passwordForm.getRawValue();

    if (currentPassword !== user.password) {
      this.passwordForm.controls['currentPassword'].setErrors({
        incorrectPassword: true,
      });

      return;
    }

    this.profileService
      .updateProfile(user.id, {
        password: newPassword,
      })
      .subscribe({
        next: (updatedUser) => {
          this.authService.updateCurrentUser(updatedUser);

          this.passwordForm.reset();

          this.notificationService.success('Password changed successfully');
          console.log('Password changed successfully');
        },

        error: (error) => {
          this.notificationService.error('Unable to change password');
          console.error('Unable to change password', error);
        },
      });
  }
}
