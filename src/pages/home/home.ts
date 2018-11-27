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

  data: any = [];

  hasDashboard: boolean = false;

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

      // this.store.getProject(data => {
      //   if (data) {
      //     this.currentProject.id = data.value;
      //   this.currentProject.name = data.label;
      //   }
      // });

      this.prepareFunc();
  }

  prepareFunc() {
    const poweridsStr = Utils.getQueryString('powerids');
    let powerids: string[] = null;
    if (poweridsStr) {
      powerids = poweridsStr.split(',');
    }

    console.log(powerids);

    if (powerids) {
      // 是否有统计面板权限
      this.hasDashboard = (powerids.indexOf('18') !== -1);

      // 其它模块权限
      let temp = [];
      powerids.forEach(id => {
        const item = this.modulesData[id];
        if (item) {
          temp.push(item);
        }
      });
      this.data = temp;
    }
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

  ionViewWillEnter() {

    this.store.getProject(data => {
      if (data) {
        this.currentProject.id = data.value;
      this.currentProject.name = data.label;
      }
    });
  }

  back() {
    window.location.href = 'salereg://back';
  }

  forwardTo(item) {
    this.navCtrl.push(item.page);
  }

  openList(type) {
    let params = {};
    this.navCtrl.push('StatListPage', { params: params, type: type});
  }

  // 与后台数据库保持一致的功能权限配置
  modulesData: any = {
    '19': {
      icon: 'icon_registor.png',
      name: '来访登记',
      page: VistorsQueryPage,
      powerid: 19 // 与数据库保持一致
    },
    '20': {
      icon: 'icon_aj.png',
      name: ' 按揭台账',
      page: 'MortgageListPage',
      powerid: 20
    },
    '21': {
      icon: 'icon_house.png',
      name: '房源查询',
      page: HouseQueryPage,
      powerid: 21
    },
    '22': {
      icon: 'icon_customers.png',
      name: '我的客户',
      page: MyCustomerPage,
      powerid: 22
    },
    '23': {
      icon: 'icon_calc.png',
      name: '房贷计算器',
      page: 'CalculatorPage',
      powerid: 23
    },
  };

}
