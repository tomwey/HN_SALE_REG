import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, IonicPage } from 'ionic-angular';
import { ApiService } from '../../provider/api-service';
import { Utils } from '../../provider/Utils';
import { App } from 'ionic-angular/components/app/app';
import { Tools } from '../../provider/Tools';
import { AppStore } from '../../provider/app-store';

/**
 * Generated class for the VistorsQueryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-vistors-query',
  templateUrl: 'vistors-query.html',
})
export class VistorsQueryPage {

  queryModel: any = {
    // proj_id: '1291564',
    mobile: '',
    name: '',
  };

  project: any = {
    label: '',
    value: ''
  };

  followtype: any;

  dataList: any = [];

  constructor(public navCtrl: NavController,
    private api: ApiService,
    private app: App,
    private tools: Tools,
    private store: AppStore,
    private modalCtrl: ModalController,
    public navParams: NavParams) {
    this.store.getProject((data) => {
      if (data) {
        this.project = data;
      }
    });
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad VistorsQueryPage');
  }

  back() {
    window.location.href = 'salereg://back';
  }

  selectProject() {
    let modal = this.modalCtrl.create('SelectProjectPage');
    modal.onDidDismiss(data => {
      if (!data) return;

      this.project = data;
      this.store.saveProject(data);
    })
    modal.present();
  }

  selectItem(person) {
    if (person.canedit == '0') {
      this.tools.showToast('该客户你无权限编辑');
      return;
    }
    this.forwardTo(person);
  }

  query(type) {
    if (!this.project.value) {
      this.tools.showToast('必须选择项目');
      return;
    }

    if (!this.queryModel.mobile) {
      this.tools.showToast('手机不能为空');
      return;
    }

    var phoneReg = /^1[3|4|5|6|7|8|9]\d{9}$/;
    if (!phoneReg.test(this.queryModel.mobile)) {
      this.tools.showToast('不正确的手机号');
      return
    }

    // if (!this.queryModel.name) {
    //   this.tools.showToast('姓名不能为空');
    //   return;
    // }

    this.followtype = type;

    this.api.POST(null, {
      dotype: 'GetData',
      funname: '案场查询客户访问记录APP',
      param1: Utils.getQueryString('manid'),
      param2: this.project.value,
      param3: this.queryModel.mobile,
    })
      .then(data => {
        // console.log(data);
        let arr = data['data'];
        if (arr && arr.length > 0) {
          if (arr.length === 1 && arr[0]['canedit'] != '0') { // 可以编辑
            this.dataList = [];
            this.forwardTo(arr[0]);
          } else {
            this.dataList = arr;
          }
        } else {
          // console.log('2222222');
          this.dataList = [];
          this.forwardTo({
            custname: this.queryModel.name,
            telephone: this.queryModel.mobile
          }, true);
        }
      })
      .catch(error => {
        this.tools.showToast('查询失败，请重试~');
      });
  }

  forwardTo(person, isNew = false) {
    this.queryModel.name = '';
    this.queryModel.mobile = '';

    this.app.getRootNavs()[0].push('VistorRegisterPage', { person: person, isNew: isNew ? '1' : '0', followtype: this.followtype, proj_id: this.project.value });
  }

}
