import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import { ApiService } from '../../provider/api-service';
import { iOSFixedScrollFreeze } from '../../provider/iOSFixedScrollFreeze';

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

  @ViewChild(Content) content: Content;

  constructor(public navCtrl: NavController, 
    private api: ApiService,
    private iosFixed: iOSFixedScrollFreeze,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad ProgressHistoryPage');
    this.iosFixed.fixedScrollFreeze(this.content);

    setTimeout(() => {
      this.loadData();
    }, 300);
  }

  loadData() {
    this.data = [
      {
        followupdesc: '这是跟进内容',
        followupdate: '2018-08-21 12:30',
        ajstate: '30',
        ajstatedesc: '现场受理中'
      }
    ];
  }

}
