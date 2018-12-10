import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AlertController } from 'ionic-angular';

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
  // @Output() onCallPhone: EventEmitter<any> = new EventEmitter();
  constructor(private alertCtrl: AlertController) {
  }

  selectItem(item) {
    this.onSelect.emit(item);
  }

  callPhone(ev: Event) {
    ev.stopPropagation();

    const arr = this.item.custandphone.split('*');
    let phones = arr[0];
    let names = arr[1];

    phones = phones.split(':')[1];
    names = names.split(':')[1];

    phones = phones.split(',');
    names = names.split(',');

    if (phones.length <= 0) {
      this.alertCtrl.create({
        title: '拨打电话失败',
        message: '未找到客户电话号码',
        buttons: ['确定']
      }).present();
      return;
    };

    if (phones.length === 1) {
      window.location.href = `tel:${phones[0]}`;
      return;
    }

    let alert = this.alertCtrl.create();
    alert.setTitle('选择一个电话号码拨打');

    for (let i = 0; i < names.length; i++) {
      let checked = (i === 0);
      let label = `${phones[i]} ${names[i]}`;
      let value = phones[i];

      alert.addInput({
        type: 'radio',
        label: label,
        value: value,
        checked: checked
      });
    }

    alert.addButton('取消');
    alert.addButton({
      text: '拨打',
      handler: (value) => {
        // console.log(data);
        window.location.href = `tel:${value}`;
      }
    });
    alert.present();
  }

}
