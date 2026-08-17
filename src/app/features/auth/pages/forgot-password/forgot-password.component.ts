import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { UserService } from '../../../../core/services/user/user.service';
import { NotificationService } from '../../../../core/services/notification/notification.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
  form: FormGroup;
  isSubmitting = false;
  resetComplete = false;
  newPassword = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private notificationService: NotificationService,
    private router: Router,
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const email = this.form.value.email;

    this.userService.getUserByEmail(email).subscribe({
      next: (user) => {
        if (!user) {
          this.isSubmitting = false;
          this.notificationService.error('No account found with that email.');
          return;
        }

        const tempPassword = this.generatePassword(user.name);

        this.userService.updateUser(user.id, { password: tempPassword }).subscribe({
          next: () => {
            this.isSubmitting = false;
            this.resetComplete = true;
            this.newPassword = tempPassword;
          },
          error: () => {
            this.isSubmitting = false;
            this.notificationService.error('Something went wrong. Please try again.');
          },
        });
      },
      error: () => {
        this.isSubmitting = false;
        this.notificationService.error('Something went wrong. Please try again.');
      },
    });
  }

  copyPassword(): void {
    navigator.clipboard.writeText(this.newPassword).then(() => {
      this.notificationService.success('Password copied to clipboard');
    });
  }

  private generatePassword(name: string): string {
    const cleaned = (name || 'User').trim().split(' ')[0];
    const namePart = cleaned.charAt(0).toUpperCase() + cleaned.slice(1).toLowerCase();
    const digits = Math.floor(1000 + Math.random() * 9000);
    return `${namePart}@${digits}`;
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}