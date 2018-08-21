import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { ApiService } from '../../provider/api-service';
import { Utils } from '../../provider/Utils';
import { App } from 'ionic-angular/components/app/app';
import { Tools } from '../../provider/Tools';
import { Storage } from '@ionic/storage';

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
    // proj_id: '1291564',
    mobile: '15000000000',
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
    private storage: Storage,
    private modalCtrl: ModalController,
    public navParams: NavParams) {
      this.storage.get('selected.project').then(data => {
        if (data) {
          this.project = JSON.parse(data);
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
    this.api.POST(null, { "dotype": "GetData", 
                          "funname": "案场获取项目列表APP", 
                          "param1": Utils.getQueryString("manid") })
            .then(data => {
              if (data && data['data']) {
                let arr = data['data'];
                this.showSelectPage(arr);
              }
            })
            .catch(error => {
              this.tools.showToast(error.message || '获取项目失败');
            });

  }

  selectItem(person) {
    this.forwardTo(person);
  }

  showSelectPage(arr) {
    let data = [];
    // console.log(arr);
    arr.forEach(element => {
      // "project_id":"1291428","project_name":"珍宝金楠一期"
      data.push(`${element.project_name}|${element.project_id}`);  
    });
    let selectedItem = null;
    if (this.project.label && this.project.value) {
      selectedItem = `${this.project.label}|${this.project.value}`;
    }
    let modal = this.modalCtrl.create('CommSelectPage', { selectedItem: selectedItem, 
                                                          title: '选择项目', data: data })
    modal.onDidDismiss((data) => {
      if (data) {
        this.storage.set('selected.project', JSON.stringify(data));
        this.project = data;
      }
    });
    modal.present();
  }

  query(type) {
    this.followtype = type;

    this.api.POST(null, {
      dotype: 'GetData',
      funname: '案场查询客户访问记录APP',
      param1: this.project.value,
      param2: this.queryModel.mobile,
      param3: this.queryModel.name,
      param4: Utils.getQueryString('manid')
    })
    .then(data => {
      // console.log(data);
      let arr = data['data'];
      if (arr && arr.length > 0) {
        if (arr.length === 1) {
          this.forwardTo(arr[0]);
        } else {
          this.dataList = arr;
        }
      } else {
        // console.log('2222222');
        this.forwardTo( { custname: this.queryModel.name, 
          telephone: this.queryModel.mobile }, true);
      }
    })
    .catch(error => {
      this.tools.showToast('查询失败，请重试~');
    });
  }

  forwardTo(person, isNew = false) {
    this.app.getRootNavs()[0].push('VistorRegisterPage', { person: person, isNew: isNew ? '1' : '0', followtype: this.followtype, proj_id: this.project.value });
  }

}
