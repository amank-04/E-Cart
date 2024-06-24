import { Component } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { User } from '../../../../typing';

@Component({
  selector: 'app-admin-customers',
  standalone: true,
  imports: [],
  templateUrl: './admin-customers.component.html',
})
export default class AdminCustomersComponent {
  customersList: User[] = [];
  constructor(private adminService: AdminService) {
    this.adminService.getAllUsers().subscribe({
      next: ({ data: { users } }) => {
        this.customersList = users;
      },
      error: (err) => {},
    });
  }
}
