import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Order, Product, ProductDetails, User } from '../../../typing';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private adminApi = environment.apiUrl + '/admin';

  constructor(private http: HttpClient) {}

  getAllProducts() {
    return this.http.get<Product[]>(this.adminApi + '/products');
  }

  getAllOrders() {
    return this.http.get<{ data: { orders: Order[] } }>(
      this.adminApi + '/orders',
    );
  }

  getAllUsers() {
    return this.http.get<{ data: { users: User[] } }>(
      this.adminApi + '/customers',
    );
  }

  updateOrder(id: number, newStatus: string) {
    return this.http.post(this.adminApi + '/orders', {
      id,
      newStatus,
    });
  }

  addNewProduct(product: any) {
    return this.http.post(this.adminApi + '/add-product', {
      product,
    });
  }

  deleteProduct(id: string) {
    return this.http.post(this.adminApi + '/delete', {
      id,
    });
  }

  updateProduct(id: string, product: ProductDetails) {
    return this.http.post(this.adminApi + '/update-product', {
      id,
      product,
    });
  }
}
