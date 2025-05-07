import { Component, OnInit, inject } from '@angular/core';
import { Order } from '../../../../typing';
import { OrderCardComponent } from '../../components/order-card/order-card.component';
import { OrdersService } from '../../services/orders.service';
import { AuthService } from '../../services/auth.service';
import { FooterComponent } from '../../components/footer/footer.component';
import { LoadingSpinnerComponent } from '../../components/loading-spinner/loading-spinner.component';

@Component({
    selector: 'app-orders',
    imports: [OrderCardComponent, FooterComponent, LoadingSpinnerComponent],
    templateUrl: './orders.component.html'
})
export default class OrdersComponent implements OnInit {
  loadingState: 'success' | 'loading' | 'error' = 'loading';

  orders: Order[] = [];
  ordersService = inject(OrdersService);
  authService = inject(AuthService);

  ngOnInit(): void {
    this.ordersService.getOrders()?.subscribe({
      next: (res: any) => {
        this.orders = res.data;
        this.loadingState = 'success';
      },
      error: () => {
        this.loadingState = 'error';
      },
    });
  }
}
