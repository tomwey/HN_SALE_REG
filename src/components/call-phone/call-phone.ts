import { Component, Input } from '@angular/core';

/**
 * Generated class for the CallPhoneComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'call-phone',
  templateUrl: 'call-phone.html'
})
export class CallPhoneComponent {

  @Input() mobile: string;
  constructor() {

  }

  callPhone(ev: Event) {
    ev.stopPropagation();
    window.location.href = `tel:${this.mobile}`;
  }

}
