import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';

/**
 * Generated class for the StatListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-stat-list',
  templateUrl: 'stat-list.html',
})
export class StatListPage {

  title: string = '';
  type: string;

  error: any = null;
  data: any = [];
  
  constructor(public navCtrl: NavController, 
    private app: App,
    public navParams: NavParams) {
    this.type = this.navParams.data.type;
  }

  ionViewDidLoad() {
    
  }

  selectItem(item) {
    if (this.type == '6') {
      this.app.getRootNavs()[0].push('ExCustomerReplyPage', item);

    } else {
      this.app.getRootNavs()[0].push('VistorRegisterPage', { person: item });
    }
  }

  callPhone(item) {
    window.location.href = "tel:" + item.telephone;
  }

}
