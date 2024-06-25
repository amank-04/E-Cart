import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { confirmPasswordValidator } from '../../validators/confirm-password.validator';
import { NotifyService } from '../../services/notify.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
})
export default class RegisterComponent {
  isLoading = false;

  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);
  notifyService = inject(NotifyService);

  constructor() {
    if (localStorage.getItem('auth_token')) {
      this.router.navigateByUrl('/');
    }
  }

  registerForm = this.fb.group(
    {
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    },
    {
      validator: confirmPasswordValidator('password', 'confirmPassword'),
    },
  );

  handleRegistration() {
    this.isLoading = true;
    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.notifyService.setNotification(
          'User Registered Successfully',
          'success',
        );
        this.registerForm.reset();
        this.router.navigateByUrl('/login');
      },
      error: (err) => {
        this.notifyService.setNotification('Email Already Registered', 'error');
        this.isLoading = false;
      },
    });
  }
}
