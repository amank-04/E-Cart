import { Component } from '@angular/core';
import { Order } from '../../../../typing';
import { AdminService } from '../../services/admin.service';
import { DatePipe } from '@angular/common';
import { IndNumPipe } from '../../pipes/ind-num.pipe';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';
import { LoadingSpinnerComponent } from '../../components/loading-spinner/loading-spinner.component';

@Component({
    selector: 'app-admin-orders',
    imports: [
        DatePipe,
        IndNumPipe,
        ClickOutsideDirective,
        LoadingSpinnerComponent,
    ],
    templateUrl: './admin-orders.component.html'
})
export default class AdminOrdersComponent {
  loadingState: 'success' | 'loading' | 'error' = 'loading';
  ordersList: Order[] = [];
  menuOpen: number | null = null;

  constructor(private adminService: AdminService) {
    this.adminService.getAllOrders().subscribe({
      next: ({ data: { orders } }) => {
        this.ordersList = orders;
        this.loadingState = 'success';
      },
      error: (err) => {
        this.loadingState = 'error';
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
        const order = this.ordersList.find((item) => item.id === id);
        if (order) {
          order.status = newStatus;
        }
      });
    }
  }
}
