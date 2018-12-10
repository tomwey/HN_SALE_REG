import { Component, Input, Output, EventEmitter } from '@angular/core';

/**
 * Generated class for the ManItemComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'man-item',
  templateUrl: 'man-item.html'
})
export class ManItemComponent {

  @Input() item: any = {};
  @Output() onSelect: EventEmitter<any> = new EventEmitter();
  // @Output() onCallPhone: EventEmitter<any> = new EventEmitter();

  constructor() { }

  selectItem(item) {
    this.onSelect.emit(item);
  }

  // callPhone(item, ev: Event) {
  //   ev.stopPropagation();
  //   this.onCallPhone.emit(item);
  // }
}
