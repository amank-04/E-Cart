import { Component, Input, inject } from '@angular/core';
import { StripeService } from '../../services/stripe.service';

@Component({
    selector: 'app-loading-spinner',
    imports: [],
    templateUrl: './loading-spinner.component.html',
    styleUrl: './loading-spinner.component.css'
})
export class LoadingSpinnerComponent {
  stripeService = inject(StripeService);
}
