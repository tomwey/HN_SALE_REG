import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiService } from '../../provider/api-service';
import { Utils } from '../../provider/Utils';

/**
 * Generated class for the PaymoneyListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-paymoney-list',
  templateUrl: 'paymoney-list.html',
})
export class PaymoneyListPage {

  item: any;
  data: any = [];
  error: any = null;

  constructor(public navCtrl: NavController,
    private api: ApiService,
    public navParams: NavParams) {
    this.item = this.navParams.data;
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad PaymoneyListPage');
    setTimeout(() => {
      this.loadData();
    }, 300);
  }

  loadData() {
    this.api.POST(null, {
      dotype: 'GetData',
      funname: '获取销售系统回款款项列表APP',
      param1: this.item.orderid,
      param2: Utils.getQueryString('manid')
    })
      .then(data => {
        if (data && data['data']) {
          let arr = data['data'];
          this.data = arr;
          this.error = this.data.length === 0 ? '暂无回款明细' : null;
        } else {
          this.error = '非法错误!';
        }
      })
      .catch(error => {
        this.error = error.message || '服务器出错了';
      })
  }

}
