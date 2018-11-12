import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, Events } from 'ionic-angular';
import { ApiService } from '../../provider/api-service';
import { iOSFixedScrollFreeze } from '../../provider/iOSFixedScrollFreeze';
import { Utils } from '../../provider/Utils';

/**
 * Generated class for the ProgressHistoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-progress-history',
  templateUrl: 'progress-history.html',
})
export class ProgressHistoryPage {

  error: any = null;
  data: any = [];

  mortData: any;
  @ViewChild(Content) content: Content;

  constructor(public navCtrl: NavController, 
    private api: ApiService,
    private iosFixed: iOSFixedScrollFreeze,
    private events: Events,
    public navParams: NavParams) {
      this.mortData = this.navParams.data;
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad ProgressHistoryPage');
    this.iosFixed.fixedScrollFreeze(this.content);

    setTimeout(() => {
      this.loadData();
    }, 300);

    this.events.subscribe('state:changed', () => {
      this.loadData();
    });
  }

  loadData() {
    this.api.POST(null, {
      dotype: 'GetData',
      funname: '查询按揭台账跟进记录APP',
      param1: Utils.getQueryString('manid'),
      param2: this.mortData.mid
    })
    .then(data => {
      if (data && data['data']) {
        this.data = data['data'];
        this.error = this.data.length === 0 ? '暂无跟进记录' : null;
      } else {
        this.error = '非法错误';
      }
    })
    .catch(error => {
      this.error = error.message || '服务器出错了';
    })
    // this.data = [
    //   {
    //     followupdesc: '这是跟进内容',
    //     followupdate: '2018-08-21 12:30',
    //     ajstate: '30',
    //     ajstatedesc: '现场受理中'
    //   }
    // ];
  }

  openItem(item,idx) {
    // console.log(item);
    if (idx === 0) {
      item['_type'] = 'edit';
      this.navCtrl.push('NewFollowPage', item);
    } else {
      this.navCtrl.push('FollowDetailPage', item);
    }
    
  }

}
