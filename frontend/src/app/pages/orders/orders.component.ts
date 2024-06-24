import { Component, OnInit, inject } from '@angular/core';
import { Order } from '../../../../typing';
import { OrderCardComponent } from '../../components/order-card/order-card.component';
import { OrdersService } from '../../services/orders.service';
import { AuthService } from '../../services/auth.service';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [OrderCardComponent, FooterComponent],
  templateUrl: './orders.component.html',
})
export default class OrdersComponent implements OnInit {
  orders: Order[] = [];
  ordersService = inject(OrdersService);
  authService = inject(AuthService);

  ngOnInit(): void {
    this.ordersService.getOrders()?.subscribe((res: any) => {
      this.orders = res.data;
    });
  }
}
