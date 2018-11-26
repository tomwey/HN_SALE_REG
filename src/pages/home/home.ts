import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { VistorsQueryPage } from '../vistors-query/vistors-query';
import { HouseQueryPage } from '../house-query/house-query';
import { MyCustomerPage } from '../my-customer/my-customer';
import { AppStore } from '../../provider/app-store';
import { ApiService } from '../../provider/api-service';
import { Utils } from '../../provider/Utils';
import { Tools } from '../../provider/Tools';

/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  data: any;

  currentProject: any = {
    id: '',
    name: ''
  };

  constructor(public navCtrl: NavController, 
    private store: AppStore,
    private modalCtrl: ModalController,
    private api: ApiService,
    private tools: Tools,
    public navParams: NavParams) {

      this.store.getProject(data => {
        if (data) {
          this.currentProject.id = data.value;
        this.currentProject.name = data.label;
        }
      });

    this.data = [
      {
        icon: 'ios-laifang',
        name: '来访登记',
        page: VistorsQueryPage,
      },
      {
        icon: 'ios-list-box-outline',
        name: ' 按揭台账',
        page: 'MortgageListPage',
      },
      {
        icon: 'ios-house',
        name: '房源查询',
        page: HouseQueryPage,
      },
      {
        icon: 'ios-customer',
        name: '我的客户',
        page: MyCustomerPage,
      },
      {
        icon: 'md-calculator',
        name: '房贷计算器',
        page: 'CalculatorPage',
      },
    ];
  }

  selectProject() {
    this.api.POST(null, { "dotype": "GetData", 
          "funname": "案场获取项目列表APP", 
          "param1": Utils.getQueryString("manid") })
      .then(data => {
        if (data && data['data']) {
          let arr = data['data'];
          // console.log(arr);
          // this.projects = arr;
          if (arr.length == 0) {
            this.tools.showToast('暂无项目数据');
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
        this.tools.showToast(error.message || '获取项目失败');
      });
  }

  forwardToPage(arr) {
    let temp = [];

    arr.forEach(element => {
      temp.push(`${element.project_name}|${element.project_id}`);
    });
    
    let modal = this.modalCtrl.create('CommSelectPage', { selectedItem: null, 
      title: '选择项目', data: temp });
      modal.onDidDismiss((res) => {
        // console.log(res);
        if (!res) return;

        this.currentProject.name = res.label;
        this.currentProject.id   = res.value;

        this.store.saveProject(res);

        // this.loadData();
      });
    modal.present();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }

  back() {
    window.location.href = 'salereg://back';
  }

  forwardTo(item) {
    this.navCtrl.push(item.page);
  }

}
