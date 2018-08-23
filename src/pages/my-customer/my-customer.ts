import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Content } from 'ionic-angular';
import { ApiService } from '../../provider/api-service';
import { Utils } from '../../provider/Utils';
import { App } from 'ionic-angular/components/app/app';

/**
 * Generated class for the MyCustomerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
@Component({
  selector: 'page-my-customer',
  templateUrl: 'my-customer.html',
})
export class MyCustomerPage {
  currentProject: any = {
    id: '',
    name: ''
  };
  showPanel: boolean = false;
  @ViewChild(Content) content: Content;
  constructor(public navCtrl: NavController, 
    private api: ApiService,
    private app: App,
    public navParams: NavParams) {
    if (!this.currentProject.id) {
      this.error = '请先选择项目';
    }
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad MyCustomerPage');
    // this.error = '暂无数据';
    this.loadProjects();
  }

  showPanel1() {
    this.showPanel = true;
    this.content.resize();
  }

  selectProject(proj, ev:Event) {
    ev.stopPropagation();
    this.currentProject.id = proj.project_id;
    this.currentProject.name = proj.project_name;

    this.showPanel = false;
    this.content.resize();

    this.loadData();
  }

  loadData() {
    this.api.POST(null, { dotype: 'GetData', funname: '获取我的客户列表APP', param1: Utils.getQueryString('manid'),
    param2: this.currentProject.id, param3: this.menuType })
      .then(data => {
        console.log(data);
        if (data && data['data']) {
          let arr = data['data'];
          this.prepareData(arr);
          if (arr.length > 0) {
            this.error = null;
          } else {
            this.error = '暂无数据';
          }
        } else {
          this.error = "未知错误";
        }
      })
      .catch(error => {
        this.error = error.message || '服务器出错了~';
      })
  }

  prepareData(arr) {
    // mobile: '18048553687',
    // name: '张先生',
    // sex: '1',
    // type: '1',
    // typename: '来电',
    // content: '询问了价格方面的情况',
    // time: '2018-07-28',
    // left_days: 1
    let temp = [];
    arr.forEach(element => {
      let time = element.create_date.replace('+08:00', '').replace('T', ' ');
      let days = Utils.dateDiff(time).days;
      let label = '还剩';
      if (days < 0) {
        days = - days;
        label = '过期';
      }
      
      let item = element;
      item['type'] = element.followtype == '10' ? '1' : '2';
      item['typename'] = element.followtype == '10' ? '来电' : '来访';
      item['time'] = time;
      item['left_days'] = days;
      item['left_days_label'] = label;
      
      temp.push(item);

    });
    this.data = temp;
  }

  loadProjects() {
    this.api.POST(null, { "dotype": "GetData", 
          "funname": "案场获取项目列表APP", 
          "param1": Utils.getQueryString("manid") })
      .then(data => {
        if (data && data['data']) {
          let arr = data['data'];
          // console.log(arr);
          this.projects = arr;
          // this.showSelectPage(arr);
          // this.loadIndustries(this.projects[0]);
        }
      })
      .catch(error => {
        // this.tools.showToast(error.message || '获取项目失败');
      });
  }

  selectItem(item) {
    this.app.getRootNavs()[0].push('VistorRegisterPage', { person: item });
  }

  callPhone(item,ev:Event) {
    ev.stopPropagation();

  }

  segmentChanged(ev) {
    if (!this.currentProject.id) {
      this.error = '请先选择项目';
      return;
    }

    this.data = [];
    this.loadData();
  }

  startSearch(kw) {

  }

  openItem(item) {
    
  }

  data: any = [
    /*{
      mobile: '18048553687',
      name: '张先生',
      sex: '1',
      type: '1',
      typename: '来电',
      content: '询问了价格方面的情况',
      time: '2018-07-28',
      left_days: 1,
    },
    {
      mobile: '13312345678',
      name: '王女士',
      sex: '2',
      type: '2',
      typename: '来访',
      content: '初次了解',
      time: '2018-07-25',
      left_days: 3,
    },*/
  ];
  error: any = null;
  projects: any = null;

  keyword: string = '';
  menuType: any = '1';

  menues: any = [
    {
      ID: '1',
      name: '来访',
    },
    {
      ID: '2',
      name: '认购',
    },
    {
      ID: '3',
      name: '签约',
    },
    {
      ID: '4',
      name: '按揭',
    },
    {
      ID: '5',
      name: '回款',
    },
  ];

}
