import { Component, Input, Output, EventEmitter } from '@angular/core';

/**
 * Generated class for the PaymentMoneyItemComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'payment-money-item',
  templateUrl: 'payment-money-item.html'
})
export class PaymentMoneyItemComponent {


  @Input() item: any;
  @Output() onSelect: EventEmitter<any> = new EventEmitter();
  constructor() {
  }

  selectItem(item) {
    this.onSelect.emit(item);
  }

}
