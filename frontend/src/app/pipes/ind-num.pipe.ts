import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'indNum',
  standalone: true,
})
export class IndNumPipe implements PipeTransform {
  transform(value: number | undefined): string {
    if (!value || isNaN(value)) {
      return '0';
    }
    let indFormat = '',
      val = value.toString();
    let gap = 3;
    for (let i = val.length - 1; i >= 0; --i) {
      if (gap-- == 0) {
        indFormat = ',' + indFormat;
        gap = 1;
      }
      indFormat = val[i].toString() + indFormat;
    }

    return indFormat;
  }
}
