import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { CartItem, OrderItem } from '../../../typing';
import { AuthService } from './auth.service';
import { NotifyService } from './notify.service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StripeService {
  private checkoutApi = environment.apiUrl + '/checkout';
  loadingPayment = signal(false);

  http = inject(HttpClient);
  authService = inject(AuthService);
  notifyService = inject(NotifyService);
  router = inject(Router);

  stripePublicKey =
    'pk_test_51PFbkpB5fTwPYaP1wGUerXwBjCHUqO8tb7W0gLrmGjmc5VVrts7Ss78kDk2cEBBYGjNGmHGFy4eI2HfQeTnpy2n800BuoqAffV';

  createPayment(items: CartItem[]) {
    if (!this.authService.currentUser()) {
      this.notifyService.setNotification('Please Sign In to Checkout', 'error');
      return;
    }

    const orderdItems: OrderItem[] = items.map(
      ({ id, count, imageurl, price, name }) => ({
        count,
        id,
        name,
        imageurl,
        price,
      }),
    );

    return this.http.post(this.checkoutApi, {
      orderdItems,
      user_email: this.authService.currentUser()?.email,
    });
  }

  verifySessionId(sessionId: string) {
    return this.http.post(this.checkoutApi + '/verify', {
      sessionId,
    });
  }

  getOrders() {
    if (!this.authService.currentUser()) {
      this.router.navigateByUrl('/login');
      this.notifyService.setNotification(
        'Please Login to see your orders',
        'error',
      );
    }
    const token = localStorage.getItem('auth_token');

    return this.http.post(this.checkoutApi + 'orders', {
      token,
    });
  }
}
