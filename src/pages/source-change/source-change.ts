import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { ApiService } from '../../provider/api-service';
import { Tools } from '../../provider/Tools';
import { Utils } from '../../provider/Utils';

/**
 * Generated class for the SourceChangePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-source-change',
  templateUrl: 'source-change.html',
})
export class SourceChangePage {

  person: any;
  source: any;
  newSource?: any;
  proj_id: any;
  constructor(public navCtrl: NavController,
    private api: ApiService,
    private tools: Tools,
    private modalCtrl: ModalController,
    public navParams: NavParams) {
    this.person = JSON.parse(JSON.stringify(this.navParams.data.person));
    this.source = this.navParams.data.source;
    this.proj_id = this.navParams.data.proj_id;
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad SourceChangePage');
  }

  selectPersonSource() {

    this.api.POST(null, {
      "dotype": "GetData",
      "funname": "通用获取数据字典数据APP",
      "param1": '415'
    })
      .then(data => {
        // console.log(data);
        if (data && data['data']) {
          let arr = data['data'];
          this.showSelectPage(arr, '选择客户来源', 1);
        }
      })
      .catch(error => {
        this.tools.showToast(error.message || '获取数据失败');
      });
  }

  showSelectPage(arr, title, type) {
    let data = [];
    // console.log(arr);
    arr.forEach(element => {
      // "project_id":"1291428","project_name":"珍宝金楠一期"
      data.push(`${element.dic_name}|${element.dic_value}`);
    });
    let selectedItem = null;
    // if (this.person.srctypename && this.person.srctypeid) {
    //   selectedItem = `${this.person.srctypename}|${this.person.srctypeid}`;
    // }
    let modal = this.modalCtrl.create('CommSelectPage', {
      selectedItem: selectedItem,
      title: title, data: data
    })
    modal.onDidDismiss((res) => {
      if (res) {
        // this.storage.set('selected.project', JSON.stringify(data));
        if (type == 1) { // 客户来源
          this.person.srctypename2 = res.label;
          this.person.srctypeid2 = res.value;

          if (res.value == '1') {
            this.newSource = { descname: '老业主', field: 'old_person' };
          } else if (res.value == '3') {
            this.newSource = { descname: '转介公司', field: 'company' };
          } else if (res.value == '5') {
            this.newSource = { descname: '公司员工', field: 'employer' };
          } else if (res.value == '6') {
            this.newSource = { descname: '公司员工', field: 'employer' };
          } else {
            this.newSource = null;
          }
        }
      }
    });
    modal.present();
  }

  selectSourceDetail() {
    let modal = this.modalCtrl.create('SearchSelectPage', { source: this.newSource, proj_id: this.proj_id });
    modal.onDidDismiss((data) => {
      if (data) {
        this.newSource.label = data.label;
        this.newSource.value = data.value;
      }
    });
    modal.present();
  }

  commit() {
    // console.log(this.person);
    // console.log(this.newSource);
    if (!this.person.srctypeid2) {
      this.tools.showToast('来源类型不能为空');
      return;
    }

    if (this.newSource && !this.newSource.value) {
      this.tools.showToast(`${this.newSource.descname}不能为空`);
      return;
    }

    if (this.person.srctypeid == this.person.srctypeid2 &&
      this.person.srcid == this.newSource.value) {
      this.tools.showToast(`变更后的${this.newSource.descname}与变更前一样`);
      return;
    }

    this.sendFlow();
  }

  sendFlow() {
    let srcID = null;
    let srcName = null;
    if (this.newSource) {
      srcID = this.newSource.value;
      srcName = this.newSource.label;
    }

    this.api.POST(null, {
      dotype: 'GetData',
      funname: '客户来源类型变更APP',
      param1: '1',
      param2: this.person.callid,
      param3: Utils.getQueryString('manid'),
      param4: this.person.srctypeid2 || '-1',
      param5: srcID,
      param6: srcName,
      param7: this.person.srcmemo2,
      param8: this.person.changereason
    })
      .then(data => {
        if (data && data['data']) {
          let arr = data['data'];
          if (arr.length == 0) {
            this.tools.showToast('未知错误');
          } else {
            let item = arr[0];
            if (item.code == '0') {
              this.tools.showToast('发起变更流程成功');
              this.navCtrl.pop();
            } else {
              this.tools.showToast(item.errmsg);
            }
          }
        } else {
          this.tools.showToast('未知错误');
        }
      })
      .catch(error => {
        // console.log(error);
        this.tools.showToast(error.message || '服务器出错了');
      });
  }

}
