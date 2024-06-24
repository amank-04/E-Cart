import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotifyService } from '../../services/notify.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
})
export default class LoginComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);
  notifyService = inject(NotifyService);

  constructor() {
    if (localStorage.getItem('auth_token')) {
      this.router.navigateByUrl('/');
    }
  }

  loginForm = this.fb.nonNullable.group({
    email: ['', Validators.email],
    password: [''],
  });

  login() {
    this.authService.login(this.loginForm.value).subscribe({
      next: (res: any) => {
        const token: string = res.data.token ?? '';
        localStorage.setItem('auth_token', token);
        this.notifyService.setNotification('Login Success', 'success');
        this.loginForm.reset();
        this.router.navigateByUrl('/');
        this.authService.setCurrentUser();
      },
      error: (err) => {
        this.authService.currentUser.set(null);
        this.notifyService.setNotification('Wrong Credentials!', 'error');
      },
    });
  }
}
