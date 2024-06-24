import { Component, inject } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-add-product',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './admin-add-product.component.html',
})
export default class AdminAddProductComponent {
  fb = inject(FormBuilder);
  adminService = inject(AdminService);
  router = inject(Router);

  newProductForm = this.fb.nonNullable.group({
    name: [''],
    title: [''],
    description: [''],
    price: [],
    originalprice: [],
    imageurls: this.fb.nonNullable.array(['']),
    details: this.fb.nonNullable.array([
      this.fb.nonNullable.group({
        key: new FormControl(''),
        val: new FormControl(''),
      }),
    ]),
  });

  imageurls(): FormArray {
    return this.newProductForm.get('imageurls') as FormArray;
  }

  details(): FormArray {
    return this.newProductForm.get('details') as FormArray;
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
    const details = <FormArray>this.newProductForm.controls['details'];
    if (details.length === 1) {
      return;
    }
    details.removeAt(index);
  }

  handleSubmit() {
    this.adminService.addNewProduct(this.newProductForm.value).subscribe({
      next: () => {
        this.router.navigateByUrl('/admin/products');
      },
      error: (err) => {},
    });
  }
}
