import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the CommSelectPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-comm-select',
  templateUrl: 'comm-select.html',
})
export class CommSelectPage {

  data: any = [];
  error: any = null;
  title: any = '请选择';
  selectedItem: any;

  keyword: any = '';
  originData: any = [];
  constructor(public navCtrl: NavController, 
    private viewCtrl: ViewController,
    public navParams: NavParams) {
      this.data = this.navParams.data.data;
      this.title = this.navParams.data.title;
      this.selectedItem = this.navParams.data.selectedItem;
      if (this.data.length == 0) {
        this.error = '暂无数据';
      }

      this.originData = this.data;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommSelectPage');
  }

  startSearch(kw) {
    if (kw.trim() == '') {
      this.data = this.originData;
      return;
    }

    this.data = this.originData.filter(item => {
      return item.indexOf(kw.trim().toLowerCase()) > -1;
    });
  }

  close() {
    this.viewCtrl.dismiss().catch();
  }

  selectItem(item) {
    let label = item.split('|')[0];
    let value = item.split('|')[1];
    this.viewCtrl.dismiss({
      label: label,
      value: value
    });
  }

}
