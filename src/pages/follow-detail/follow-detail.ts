import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the FollowDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-follow-detail',
  templateUrl: 'follow-detail.html',
})
export class FollowDetailPage {

  items: any = [];

  exception: any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.exception = this.navParams.data;
    // console.log(this.exception);
    this.prepareData();
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad FollowDetailPage');
  }

  prepareData() {
    let temp = [];

    temp.push({ label: '按揭状态', value: this.exception.ajstate_desc.replace('NULL', '--') });
    temp.push({ label: '开始日期', value: this.exception.followupdate.replace('NULL', '--') });

    if (this.exception.ajstate === '40' || this.exception.ajstate === '90') {
      temp.push({ label: '异常类型', value: this.exception.abnormalname.replace('NULL', '--') });
      temp.push({ label: '异常子类型', value: this.exception.abnormalsubname.replace('NULL', '--') });
      temp.push({ label: '异常开始日期', value: this.exception.abnormaldate.replace('NULL', '--') });
      temp.push({ label: '计划完成日期', value: this.exception.abnormaldodate.replace('NULL', '--') });
      temp.push({ label: '异常说明', value: this.exception.abnormaldesc.replace('NULL', '--') });
    } else {
      temp.push({ label: '备注', value: this.exception.followupdesc.replace('NULL', '--') });
    }

    this.items = temp;
  }

}
