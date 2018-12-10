import { Component, Input, Output, EventEmitter } from '@angular/core';

/**
 * Generated class for the MortgageItemComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'mortgage-item',
  templateUrl: 'mortgage-item.html'
})
export class MortgageItemComponent {

  @Input() item: any = {};
  @Input() menuType: string = '2';
  @Output() onSelect: EventEmitter<any> = new EventEmitter();
  // @Output() onCallPhone: EventEmitter<any> = new EventEmitter();
  constructor() {

  }

  selectItem(item) {
    this.onSelect.emit(item);
  }

}
