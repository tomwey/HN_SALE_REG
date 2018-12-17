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

  // 是否已经逾期
  checkExpire(item) {
    const unpayMoney = parseFloat(item.unpaymoney);
    const planDate = new Date(item.plandate);
    // console.log(planDate.getFullYear(), planDate.getMonth(), planDate.getDate());
    let now = new Date();

    if (this._date1SmallerDate2(planDate, now) && unpayMoney > 0.0) return true;
    return false;
  }

  _date1SmallerDate2(d1: Date, d2: Date) {
    const y1 = d1.getFullYear();
    const m1 = d1.getMonth();
    const date1 = d1.getDate();

    const y2 = d2.getFullYear();
    const m2 = d2.getMonth();
    const date2 = d2.getDate();

    if (y1 < y2) return true;
    if (y1 > y2) return false;

    if (m1 < m2) return true;
    if (m1 > m2) return false;

    if (date1 < date2) return true;
    return false;
  }

}
