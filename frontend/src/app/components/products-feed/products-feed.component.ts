import { Component, inject } from '@angular/core';
import { ProductComponent } from '../product/product.component';
import { Product } from '../../../../typing';
import { ProductsService } from '../../services/products.service';
import { ProductSkeletonComponent } from '../product-skeleton/product-skeleton.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-products-feed',
  standalone: true,
  imports: [ProductComponent, ProductSkeletonComponent],
  templateUrl: './products-feed.component.html',
})
export default class ProductsFeedComponent {
  products: Product[] = [];
  productService = inject(ProductsService);
  route = inject(ActivatedRoute);
  loadingState: 'success' | 'loading' | 'error' = 'loading';
  term = '';

  setProducts() {
    this.productService.getAllProducts().subscribe({
      next: (res: any) => {
        this.products = res.data;
        this.loadingState = 'success';
      },
      error: () => {
        this.loadingState = 'error';
      },
    });
  }

  constructor() {
    this.term = this.route.snapshot.params['term'];

    if (this.term) {
      this.productService.getSearchSuggestions(this.term).subscribe({
        next: (res: any) => {
          this.products = res.data;
          this.loadingState = 'success';
        },
        error: () => {
          this.loadingState = 'error';
        },
      });
    } else {
      this.setProducts();
    }
  }
}
