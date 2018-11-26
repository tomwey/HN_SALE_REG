import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the HackMobilePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'hackMobile',
})
export class HackMobilePipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string, ...args) {
    if (!value || value === 'NULL') return '--';
    const start = value.slice(0,3);
    const end   = value.slice(-4);
    return `${start}****${end}`;
  }
}
