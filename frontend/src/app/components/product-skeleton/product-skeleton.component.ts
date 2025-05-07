import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-product-skeleton',
    imports: [],
    templateUrl: './product-skeleton.component.html'
})
export class ProductSkeletonComponent {
  @Input({ required: true }) len?: number;
  products = Array(this.len ?? 4);
}
