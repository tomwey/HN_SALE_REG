import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Content, ModalController } from 'ionic-angular';
import { ApiService } from '../../provider/api-service';
import { Utils } from '../../provider/Utils';
import { App } from 'ionic-angular/components/app/app';
import { iOSFixedScrollFreeze } from '../../provider/iOSFixedScrollFreeze';
import { Tools } from '../../provider/Tools';

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
    private tools: Tools,
    private modalCtrl: ModalController,
    private iosFixed: iOSFixedScrollFreeze,
    public navParams: NavParams) {
    if (!this.currentProject.id) {
      this.error = '请先选择项目';
    }
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad MyCustomerPage');
    // this.error = '暂无数据';
    this.iosFixed.fixedScrollFreeze(this.content);
    
    this.loadProjects();
  }

  showPanel1() {
    this.showPanel = true;
    this.content.resize();
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

        this.loadData();
      });
    modal.present();
  }

  // selectProject(proj, ev:Event) {
  //   ev.stopPropagation();
  //   this.currentProject.id = proj.project_id;
  //   this.currentProject.name = proj.project_name;

  //   this.showPanel = false;
  //   this.content.resize();

  //   this.loadData();
  // }

  loadData() {
    this.data = [];
    this.api.POST(null, { dotype: 'GetData', 
                          funname: '获取我的客户列表APP', 
                          param1: Utils.getQueryString('manid'),
                          param2: this.currentProject.id, 
                          param3: this.menuType,
                          param4: this.keyword
                         })
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

  loadExCustomers() {
    this.data = [];

    this.api.POST(null, { dotype: 'GetData', 
                          funname: '查询我的异常客户APP', 
                          param1: Utils.getQueryString('manid'),
                          param2: '', 
                          param3: '',
                          param4: this.keyword
                         })
      .then(data => {
        // console.log(data);
        if (data && data['data']) {
          this.data = data['data'];
          // this.prepareData(arr);
          // this.data = data;

          // if (arr.length > 0) {
          //   this.error = null;
          // } else {
          //   this.error = '暂无数据';
          // }
          this.error = this.data.length === 0 ? '暂无数据' : null;

          console.log(this.data);
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
      let time = (element.invaliddate || element.plancondate).replace('+08:00', '').replace('T', ' ');
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

  formatMoney(money) {
    money = parseFloat(money) / 10000.0;
    return money.toFixed(2).toString();
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
    if (this.menuType == '6') {
      this.app.getRootNavs()[0].push('ExCustomerReplyPage', item);

    } else {
      this.app.getRootNavs()[0].push('VistorRegisterPage', { person: item });
    }
  }

  callPhone(item,ev:Event) {
    ev.stopPropagation();
    window.location.href = "tel:" + item.telephone;
    // window.open("tel:" + item.telephone);
  }

  segmentChanged(ev) {
    if (this.menuType == '4' || 
        this.menuType == '5' 
        ) {
          this.error = '即将上线...';
          return;
        }
    
    if (this.menuType == '6') {
      this.error = null;
      this.loadExCustomers();
      // this.data = [
      //   {
      //     telephone: '13012345678',
      //     custname: '张三',
      //     sex: '1',
      //     house_no: '1-2-3-4',
      //     is_reply: '0',
      //     followupdesc: '',
      //     abnormalsubname: '补充户口资料',
      //     replydesc: ''
      //   },
      //   {
      //     telephone: '13012345678',
      //     custname: '张三',
      //     sex: '1',
      //     house_no: '1-2-3-4',
      //     is_reply: '0',
      //     followupdesc: '',
      //     abnormalsubname: '补充户口资料',
      //     replydesc: ''
      //   },
      //   {
      //     telephone: '13012345678',
      //     custname: '张三',
      //     sex: '1',
      //     house_no: '1-2-3-4',
      //     is_reply: '0',
      //     followupdesc: '',
      //     abnormalsubname: '补充户口资料',
      //     replydesc: ''
      //   }
      // ];
      return;
    }

    if (!this.currentProject.id) {
      this.error = '请先选择项目';
      return;
    }

    this.data = [];
    this.error = null;

    this.loadData();
  }

  startSearch(kw) {
    if (this.menuType == '6') {
      this.loadExCustomers();
    } else {
      this.loadData();
    }
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
      name: '来电来访',
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
      ID: '6',
      name: '异常',
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
