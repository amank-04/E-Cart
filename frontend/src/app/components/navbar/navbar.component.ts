import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CartStore } from '../../store/cart.store';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';
import { AuthService } from '../../services/auth.service';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../../../typing';
import { IndNumPipe } from '../../pipes/ind-num.pipe';

@Component({
    selector: 'app-navbar',
    imports: [RouterLink, ClickOutsideDirective, IndNumPipe],
    templateUrl: './navbar.component.html'
})
export class NavbarComponent {
  cartStore = inject(CartStore);
  authService = inject(AuthService);
  productsService = inject(ProductsService);
  router = inject(Router);
  suggestions: Product[] = [];
  showSuggestions = true;

  isMenuOpen = false;
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  clickedOutside() {
    this.isMenuOpen = false;
  }

  handleSearch(searchTerm: string) {
    if (!searchTerm) {
      this.suggestions = [];
      return;
    }

    this.showSuggestions = true;
    this.productsService
      .getSearchSuggestions(searchTerm, 5)
      .subscribe((res: any) => {
        this.suggestions = res.data;
      });
  }

  handleSearchSubmit(term: string) {
    this.showSuggestions = false;
    window.location.href = term ? '/search/' + term : '';
  }

  handleClickOutside() {
    this.showSuggestions = false;
  }

  logOut() {
    this.isMenuOpen = false;
    this.authService.logOut();
  }
}
