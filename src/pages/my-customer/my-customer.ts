import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the MyCustomerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-my-customer',
  templateUrl: 'my-customer.html',
})
export class MyCustomerPage {
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad MyCustomerPage');
    // this.error = '暂无数据';
  }

  segmentChanged(ev) {

  }

  startSearch(kw) {

  }

  openItem(item) {
    
  }

  data: any = [
    {
      mobile: '18048553687',
      name: '张先生',
      sex: '1',
      type: '1',
      typename: '来电',
      content: '询问了价格方面的情况',
      time: '2018-07-28',
      left_days: 1,
    },
    {
      mobile: '13312345678',
      name: '王女士',
      sex: '2',
      type: '2',
      typename: '来访',
      content: '初次了解',
      time: '2018-07-25',
      left_days: 3,
    },
  ];
  error: any = null;

  keyword: string = '';
  menuType: any = '1';

  menues: any = [
    {
      ID: '1',
      name: '来访',
    },
    {
      ID: '2',
      name: '认购',
    },
    {
      ID: '3',
      name: '签约',
    },
    {
      ID: '4',
      name: '按揭',
    },
    {
      ID: '5',
      name: '回款',
    },
  ];

}
