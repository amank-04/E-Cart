import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartStore } from '../../store/cart.store';
import { ProductsService } from '../../services/products.service';
import { FooterComponent } from '../../components/footer/footer.component';
import { StripeService } from '../../services/stripe.service';
import { loadStripe } from '@stripe/stripe-js';
import { IndNumPipe } from '../../pipes/ind-num.pipe';
import { AuthService } from '../../services/auth.service';
import { CartSkeletonComponent } from '../../components/cart-skeleton/cart-skeleton.component';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink, FooterComponent, IndNumPipe, CartSkeletonComponent],
  templateUrl: './cart.component.html',
})
export default class CartComponent {
  cartStore = inject(CartStore);
  productsService = inject(ProductsService);
  stripeService = inject(StripeService);
  authService = inject(AuthService);

  toggleItemSelection(id: String) {
    this.cartStore.toggleItemSelection(id);

    if (!this.authService.currentUser()) {
      return;
    }

    const item = this.cartStore.items().find((item) => item.id === id);
    if (item) {
      this.productsService.updateCartItem({
        count: item.count,
        p_id: item.id,
        selected: item.selected,
      });
    }
  }

  incrementCount(id: String) {
    this.cartStore.incrementItemCount(id);

    if (!this.authService.currentUser()) {
      return;
    }

    const item = this.cartStore.items().find((item) => item.id === id);
    if (item) {
      this.productsService.updateCartItem({
        count: item.count,
        p_id: item.id,
        selected: item.selected,
      });
    }
  }

  decrementCount(id: String) {
    const item = this.cartStore.items().find((item) => item.id === id);
    this.cartStore.decrementItemCount(id);

    if (!this.authService.currentUser()) {
      return;
    }

    if (item) {
      if (item.count) {
        this.productsService.updateCartItem({
          count: item.count,
          p_id: item.id,
          selected: item.selected,
        });
      } else {
        this.productsService.deleteCartItem(item.id);
      }
    }
  }

  handleSelectAllItems() {
    const selectAll =
      this.cartStore.items().length !== this.cartStore.selectedItemCount();
    this.cartStore.handleSelectAllItems(selectAll);
    const selected = this.cartStore.items()[0].selected;

    if (!this.authService.currentUser()) {
      return;
    }

    this.productsService.selectAllCartItems(selected);
  }

  handleCheckout() {
    if (!this.authService.currentUser()) {
      return;
    }

    this.stripeService
      .createPayment(this.cartStore.items().filter((item) => item.selected))
      ?.subscribe(async (res: any) => {
        const stripe = await loadStripe(this.stripeService.stripePublicKey);

        stripe?.redirectToCheckout({
          sessionId: res.data.id,
        });
      });
  }
}
