import { Component, Input } from '@angular/core';
import { Order } from '../../../../typing';
import { RouterLink } from '@angular/router';
import { IndNumPipe } from '../../pipes/ind-num.pipe';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-order-card',
    imports: [RouterLink, IndNumPipe, DatePipe],
    templateUrl: './order-card.component.html'
})
export class OrderCardComponent {
  @Input({ required: true }) order!: Order;
}
