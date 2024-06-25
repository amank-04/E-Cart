import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { StripeService } from '../../services/stripe.service';
import { NotifyService } from '../../services/notify.service';

@Component({
  selector: 'app-success',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './success.component.html',
})
export default class SuccessComponent {
  activatedRoute = inject(ActivatedRoute);
  stripeService = inject(StripeService);
  router = inject(Router);
  notifyService = inject(NotifyService);
  confirmed = false;

  constructor() {
    this.activatedRoute.queryParams.subscribe((params) => {
      const sessionId = params['session_id'];
      if (!sessionId) this.router.navigateByUrl('/');
      this.stripeService.verifySessionId(sessionId).subscribe({
        next: () => {
          this.confirmed = true;
        },
        error: () => {
          this.router.navigateByUrl('/');
          this.notifyService.setNotification('Invalid Session Id', 'error');
        },
      });
    });
  }
}
