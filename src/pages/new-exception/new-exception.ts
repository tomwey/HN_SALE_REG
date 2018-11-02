import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { ApiService } from '../../provider/api-service';
import { Tools } from '../../provider/Tools';
import { Utils } from '../../provider/Utils';

/**
 * Generated class for the NewExceptionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-new-exception',
  templateUrl: 'new-exception.html',
})
export class NewExceptionPage {

  item: any = {
    type_name: '',
    type_id: '',
    start_date: '',
    done_date: '',
    memo: ''
  };

  mortgageData: any;
  constructor(public navCtrl: NavController, 
    private api: ApiService,
    private tools: Tools,
    private modalCtrl: ModalController,
    public navParams: NavParams) {
      this.mortgageData = this.navParams.data;
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad NewExceptionPage');
  }

  selectExType() {
    this.api.POST(null, { "dotype": "GetData",
                          "funname": "通用获取数据字典数据APP",
                          "param1": "471"
                          })
      .then(data => {
        if (data && data['data']) {
          let arr = data['data'];

          // console.log(arr);
          // this.projects = arr;
          if (arr.length == 0) {
            this.tools.showToast('暂无异常数据');
          } else {
            this.forwardToPage(arr);
          }
          // this.showSelectPage(arr);
          // this.loadIndustries(this.projects[0]);
        } else {
          this.tools.showToast('非法错误!');
        }
      })
      .catch(error => {
        this.tools.showToast(error.message || '获取按揭状态失败');
      });
  }

  forwardToPage(arr) {
    let temp = [];
    arr.forEach(element => {
      temp.push(`${element.dic_name}|${element.dic_value}`);
    });
    
    let modal = this.modalCtrl.create('CommSelectPage', { selectedItem: null, 
      title: '选择异常类型', data: temp });
      modal.onDidDismiss((res) => {
        // console.log(res);
        if (!res) return;

        this.item.type_name = res.label;
        this.item.type_id   = res.value;
      });
    modal.present();
  }

  commit() {
    if (!this.item.type_id) {
      this.tools.showToast('异常类型不能为空');
      return;
    }

    if (!this.item.start_date) {
      this.tools.showToast('异常开始日期不能为空');
      return;
    }

    if (!this.item.done_date) {
      this.tools.showToast('计划完成日期不能为空');
      return;
    }

    if (!this.item.memo) {
      this.tools.showToast('异常说明不能为空');
      return;
    }

    this.api.POST(null, {
      dotype: 'GetData',
      funname: '新增按揭台账跟进或异常记录APP',
      param1: Utils.getQueryString('manid'),
      param2: this.mortgageData.id || '0',
      param3: '',
      param4: '',
      param5: '',
      param6: this.item.type_id,
      param7: this.item.type_name,
      param8: this.item.start_date,
      param9: this.item.done_date,
      param10: this.item.memo,
    })
    .then(data => {
      this.tools.showToast('提交成功!');

      this.navCtrl.pop();
    })
    .catch(error => {
      this.tools.showToast(error.message || '服务器出错了');
    });
  }

}
