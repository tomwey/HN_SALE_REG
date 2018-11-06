import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { VistorsQueryPage } from '../vistors-query/vistors-query';
import { MortgageDetailPage } from '../mortgage-detail/mortgage-detail';
import { MortgageListPage } from '../mortgage-list/mortgage-list';
import { HouseQueryPage } from '../house-query/house-query';
import { MyCustomerPage } from '../my-customer/my-customer';

/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  data: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.data = [
      {
        icon: 'ios-laifang',
        name: '来访登记',
        page: VistorsQueryPage,
      },
      {
        icon: 'ios-list-box-outline',
        name: '按揭台账',
        page: 'MortgageListPage',
      },
      {
        icon: 'ios-house',
        name: '房源查询',
        page: HouseQueryPage,
      },
      {
        icon: 'ios-customer',
        name: '我的客户',
        page: MyCustomerPage,
      },
    ];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }

  back() {
    window.location.href = 'salereg://back';
  }

  forwardTo(item) {
    this.navCtrl.push(item.page);
  }

}
