import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { ApiService } from '../../provider/api-service';
import { Utils } from '../../provider/Utils';
import { Tools } from '../../provider/Tools';

/**
 * Generated class for the NewFollowPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-new-follow',
  templateUrl: 'new-follow.html',
})
export class NewFollowPage {

  // states: any = [];
  item: any = {
    state_name: '',
    state_id:   '',
    start_date: Utils.dateFormat(new Date()),
    memo: ''
  };
  
  constructor(public navCtrl: NavController, 
    private api: ApiService,
    private tools: Tools,
    private modalCtrl: ModalController,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad NewFollowPage');
  }

  loadMortgageStates() {
    this.api.POST(null, { "dotype": "GetData",
                          "funname": "通用获取数据字典数据APP",
                          "param1": "469"
                          })
      .then(data => {
        if (data && data['data']) {
          let arr = data['data'];

          // console.log(arr);
          // this.projects = arr;
          if (arr.length == 0) {
            this.tools.showToast('暂无按揭状态数据');
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

  selectState() {
    this.loadMortgageStates();
  }

  forwardToPage(arr) {
    let temp = [];
    arr.forEach(element => {
      temp.push(`${element.dic_name}|${element.dic_value}`);
    });
    
    let modal = this.modalCtrl.create('CommSelectPage', { selectedItem: null, 
      title: '选择按揭状态', data: temp });
      modal.onDidDismiss((res) => {
        // console.log(res);
        if (!res) return;

        this.item.state_name = res.label;
        this.item.state_id   = res.value;
      });
    modal.present();
  }

  commit() {

  }

}
