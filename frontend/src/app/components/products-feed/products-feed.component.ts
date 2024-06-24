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
  term = '';

  setProducts() {
    this.productService.getAllProducts().subscribe((res: any) => {
      this.products = res.data;
    });
  }

  constructor() {
    this.term = this.route.snapshot.params['term'];

    if (this.term) {
      this.productService
        .getSearchSuggestions(this.term)
        .subscribe((res: any) => {
          this.products = res.data;
        });
    } else {
      this.setProducts();
    }
  }
}
