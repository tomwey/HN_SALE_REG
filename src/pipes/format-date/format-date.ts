import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the FormatDatePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'formatDate',
})
export class FormatDatePipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string, ...args) {
    if (!value || value === 'NULL') return '--';
    let type = parseInt(args[0] || 0);
    value = value.replace('T', ' ');
    value = value.replace('+08:00', '');
    // 2018-11-19T14:09:19+08:00
    if (type === 0) {
      // 只显示日期
      return value.split(' ')[0];
    } else if (type === 1) {
      // 显示日期和时间分钟
      return value;
    } else {
      // 返回原加来的内容
      return value;
    }
    // return value.toLowerCase();
  }
}
