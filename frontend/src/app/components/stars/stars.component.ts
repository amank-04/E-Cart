import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-stars',
    imports: [],
    templateUrl: './stars.component.html'
})
export class StarsComponent {
  @Input({ required: true }) rating!: number;
  @Input({ required: true }) color!: 'b' | 'y';
  @Input({ required: true }) size!: 's' | 'm';

  getArray(len: number) {
    return Array(Math.floor(len));
  }
}
