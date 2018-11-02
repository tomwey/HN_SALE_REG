import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';

/**
 * Generated class for the MortgageDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-mortgage-detail',
  templateUrl: 'mortgage-detail.html',
})
export class MortgageDetailPage {

  items: any = [];
  mortgage: any = null;
  constructor(public navCtrl: NavController, 
    private app: App,
    public navParams: NavParams) {
    this.mortgage = this.navParams.data;
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad MortgageDetailPage');
    this.prepareData();
  }

  prepareData() {
    this.items.push({ label: '客户名称', value: this.mortgage.custnames });
    this.items.push({ label: '房间号', value: this.mortgage.house_no });
    this.items.push({ label: '证件号码', value: this.mortgage.cardnos });
    this.items.push({ label: '贷款金额', value: this.mortgage.ajmoney });
    this.items.push({ label: '贷款方式', value: this.mortgage.paytypename });
    this.items.push({ label: '按揭银行', value: this.mortgage.ajbank });
    this.items.push({ label: '贷款年限', value: this.mortgage.ajyears });
    this.items.push({ label: '按揭状态', value: this.mortgage.ajstate_desc });
    this.items.push({ label: '回款时间', value: this.mortgage.repaydate.replace('NULL', '--') });
    this.items.push({ label: '是否断供', value: parseInt(this.mortgage.isabort) == 0 ? '否' : '是'  });
    this.items.push({ label: '异常类型', value: this.mortgage.ajstatedesc });
    this.items.push({ label: '异常说明', value: this.mortgage.ajstatedesc });
    this.items.push({ label: '销售员', value: this.mortgage.sellername });
  }

  openTraceList() {
    this.app.getRootNavs()[0].push('ProgressHistoryPage', this.mortgage);
  }

  gotoFollow() {
    this.app.getRootNavs()[0].push('NewFollowPage', this.mortgage);
  }

  gotoException() {
    this.app.getRootNavs()[0].push('NewExceptionPage', this.mortgage);
  }



}
