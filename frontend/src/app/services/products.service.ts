import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { CartItem, Product, ProductDetails, Review } from '../../../typing';
import { environment } from '../../environments/environment';

type CartData = {
  selected: Boolean;
  count: number;
  p_id: string;
};

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private url = environment.apiUrl;
  products: Product[] = [];
  // searchTerm = signal('');

  constructor(private http: HttpClient) {}

  // Products
  getAllProducts() {
    return this.http.get<Product[]>(this.url + '/products');
  }

  getSearchSuggestions(term: string, limit?: number) {
    let productsApi = this.url + `/products/search?term=${term}`;
    if (limit) {
      productsApi += `&limit=${limit}`;
    }

    return this.http.get<Product[]>(productsApi);
  }

  getProduct(id: string) {
    return this.http.get<ProductDetails>(this.url + `/products/${id}`);
  }

  getProductReviews(id: string) {
    return this.http.get(this.url + `/products/${id}/reviews`);
  }

  addProductReview(product_id: string, rating: number, comment: string) {
    return this.http.post(this.url + `/products/${product_id}/add-review`, {
      rating,
      comment,
      token: localStorage.getItem('auth_token') || '',
    });
  }

  // Cart
  getCartItems() {
    return this.http.post(this.url + '/cart', {
      token: localStorage.getItem('auth_token') || '',
    });
  }

  createCartItem(item: CartData) {
    this.http
      .post(this.url + '/cart/create', {
        item,
        token: localStorage.getItem('auth_token'),
      })
      .subscribe();
  }

  updateCartItem(item: CartData) {
    this.http
      .post(this.url + '/cart/update', {
        item,
        token: localStorage.getItem('auth_token'),
      })
      .subscribe();
  }

  deleteCartItem(p_id: string) {
    this.http
      .post(this.url + '/cart/del', {
        p_id,
        token: localStorage.getItem('auth_token'),
      })
      .subscribe();
  }

  selectAllCartItems(selectedState: Boolean) {
    this.http
      .post(this.url + '/cart/select', {
        selectedState,
        token: localStorage.getItem('auth_token'),
      })
      .subscribe();
  }
}
