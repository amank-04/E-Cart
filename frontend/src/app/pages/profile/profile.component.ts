import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
    selector: 'app-profile',
    imports: [FooterComponent],
    templateUrl: './profile.component.html'
})
export default class ProfileComponent {
  authService = inject(AuthService);
  router = inject(Router);

  constructor() {
    if (!this.authService.currentUser()) {
      this.router.navigateByUrl('/login');
    }
  }

  deleteAccount() {
    this.authService
      .deleteAccount()
      .subscribe(() => this.router.navigateByUrl('/login'));
  }
}
