import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the HouseDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-house-detail',
  templateUrl: 'house-detail.html',
})
export class HouseDetailPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HouseDetailPage');
  }

  data: any = [
    {
      label: '房间名称',
      value: '枫丹西悦二期 2栋一单元 702'
    },
    {
      label: '户型',
      value: 'A1'
    },
    {
      label: '房间结构',
      value: '三室两厅双卫'
    },
    {
      label: '楼层',
      value: '7'
    },
    {
      label: '朝向',
      value: '朝南'
    },
    {
      label: '建筑面积',
      value: '112.00m²'
    },
    {
      label: '套内面积',
      value: '98.00m²'
    },
    {
      label: '建筑单价',
      value: '9,138.00元/m²'
    },
    {
      label: '套内单价',
      value: '10,443.00元/m²'
    },
    {
      label: '标准总价',
      value: '1,023,456.00元'
    },
    {
      label: '户型图',
      value: 'assets/imgs/hxt.jpg',
      type: '2',
    }
  ];

}
