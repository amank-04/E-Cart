import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { confirmPasswordValidator } from '../../validators/confirm-password.validator';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotifyService } from '../../services/notify.service';

@Component({
    selector: 'app-reset',
    imports: [ReactiveFormsModule],
    templateUrl: './reset.component.html'
})
export default class ResetComponent implements OnInit {
  isLoading = false;
  fb = inject(FormBuilder);
  activatedRoute = inject(ActivatedRoute);
  token!: string;
  authService = inject(AuthService);
  router = inject(Router);
  notify = inject(NotifyService);

  constructor() {
    if (this.authService.currentUser()) {
      this.router.navigateByUrl('/');
    }
  }

  resetForm = this.fb.group(
    {
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    },
    { validator: confirmPasswordValidator('password', 'confirmPassword') },
  );

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((val) => {
      this.token = val['token'];
    });
  }
  reset() {
    this.isLoading = true;

    const resetObj = {
      token: this.token,
      password: this.resetForm.value.password,
    };
    this.authService.resetPassword(resetObj).subscribe({
      next: (res) => {
        this.resetForm.reset();
        this.notify.setNotification('Email Sent', 'success');
        this.router.navigateByUrl('/login');
      },
      error: (err) => {
        this.notify.setNotification('Something went wrong', 'error');
        this.isLoading = false;
        console.log(err);
      },
    });
  }
}
