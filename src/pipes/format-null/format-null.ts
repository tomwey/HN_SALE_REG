import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the FormatNullPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'formatNull',
})
export class FormatNullPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string, ...args) {
    if (!value) return '';

    const defaultVal = (args[0] || '').toString();

    return value.replace('NULL', defaultVal);
  }
}
