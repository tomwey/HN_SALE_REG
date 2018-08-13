import { Component } from '@angular/core';
import { NavController, NavParams, App } from 'ionic-angular';

/**
 * Generated class for the HouseQueryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-house-query',
  templateUrl: 'house-query.html',
})
export class HouseQueryPage {

  constructor(public navCtrl: NavController, 
    private app: App,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad HouseQueryPage');
  }

  openHouse(item) {
    this.app.getRootNavs()[0].push('HouseInfoPage');
  }

  selectIndustry() {

  }

  selectProject() {
    
  }

  houses: any = [
    {
      name: '2栋',
      count: 30
    },
    {
      name: '3栋',
      count: 30
    },
    {
      name: '4栋',
      count: 30
    },
    {
      name: '7栋',
      count: 30
    },
    {
      name: '12栋',
      count: 30
    },
    {
      name: '13栋',
      count: 30
    },
    {
      name: '15栋',
      count: 30
    },
  ];

}
