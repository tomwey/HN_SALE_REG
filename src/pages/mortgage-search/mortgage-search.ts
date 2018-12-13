import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { ApiService } from '../../provider/api-service';
import { Tools } from '../../provider/Tools';

/**
 * Generated class for the MortgageSearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-mortgage-search',
  templateUrl: 'mortgage-search.html',
})
export class MortgageSearchPage {

  project: any = {
    id: '',
    name: ''
  };
  bank: any = '';
  state: any = {
    id: '',
    name: ''
  }
  keyword: any = '';

  selectedItems: any = [];
  isCheckAll: boolean = false;

  constructor(public navCtrl: NavController,
    private modalCtrl: ModalController,
    private api: ApiService,
    private tools: Tools,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad MortgageSearchPage');
  }

  selectProject() {
    let modal = this.modalCtrl.create('SelectProjectPage', { onlyShowL1Projects: true });
    modal.onDidDismiss(data => {
      if (!data) return;

      this.project.name = data.label;
      this.project.id = data.value;
    })
    modal.present();
  }

  selectState() {
    this.loadMortgageStates();
  }

  loadMortgageStates() {
    this.api.POST(null, {
      "dotype": "GetData",
      "funname": "通用获取数据字典数据APP",
      "param1": "469"
    })
      .then(data => {
        if (data && data['data']) {
          let arr = data['data'];
          if (arr.length == 0) {
            this.tools.showToast('暂无按揭状态数据');
          } else {
            this.forwardToPage(arr);
          }
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
      let item = { label: element.dic_name, value: element.dic_value };
      // console.log(this.selectedItems);
      this.selectedItems.forEach(ele => {
        if (ele.label === item.label) {
          // console.log('checked');
          item['checked'] = true;
        }
      });
      if (this.isCheckAll) {
        item['checked'] = true;
      }
      temp.push(item);
    });

    // console.log(temp);
    let modal = this.modalCtrl.create('CommMultipleSelectPage', {
      selectedItems: this.selectedItems,
      title: '选择按揭状态', data: temp, checkAll: this.isCheckAll
    });
    modal.onDidDismiss((res) => {
      if (!res) return;

      this.selectedItems = res.selectedItems;
      this.isCheckAll = res.checkAll;

      // console.info(this.isCheckAll, this.selectedItems);
    });
    modal.present();
  }

  removeMe(ev: Event, item) {
    ev.stopPropagation();

    const index = this.selectedItems.indexOf(item);
    if (index !== -1) {
      this.selectedItems.splice(index, 1);
    }
  }

  search() {
    if (!this.keyword && !this.project.id && !this.bank) {
      this.tools.showToast('所属项目、关键字、银行三者至少一个必填');
      return;
    }

    // console.info(this.keyword, this.selectedItems, this.isCheckAll, this.bank, this.project);
    this.navCtrl.push('MortgageListPage', { project: this.project, keyword: this.keyword, bank: this.bank, states: this.selectedItems })
  }

}
