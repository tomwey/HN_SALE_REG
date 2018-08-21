import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { ApiService } from '../../provider/api-service';
import { Tools } from '../../provider/Tools';
import { Utils } from '../../provider/Utils';
import { ResolvedReflectiveProvider_ } from '@angular/core/src/di/reflective_provider';

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
    knowway: '',
    sex: '',
    srctypename: '',
  };
  followtype: any;
  constructor(public navCtrl: NavController, 
    private api: ApiService,
    private tools: Tools,
    private modalCtrl: ModalController,
    public navParams: NavParams) {
    this.person = this.navParams.data.person;
    this.person.followtype = this.navParams.data.followtype == 1 ? '来电' : '来访';

    for (const key in this.person) {
      if (this.person.hasOwnProperty(key)) {
        if (this.person[key] == 'NULL') {
          this.person[key] = '';
        }
      }
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VistorRegisterPage');
  }

  selectPersonSource() {
    this.api.POST(null, { "dotype": "GetData", 
        "funname": "通用获取数据字典数据APP", 
        "param1": '415' })
    .then(data => {
      console.log(data);
      if (data && data['data']) {
        let arr = data['data'];
        this.showSelectPage(arr);
      }
    })
    .catch(error => {
      this.tools.showToast(error.message || '获取项目失败');
    });
  }

  showSelectPage(arr) {
    let data = [];
    // console.log(arr);
    arr.forEach(element => {
      // "project_id":"1291428","project_name":"珍宝金楠一期"
      data.push(`${element.dic_name}|${element.dic_value}`);  
    });
    let selectedItem = null;
    if (this.person.srctypename && this.person.srctypeid) {
      selectedItem = `${this.person.srctypename}|${this.person.srctypeid}`;
    }
    let modal = this.modalCtrl.create('CommSelectPage', { selectedItem: selectedItem, 
                                                          title: '选择来源', data: data })
    modal.onDidDismiss((res) => {
      if (res) {
        // this.storage.set('selected.project', JSON.stringify(data));
        this.person.srctypename = res.label;
        this.person.srctypeid   = res.value;
      }
    });
    modal.present();
  }

}
