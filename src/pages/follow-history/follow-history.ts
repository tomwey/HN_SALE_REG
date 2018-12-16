import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import { ApiService } from '../../provider/api-service';
import { Utils } from '../../provider/Utils';
import { iOSFixedScrollFreeze } from '../../provider/iOSFixedScrollFreeze';

/**
 * Generated class for the FollowHistoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-follow-history',
  templateUrl: 'follow-history.html',
})
export class FollowHistoryPage {

  dataList: any = [];
  error: any = null;

  @ViewChild(Content) content: Content;
  constructor(public navCtrl: NavController,
    private api: ApiService,
    private iosFixed: iOSFixedScrollFreeze,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad FollowHistoryPage');
    this.iosFixed.fixedScrollFreeze(this.content);
    this.loadData();
    // {"buypossible":"0","callid":"1","content":"测试一条数据","create_date":"2018-08-21T17:37:10+08:00","create_id":"1960","create_name":"唐伟","followtype":"40","id":"8"}
  }

  loadData() {
    this.api.POST(null, {
      dotype: 'GetData',
      funname: '获取跟进列表APP',
      param1: this.navParams.data.callid,
      param2: Utils.getQueryString('manid')
    })
      .then(data => {
        // console.log(data);
        if (data && data['data']) {
          this.dataList = data['data'];
        }

        if (this.dataList.length > 0) {
          this.error = null;
        } else {
          this.error = '您还未做过跟进~';
        }
      })
      .catch(error => {
        this.error = error.message || '服务器出错了~';
      })
  }

  followTypeName(item) {
    if (item.followtype == '10') {
      return '来电';
    }

    if (item.followtype == '20') {
      return '来访';
    }

    if (item.followtype == '30') {
      return '回访';
    }

    if (item.followtype == '40') {
      return '微信';
    }

    if (item.followtype == '50') {
      return '其他';
    }

    return null;
  }

}
