import { Component, Input } from '@angular/core';
import { AlertController } from 'ionic-angular';

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
  @Input() multiple: boolean = false;
  constructor(private alertCtrl: AlertController) {

  }

  callPhone(ev: Event) {
    ev.stopPropagation();
    if (!this.multiple) {
      window.location.href = `tel:${this.mobile}`;
    } else {
      this._callMultiPhone();
    }
  }

  private _callMultiPhone() {
    let custandphone = this.mobile || '';
    custandphone = custandphone.replace('NULL', '');
    console.log(custandphone);
    if (!custandphone) {
      this.showAlert();
      return;
    }

    const arr = custandphone.split('*');
    if (arr.length !== 2) {
      this.showAlert('客户资料错误', '不正确的客户姓名和电话')
      return;
    }

    let phones: any = arr[0];
    let names: any = arr[1];

    phones = phones.split(':');
    names = names.split(':');

    if (phones.length !== 2) {
      this.showAlert('客户资料错误', '不正确的客户电话')
      return;
    }

    if (names.length !== 2) {
      this.showAlert('客户资料错误', '不正确的客户姓名')
      return;
    }

    phones = phones[1].split(',');
    names = names[1].split(',');

    if (phones.length <= 0) {
      this.showAlert();
      return;
    };

    if (phones.length === 1) {
      window.location.href = `tel:${phones[0]}`;
      return;
    }

    let alert = this.alertCtrl.create();
    alert.setTitle('选择一个电话号码拨打');

    let count = names.length;
    if (count > phones.length) {
      count = phones.length
    }
    for (let i = 0; i < count; i++) {
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

  showAlert(title = '拨打电话失败', message = '未找到客户电话号码') {
    this.alertCtrl.create({
      title: title,
      message: message,
      buttons: ['确定']
    }).present();
  }
}
