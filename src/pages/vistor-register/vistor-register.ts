import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the VistorRegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-vistor-register',
  templateUrl: 'vistor-register.html',
})
export class VistorRegisterPage {

  // {"callid":"1",
  //  "custname":"张三",
  //  "followcnt":"1",
  //  "knowway":"NULL",
  //  "sex":"NULL",
  //  "srctypeid":"NULL",
  //  "srctypename":"NULL",
  //  "statedesc":"跟进",
  //  "statenum":"0",
  //  "telephone":"15000000000"}

  person: any = {
    custname: '',
    telephone: '',
  };
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.person = this.navParams.data;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VistorRegisterPage');
  }

}
