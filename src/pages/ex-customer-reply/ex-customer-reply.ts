import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import { ApiService } from '../../provider/api-service';
import { Tools } from '../../provider/Tools';
import { Utils } from '../../provider/Utils';
import { iOSFixedScrollFreeze } from '../../provider/iOSFixedScrollFreeze';

/**
 * Generated class for the ExCustomerReplyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ex-customer-reply',
  templateUrl: 'ex-customer-reply.html',
})
export class ExCustomerReplyPage {

  item: any = null;
  @ViewChild(Content) content: Content;

  constructor(public navCtrl: NavController,
    private api: ApiService,
    private tools: Tools,
    private iosFixed: iOSFixedScrollFreeze,
    public navParams: NavParams) {
    this.item = this.navParams.data;

    let sexandname = this.item.sexandname;
    if (sexandname) {
      sexandname = sexandname.split('*')[0];
      sexandname = sexandname.replace('Sex:', '');
    }
    this.item.sex_name = sexandname;

    if (this.item.abnormalsubname === 'NULL') {
      this.item.abnormalsubname = '--';
    }

    if (this.item.followupdesc === 'NULL') {
      this.item.followupdesc = '--';
    }

    // console.log(this.item);
  }

  formatCustphone(item) {
    // custandphone: "Tel:13608022941*Name:董靖"
    let phone = item.custandphone;
    if (!phone || phone === 'NULL') return '--';

    let arr = phone.split('*');
    phone = arr[0];
    phone = phone && phone.replace('Tel:', '');
    return phone;
  }



  ionViewDidLoad() {
    // console.log('ionViewDidLoad ExCustomerReplyPage');
    this.iosFixed.fixedScrollFreeze(this.content);
  }

  save() {
    if (!this.item.replydesc) {
      this.tools.showToast('回复内容不能为空');
      return;
    }

    this.api.POST(null, {
      dotype: 'GetData',
      funname: '按揭异常回复APP',
      param1: Utils.getQueryString('manid'),
      param2: this.item.followupid,
      param3: this.item.replydesc,
    })
      .then(data => {
        this.tools.showToast('回复成功');
      })
      .catch(error => {
        this.tools.showToast(error.message || '服务器出错了');
      });
  }

}
