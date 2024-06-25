import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotifyService } from '../../services/notify.service';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './forget-password.component.html',
})
export default class ForgetPasswordComponent {
  isLoading = false;
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  notify = inject(NotifyService);
  router = inject(Router);

  constructor() {
    if (this.authService.currentUser()) {
      this.router.navigateByUrl('/');
    }
  }

  forgetForm = this.fb.nonNullable.group({
    email: ['', Validators.email],
  });

  submit() {
    this.isLoading = true;
    this.authService
      .sendEmail(this.forgetForm.value.email as string)
      .subscribe({
        next: (res) => {
          this.notify.setNotification('Email Sent', 'success');
          this.forgetForm.reset();
          this.router.navigateByUrl('/');
        },
        error: (err) => {
          this.isLoading = false;
          console.log(err);
        },
      });
  }
}
