import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ApiService } from '../../provider/api-service';
import { Utils } from '../../provider/Utils';
import { App } from 'ionic-angular/components/app/app';
import { Tools } from '../../provider/Tools';

/**
 * Generated class for the VistorsQueryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-vistors-query',
  templateUrl: 'vistors-query.html',
})
export class VistorsQueryPage {

  queryModel: any = {
    proj_id: '1291564',
    mobile: '',
    name: '',
  };
  
  dataList: any = [];

  constructor(public navCtrl: NavController, 
    private api: ApiService,
    private app: App,
    private tools: Tools,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VistorsQueryPage');
  }

  back() {
    window.location.href = 'salereg://back';
  }

  query(type) {
    this.api.POST(null, {
      dotype: 'GetData',
      funname: '案场查询客户访问记录APP',
      param1: this.queryModel.proj_id,
      param2: this.queryModel.mobile,
      param3: this.queryModel.name,
      param4: Utils.getQueryString('manid')
    })
    .then(data => {
      // console.log(data);
      let arr = data['data'];
      if (arr && arr.length > 0) {
        if (arr.length === 1) {
          this.app.getRootNavs()[0].push('VistorRegisterPage', arr[0]);
        } else {
          this.dataList = arr;
        }
      } else {
        console.log('2222222');
        this.app.getRootNavs()[0].push('VistorRegisterPage', { custname: this.queryModel, 
                                                               telephone: this.queryModel.mobile });
      }
    })
    .catch(error => {
      this.tools.showToast('查询失败，请重试~');
    });
  }

}
