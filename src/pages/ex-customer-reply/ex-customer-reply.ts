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
    this.item.sex_name = this.item.sex == '1' ? '男' : '女';
    console.log(this.item);
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
