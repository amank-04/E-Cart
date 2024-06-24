import { Component, inject } from '@angular/core';
import { Product } from '../../../../typing';
import { AdminService } from '../../services/admin.service';
import { IndNumPipe } from '../../pipes/ind-num.pipe';
import { ProductSkeletonComponent } from '../../components/product-skeleton/product-skeleton.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [IndNumPipe, ProductSkeletonComponent, RouterLink],
  templateUrl: './admin-products.component.html',
})
export default class AdminProductsComponent {
  productsList: Product[] = [];
  adminService = inject(AdminService);

  constructor() {
    this.adminService.getAllProducts().subscribe({
      next: (res: any) => {
        this.productsList = res.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  deleteProduct(id: string) {
    this.adminService.deleteProduct(id).subscribe({
      next: () => {
        this.productsList = this.productsList.filter((item) => item.id !== id);
      },
      error: () => {},
    });
  }
}
