import { Component } from '@angular/core';
import ProductsFeedComponent from '../../components/products-feed/products-feed.component';
import { BannerComponent } from '../../components/banner/banner.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ProductsFeedComponent, BannerComponent, FooterComponent],
  templateUrl: './home.component.html',
})
export default class HomeComponent {}
