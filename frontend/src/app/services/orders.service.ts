import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private http = inject(HttpClient);
  private ordersApi = environment.apiUrl + '/orders';

  getOrders() {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      return;
    }
    return this.http.post(this.ordersApi, {
      token,
    });
  }
}
