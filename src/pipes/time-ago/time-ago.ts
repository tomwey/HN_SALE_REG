import { Pipe, PipeTransform } from '@angular/core';

import * as moment from 'moment';
import 'moment/locale/zh-cn';

/**
 * Generated class for the TimeAgoPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'timeAgo',
})
export class TimeAgoPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string, format) {
    // console.log(value);
    // console.log(format);
    if (!value || value == 'NULL') return '--';

    value = value.replace('+08:00', '');
    value = value.replace('+', ' ');
    value = value.replace('T', ' ');

    return moment(value, format).fromNow();
  }

}
