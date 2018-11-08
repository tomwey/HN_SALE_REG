import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, Events } from 'ionic-angular';

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
    private events: Events,
    public navParams: NavParams) {
    this.mortgage = this.navParams.data;
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad MortgageDetailPage');
    this.prepareData();

    this.events.subscribe('state:changed', () => {
      // this.items = [];
      this.prepareData();
    });
  }

  prepareData() {
    let temp = [];

    temp.push({ label: '客户名称', value: this.mortgage.custnames });
    temp.push({ label: '房间号', value: this.mortgage.house_no });
    temp.push({ label: '证件号码', value: this.mortgage.cardnos });
    temp.push({ label: '贷款金额', value: this.mortgage.ajmoney });
    temp.push({ label: '贷款方式', value: this.mortgage.paytypename });
    temp.push({ label: '按揭银行', value: this.mortgage.ajbankname });
    temp.push({ label: '贷款年限', value: this.mortgage.ajyears });
    temp.push({ label: '按揭状态', value: this.mortgage.ajstate_desc });
    temp.push({ label: '回款时间', value: this.mortgage.repaydate.replace('NULL', '--') });
    temp.push({ label: '是否断供', value: parseInt(this.mortgage.isabort) == 0 ? '否' : '是'  });
    temp.push({ label: '异常类型', value: this.mortgage.abnormalname });
    temp.push({ label: '异常说明', value: this.mortgage.frontdesc });
    temp.push({ label: '销售员', value: this.mortgage.sellername });

    this.items = temp;
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
