import { Component, Input, inject } from '@angular/core';
import { CartStore } from '../../store/cart.store';
import { CartItem, Product } from '../../../../typing';
import { RouterLink } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { StripeService } from '../../services/stripe.service';
import { loadStripe } from '@stripe/stripe-js';
import { AuthService } from '../../services/auth.service';
import { IndNumPipe } from '../../pipes/ind-num.pipe';
import { NotifyService } from '../../services/notify.service';

@Component({
    selector: 'app-product',
    imports: [RouterLink, IndNumPipe],
    templateUrl: './product.component.html'
})
export class ProductComponent {
  @Input({ required: true }) item!: Product;

  cartStore = inject(CartStore);
  productService = inject(ProductsService);
  authService = inject(AuthService);
  stripeService = inject(StripeService);
  notifyService = inject(NotifyService);

  addToCart() {
    const newCartItem: CartItem = {
      count: 1,
      description: this.item.description,
      id: this.item.id,
      imageurl: this.item.imageurl,
      price: this.item.price,
      name: this.item.name,
      selected: true,
    };

    if (!this.authService.currentUser()) {
      this.cartStore.addItem(newCartItem);
      return;
    }

    const findItem = this.cartStore
      .items()
      .find((item) => item.id === this.item.id);

    if (findItem) {
      this.productService.updateCartItem({
        count: findItem.count + 1,
        p_id: findItem.id,
        selected: true,
      });
    } else {
      this.productService.createCartItem({
        count: 1,
        p_id: this.item.id,
        selected: true,
      });
    }

    this.cartStore.addItem(newCartItem);
  }

  buyNow() {
    if (!this.authService.currentUser()) {
      this.notifyService.setNotification('Please login to Checkout', 'error');
      return;
    }

    this.stripeService.loadingPayment.set(true);

    this.stripeService
      .createPayment([
        {
          count: 1,
          description: this.item.description,
          id: this.item.id,
          imageurl: this.item.imageurl,
          name: this.item.name,
          price: this.item.price,
          selected: true,
        },
      ])
      ?.subscribe(async (res: any) => {
        const stripe = await loadStripe(this.stripeService.stripePublicKey);
        stripe
          ?.redirectToCheckout({
            sessionId: res.data.id,
          })
          .finally(() => {
            this.stripeService.loadingPayment.set(false);
          });
      });
  }
}
