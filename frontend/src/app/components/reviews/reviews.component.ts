import { Component, Input, OnInit, inject } from '@angular/core';
import { ShortNumPipe } from '../../pipes/short-num.pipe';
import { Review } from '../../../../typing';
import { DatePipe } from '@angular/common';
import { StarsComponent } from '../stars/stars.component';
import { ProductsService } from '../../services/products.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [ShortNumPipe, DatePipe, StarsComponent],
  templateUrl: './reviews.component.html',
})
export class ReviewsComponent implements OnInit {
  @Input({ required: true }) id!: string;

  productService = inject(ProductsService);
  authService = inject(AuthService);

  avgRating = 0;
  reviewsSum = 0;
  stars: number[] = [0, 0, 0, 0, 0];
  userRating = 5;
  reviews: Review[] = [];

  ngOnInit() {
    this.productService.getProductReviews(this.id).subscribe((res: any) => {
      this.reviews = res.data;
      if (this.reviews.length) {
        this.reviews.forEach((review) => {
          this.reviewsSum += review.rating;
          this.stars[5 - review.rating]++;
        });

        this.avgRating = this.reviewsSum / this.reviews.length;
      }
    });
  }

  setUserRating(rating: number) {
    this.userRating = rating;
  }

  getArray(len: number) {
    return Array(Math.floor(len));
  }

  createReview(comment: string) {
    if (!this.authService.currentUser()) {
      return;
    }
    const { firstname, imageurl, lastname } = this.authService.currentUser()!;

    this.productService
      .addProductReview(this.id, this.userRating, comment)
      .subscribe(() => {
        this.reviews = [
          {
            comment,
            name: firstname + ' ' + lastname,
            profile_img: imageurl,
            rating: this.userRating,
            time: new Date(),
          },
          ...this.reviews,
        ];

        this.reviewsSum += this.userRating;
        this.stars[5 - this.userRating]++;
        this.avgRating = this.reviewsSum / this.reviews.length;
      });
  }
}
