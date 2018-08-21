import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiService } from '../../provider/api-service';
import { Utils } from '../../provider/Utils';

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

  constructor(public navCtrl: NavController, 
    private api: ApiService,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad FollowHistoryPage');
    this.loadData();
    // {"buypossible":"0","callid":"1","content":"测试一条数据","create_date":"2018-08-21T17:37:10+08:00","create_id":"1960","create_name":"唐伟","followtype":"40","id":"8"}
  }

  loadData() {
    this.api.POST(null, { dotype: 'GetData', 
                          funname: '获取跟进列表APP ', 
                          param1: this.navParams.data.callid, 
                          param2: Utils.getQueryString('manid') })
            .then(data => {
              console.log(data);
            })
            .catch(error => {

            })
  }

}
