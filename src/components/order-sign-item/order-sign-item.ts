import { Component, Input, Output, EventEmitter } from '@angular/core';

/**
 * Generated class for the OrderSignItemComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'order-sign-item',
  templateUrl: 'order-sign-item.html'
})
export class OrderSignItemComponent {

  @Input() item: any = {};
  @Input() menuType: string = '2';
  @Output() onSelect: EventEmitter<any> = new EventEmitter();
  // @Output() onCallPhone: EventEmitter<any> = new EventEmitter();

  constructor() {

  }

  selectItem(item) {
    this.onSelect.emit(item);
  }

  // callPhone(item, ev: Event) {
  //   ev.stopPropagation();
  //   this.onCallPhone.emit(item);
  // }

  formatMoney(money) {
    money = parseFloat(money) / 10000.0;
    if (isNaN(money)) {
      return '--';
    }
    return money.toFixed(2).toString();
  }
}
