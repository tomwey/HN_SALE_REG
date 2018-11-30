import { Component, ViewChild } from '@angular/core';
import { /*IonicPage, */NavController, NavParams, Events, Content } from 'ionic-angular';
import { ApiService } from '../../provider/api-service';
import { Utils } from '../../provider/Utils';
import { Tools } from '../../provider/Tools';
import { iOSFixedScrollFreeze } from '../../provider/iOSFixedScrollFreeze';

/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
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

  loading: boolean = false;

  statData: any = {
    ajexpcount: "0",
    callcount: "0",
    concount: "0",
    contotalmoney: "NULL",
    ordercount: "0",
    ordertotalmoney: "NULL",
    overdueunconcount: "0",
    overdueusercount: "0",
    totalpaymoney: "NULL",
    unpaymoney: "NULL",
  };

  @ViewChild(Content) content: Content;
  constructor(public navCtrl: NavController, 
    private api: ApiService,
    private tools: Tools,
    private iosFixed: iOSFixedScrollFreeze,
    private events: Events,
    public navParams: NavParams) {

      this.prepareFunc();

      this.events.subscribe('project:changed', (projData) => {
        this.changeCurrentProject(projData);
        this.loadStatData(false);
      });
  }

  loadStatData(loading = true) {
    if (!this.hasDashboard) return;

    if (!this.currentProject.id) {
      this.tools.showToast('选择项目查看统计数据');
      return;
    }

    if (this.loading) return;
    
    this.loading = true;

    this.api.POST(null, { 
      dotype: 'GetData',
      funname: '查询销售系统首页信息APP',
      param1: this.currentProject.id,
      param2: Utils.getQueryString('manid')
    }, '正在加载', loading).then(data => {
      // console.log(data);
      if (data && data['data']) {
        let arr = data['data'];
        if (arr.length > 0) {
          this.statData = arr[0];
        }
      }
      this.loading = false;
    }).catch(error => {
      this.loading = false;
    });
  }

  prepareFunc() {
    const poweridsStr = Utils.getQueryString('powerids');
    let powerids: string[] = null;
    if (poweridsStr) {
      powerids = poweridsStr.split(',');
    }

    // console.log(powerids);

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

  onSelectedProject(ev) {
    // console.log(ev);
    this.currentProject = ev;
    this.loadStatData(true);
    
  }

  ionViewDidLoad() {
    this.iosFixed.fixedScrollFreeze(this.content);
  }

  changeCurrentProject(projData) {
    if (projData) {
      this.currentProject.id = projData.value;
      this.currentProject.name = projData.label;
    }
  }

  back() {
    window.location.href = 'salereg://back';
  }

  forwardTo(item) {
    this.navCtrl.push(item.page);
  }

  openList(type,title) {
    // let params = {};
    this.navCtrl.push('StatListPage', { type: type, title: title});
  }

  // 与后台数据库保持一致的功能权限配置
  modulesData: any = {
    '19': {
      icon: 'icon_registor.png',
      name: '来访登记',
      page: 'VistorsQueryPage',
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
      page: 'HouseQueryPage',
      powerid: 21
    },
    '22': {
      icon: 'icon_customers.png',
      name: '我的客户',
      page: 'MyCustomerPage',
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
