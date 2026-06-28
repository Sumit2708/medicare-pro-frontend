import { Component } from '@angular/core';
import { MatCard } from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatPseudoCheckbox } from '@angular/material/core';
import { MatDivider } from '@angular/material/divider';
import {
  FormBuilder,
  FormControlName,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIcon } from "@angular/material/icon";
import { NotificationService } from '../../../../core/services/notification/notification.service';

@Component({
  selector: 'app-login',
  imports: [
    MatCard,
    MatFormField,
    MatLabel,
    MatCheckboxModule,
    MatDivider,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatIcon
],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm: FormGroup;
   hidePassword = true;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private notificationService:NotificationService
  ) {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      rememberMe: [''],
    });
  }

  ngOnInit(): void {
    console.log(`email === admin@medicare.com
      password === admin123`);
  }

  onSubmit() {
     if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.value;

    // Temporary static login
    if (
      email === 'admin@medicare.com' &&
      password === 'admin123'
    ) {

      if (this.loginForm.value.rememberMe) {
        localStorage.setItem('isLoggedIn', 'true');
      } else {
        sessionStorage.setItem('isLoggedIn', 'true');
      }

      this.notificationService.success('Login Successful');
      this.router.navigate(['/dashboard']);

    } else {

      this.notificationService.error('Invalid email or password');

    }
  }


}
