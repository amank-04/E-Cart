import { Component } from '@angular/core';
import { Order } from '../../../../typing';
import { AdminService } from '../../services/admin.service';
import { DatePipe } from '@angular/common';
import { IndNumPipe } from '../../pipes/ind-num.pipe';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [DatePipe, IndNumPipe, ClickOutsideDirective],
  templateUrl: './admin-orders.component.html',
})
export default class AdminOrdersComponent {
  ordersList: Order[] = [];
  menuOpen: number | null = null;

  constructor(private adminService: AdminService) {
    this.adminService.getAllOrders().subscribe({
      next: ({ data: { orders } }) => {
        this.ordersList = orders;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  toggleMenu(id: number | null) {
    setTimeout(() => {
      this.menuOpen = this.menuOpen === id ? null : id;
    }, 1);
  }

  changeStatus(id: number, currentStatus: string, newStatus: string) {
    this.toggleMenu(null);
    if (currentStatus !== newStatus) {
      this.adminService.updateOrder(id, newStatus).subscribe((res) => {
        this.ordersList[id - 1].status = newStatus;
      });
    }
  }
}
