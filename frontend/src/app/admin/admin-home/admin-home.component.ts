import { Component, inject } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { IndNumPipe } from '../../pipes/ind-num.pipe';
import { RouterLink } from '@angular/router';
import { Product } from '../../../../typing';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [IndNumPipe, RouterLink],
  templateUrl: './admin-home.component.html',
})
export default class AdminHomeComponent {
  adminService = inject(AdminService);
  totalSales = 0;
  ordersCount = 0;
  totalCustomers = 0;
  avgValue = 0;
  totalProducts = 0;
  limitedProducts = 0;

  constructor() {
    this.adminService.getAllOrders().subscribe((res) => {
      const orders = res.data.orders;
      this.ordersCount = orders.length;
      orders.forEach((order) => {
        this.totalSales += order.total;
      });
    });

    this.adminService.getAllUsers().subscribe((res) => {
      const customers = res.data.users;
      this.totalCustomers = customers.length;
      this.avgValue = this.totalSales / this.totalCustomers;
      this.avgValue = Number(this.avgValue.toFixed(0));
    });

    this.adminService.getAllProducts().subscribe((res: any) => {
      const products = res.data as Product[];
      this.totalProducts = products.length;
      products.forEach((product) => {
        if (product.limiteddeal) {
          this.limitedProducts++;
        }
      });
    });
  }
}
