import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './forget-password.component.html',
})
export default class ForgetPasswordComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
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
    this.authService
      .sendEmail(this.forgetForm.value.email as string)
      .subscribe({
        next: (res) => {
          this.forgetForm.reset();
          this.router.navigateByUrl('/');
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
}
