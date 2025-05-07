import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../services/products.service';
import HomeComponent from '../home/home.component';

@Component({
    selector: 'app-search',
    imports: [HomeComponent],
    templateUrl: './search.component.html'
})
export default class SearchComponent {
  route = inject(ActivatedRoute);
  productService = inject(ProductsService);

  term = '';
  constructor() {
    this.term = this.route.snapshot.params['term'];
    // console.log('SearchBar: ', this.term);
  }
}
