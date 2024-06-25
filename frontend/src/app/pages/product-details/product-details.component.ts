import { Component, inject } from '@angular/core';
import { CartItem, ProductDetails } from '../../../../typing';
import { ProductsService } from '../../services/products.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BannerComponent } from '../../components/banner/banner.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { IndNumPipe } from '../../pipes/ind-num.pipe';
import { ReviewsComponent } from '../../components/reviews/reviews.component';
import { StripeService } from '../../services/stripe.service';
import { AuthService } from '../../services/auth.service';
import { CartStore } from '../../store/cart.store';
import { loadStripe } from '@stripe/stripe-js';
import { NotifyService } from '../../services/notify.service';
import { ProductDetailsSkeletonComponent } from '../../components/product-details-skeleton/product-details-skeleton.component';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    BannerComponent,
    FooterComponent,
    IndNumPipe,
    ReviewsComponent,
    ProductDetailsSkeletonComponent,
  ],
  templateUrl: './product-details.component.html',
})
export default class ProductDetailsComponent {
  product: ProductDetails | undefined;
  currentImage: string | undefined = '';
  id = '';
  loadingState: 'success' | 'loading' | 'error' = 'loading';

  cartStore = inject(CartStore);
  productService = inject(ProductsService);
  authService = inject(AuthService);
  stripeService = inject(StripeService);
  route = inject(ActivatedRoute);
  router = inject(Router);
  notifyService = inject(NotifyService);

  constructor() {
    this.id = this.route.snapshot.params['id'];
    this.productService.getProduct(this.id).subscribe({
      next: (res: any) => {
        if (!res.data) {
          this.router.navigateByUrl('/Product-Not-Found');
        } else {
          this.product = res.data;
          this.loadingState = 'success';
          this.currentImage = res.data.imageurls[0];
        }
      },
      error: () => {
        this.loadingState = 'error';
      },
    });
  }

  changeCurrentImage(url: string) {
    this.currentImage = url;
  }

  addToCart() {
    if (!this.authService.currentUser()) {
      this.notifyService.setNotification('Please login to use Cart', 'error');
      return;
    }
    const newCartItem: CartItem = {
      count: 1,
      description: this.product!.description,
      id: this.id,
      imageurl: this.product!.imageurls[0],
      price: this.product!.price,
      name: this.product!.name,
      selected: true,
    };

    const findItem = this.cartStore.items().find((item) => item.id === this.id);

    if (findItem) {
      this.productService.updateCartItem({
        count: findItem.count + 1,
        p_id: findItem.id,
        selected: true,
      });
    } else {
      this.productService.createCartItem({
        count: 1,
        p_id: this.id,
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
          description: this.product!.description,
          id: this.id,
          imageurl: this.product!.imageurls[0],
          name: this.product!.name,
          price: this.product!.price,
          selected: true,
        },
      ])!
      .subscribe(async (res: any) => {
        const stripe = await loadStripe(this.stripeService.stripePublicKey);
        stripe!
          .redirectToCheckout({
            sessionId: res.data.id,
          })
          .finally(() => {
            this.stripeService.loadingPayment.set(false);
          });
      });
  }
}
