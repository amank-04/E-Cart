import { Component, OnInit, inject } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import { ProductDetails } from '../../../../typing';

@Component({
    selector: 'app-edit-product',
    imports: [FormsModule, ReactiveFormsModule],
    templateUrl: './edit-product.component.html'
})
export default class EditProductComponent implements OnInit {
  fb = inject(FormBuilder);
  adminService = inject(AdminService);
  router = inject(Router);
  productService = inject(ProductsService);
  route = inject(ActivatedRoute);
  id = '';

  productForm!: FormGroup;

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    this.productService.getProduct(this.id).subscribe((res: any) => {
      const {
        description,
        details,
        imageurls,
        name,
        originalprice,
        price,
        title,
      } = res.data as ProductDetails;

      this.productForm = this.fb.nonNullable.group({
        name: [name],
        title: [title],
        description: [description],
        price: [price],
        originalPrice: [originalprice],
        imageurls: this.fb.nonNullable.array(imageurls),
        details: this.fb.nonNullable.array([]),
      });

      details.forEach((prop) => {
        this.details().push(
          this.fb.nonNullable.group({
            key: new FormControl(prop.key),
            val: new FormControl(prop.val),
          }),
        );
      });
    });
  }

  imageurls(): FormArray {
    return this.productForm.get('imageurls') as FormArray;
  }

  details(): FormArray {
    return this.productForm.get('details') as FormArray;
  }

  addImage() {
    if (this.imageurls().length === 4) {
      return;
    }
    this.imageurls().push(new FormControl(''));
  }

  removeImage(index: number) {
    if (this.imageurls().length === 1) {
      return;
    }
    this.imageurls().removeAt(index);
  }

  addProperty() {
    this.details().push(
      this.fb.nonNullable.group({
        key: new FormControl(''),
        val: new FormControl(''),
      }),
    );
  }

  removeProperty(index: number) {
    const details = <FormArray>this.productForm.controls['details'];
    if (details.length === 1) {
      return;
    }
    details.removeAt(index);
  }

  handleSubmit() {
    this.adminService.updateProduct(this.id, this.productForm.value).subscribe({
      next: () => {
        this.router.navigateByUrl('/admin/products');
      },
    });
  }
}
