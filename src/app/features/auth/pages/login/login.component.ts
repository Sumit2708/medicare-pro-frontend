import { Component } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDivider } from '@angular/material/divider';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { NotificationService } from '../../../../core/services/notification/notification.service';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { UserRole } from '../../../../core/enums/user-role.enum';

@Component({
  selector: 'app-login',
  imports: [
    MatCard,
    MatFormFieldModule,
    MatCheckboxModule,
    MatDivider,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = true;
  isSubmitting = false;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private authService: AuthService,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false],
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    this.authService.login(this.loginForm.value).subscribe({
      next: (isLoggedin) => {
        this.isSubmitting = false;
        if (isLoggedin) {
          const user = this.authService.getCurrentUser();
          if (user?.role === UserRole.DOCTOR) {
            this.router.navigate(['/doctor-dashboard']);
          } else {
            this.router.navigate(['/dashboard']);
          }
        } else {
          this.notificationService.error('Invalid email or password');
        }
      },
      error: () => {
        this.isSubmitting = false;
        this.notificationService.error(
          'Something went wrong. Please try again.',
        );
      },
    });
  }
}
