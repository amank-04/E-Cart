import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoadingSpinnerComponent } from '../../components/loading-spinner/loading-spinner.component';

@Component({
    selector: 'app-admin-dashboard',
    imports: [RouterLink, RouterOutlet, LoadingSpinnerComponent],
    templateUrl: './admin-dashboard.component.html'
})
export default class AdminDashboardComponent {
  currentPage = '';
  loading = true;

  router = inject(Router);
  authService = inject(AuthService);

  constructor() {
    this.authService.setCurrentUser();
    setTimeout(() => {
      if (!this.authService.currentUser()?.isAdmin) {
        this.router.navigateByUrl('/NotFound');
      } else {
        this.currentPage = this.router.url.split('/').pop() || '';
        this.loading = false;
      }
    }, 1000);
  }
}
