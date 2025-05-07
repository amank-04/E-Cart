import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CartStore } from './store/cart.store';
import { ProductsService } from './services/products.service';
import { AuthService } from './services/auth.service';
import { ModalComponent } from './components/modal/modal.component';
import { NotificationComponent } from './components/notification/notification.component';
import { CartItem } from '../../typing';
import { StripeService } from './services/stripe.service';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    NavbarComponent,
    ModalComponent,
    NotificationComponent,
    LoadingSpinnerComponent,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent {
  cartStore = inject(CartStore);
  authService = inject(AuthService);
  router = inject(Router);
  productService = inject(ProductsService);
  stripeService = inject(StripeService);

  constructor() {
    this.authService.setCurrentUser();
    if (localStorage.getItem('auth_token')) {
      localStorage.removeItem('cart_items');
      this.productService.getCartItems().subscribe({
        next: (res: any) => {
          const items: CartItem[] = res.data;
          this.cartStore.initialCart(items);
        },
        error: () => {
          localStorage.removeItem('auth_token');
          this.authService.currentUser.set(null);
        },
      });
    } else {
      localStorage.removeItem('auth_token');
      const items: CartItem[] = JSON.parse(
        localStorage.getItem('cart_items') ?? '[]',
      );
      items.forEach((item) => {
        this.cartStore.addItem(item);
      });
    }
  }
}
