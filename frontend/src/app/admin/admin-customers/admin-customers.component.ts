import { Component } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { User } from '../../../../typing';
import { LoadingSpinnerComponent } from '../../components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-admin-customers',
  standalone: true,
  imports: [LoadingSpinnerComponent],
  templateUrl: './admin-customers.component.html',
})
export default class AdminCustomersComponent {
  loadingState: 'success' | 'loading' | 'error' = 'loading';
  customersList: User[] = [];
  constructor(private adminService: AdminService) {
    this.adminService.getAllUsers().subscribe({
      next: ({ data: { users } }) => {
        this.customersList = users;
        this.loadingState = 'success';
      },
      error: (err) => {
        this.loadingState = 'error';
      },
    });
  }
}
