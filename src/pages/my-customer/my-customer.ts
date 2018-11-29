import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Content, ModalController, Events,IonicPage, App, Searchbar } from 'ionic-angular';
import { ApiService } from '../../provider/api-service';
import { Utils } from '../../provider/Utils';
import { iOSFixedScrollFreeze } from '../../provider/iOSFixedScrollFreeze';
import { Tools } from '../../provider/Tools';
import { AppStore } from '../../provider/app-store';

/**
 * Generated class for the MyCustomerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-my-customer',
  templateUrl: 'my-customer.html',
})
export class MyCustomerPage {
  currentProject: any = {
    id: '',
    name: ''
  };

  showFilterPanel: boolean = false;
  showSearch: boolean = false;

  // showPanel: boolean = false;
  @ViewChild(Content) content: Content;
  @ViewChild('searchBar') searchBar: Searchbar;

  constructor(public navCtrl: NavController, 
    private api: ApiService,
    private app: App,
    private tools: Tools,
    private store: AppStore,
    private events: Events,
    private modalCtrl: ModalController,
    private iosFixed: iOSFixedScrollFreeze,
    public navParams: NavParams) {

      // 加载选中的项目
      this.store.getProject(data => {
        if (data) {
          // const proj = JSON.parse(data);
          this.currentProject.id = data.value;
          this.currentProject.name = data.label;
        }

        if (!this.currentProject.id) {
          this.error = '请先选择项目';
        }
      });

      this.events.subscribe('follow:saved', () => {
        this.loadData(false);
      });
    
  }

  ionViewDidLoad() {
    this.iosFixed.fixedScrollFreeze(this.content);
    
    setTimeout(() => {
      this.loadData();
    }, 300);
    
  }

  selectProject() {
    this.showFilterPanel = false;

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

  cancelClick() {
    this.showSearch = false;
  }

  searchClick() {
    this.showSearch = true;
    setTimeout(() => {
      // console.log(this.searchBar);
      this.searchBar.setFocus();
    }, 150);
    
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

  loadData(loading = true) {
    this.data = [];
    
    this.api.POST(null, { dotype: 'GetData', 
                          funname: '获取我的客户列表APP', 
                          param1: Utils.getQueryString('manid'),
                          param2: this.currentProject.id, 
                          param3: this.menuType,
                          param4: this.keyword
                         }, '正在加载', loading)
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
      let item = element;
      item['type'] = element.followtype == '10' ? '1' : '2';
      item['typename'] = element.followtype == '10' ? '来电' : '来访';
      // item['time'] = time;
      // item['left_days'] = days;
      // item['left_days_label'] = label;

      if (element.invaliddate && element.invaliddate === 'NULL') {
        element.invaliddate = '';
      }

      if (element.plancondate && element.plancondate === 'NULL') {
        element.plancondate = '';
      }

      let time = (element.invaliddate || element.plancondate);
      if (time) {
        time = time.replace('+08:00', '').replace('T', ' ');
      } else {
        time = '--';
      }
      
      item['time'] = time;

      if (time === '--') {
        item['left_days'] = '--';
        item['left_days_label'] = '';
      } else {
        let tempDate = time.split(' ')[0];

        let dateBegin = new Date(tempDate.replace(/-/g, "/"));//将-转化为/，使用new Date
        let dateEnd   = new Date();//获取当前时间
        let dateDiff  = dateBegin.getTime() - dateEnd.getTime() + 24 * 60 * 60 * 1000;//时间差的毫秒数
        // console.log(dateDiff);
        let days      = Math.floor(dateDiff / (24*3600*1000));

        if (days < 0) {
          item['left_days'] = -days;
          item['left_days_label'] = '过期';
        } else if (days === 0) {
          item['left_days'] = 0;
          item['left_days_label'] = '即将过期';
        } else {
          item['left_days'] = days;
          item['left_days_label'] = '还剩';
        }
      }
      
      temp.push(item);

    });
    this.data = temp;
  }

  selectItem(item) {
    if (this.menuType == '6') {
      this.app.getRootNavs()[0].push('ExCustomerReplyPage', item);

    } else {
      this.app.getRootNavs()[0].push('VistorRegisterPage', { person: item });
    }
  }

  doRefresh(ev) {
    this.api.POST(null, { dotype: 'GetData', 
        funname: '获取我的客户列表APP', 
        param1: Utils.getQueryString('manid'),
        param2: this.currentProject.id, 
        param3: this.menuType,
        param4: this.keyword
      }, '正在加载', false)
    .then(data => {
        // console.log(data);
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
        ev.complete();
    })
    .catch(error => {
      this.error = error.message || '服务器出错了~';
      ev.complete();
    })
  }

  callPhone(item) {
    // ev.stopPropagation();
    window.location.href = "tel:" + item.telephone;
    // window.open("tel:" + item.telephone);
  }

  segmentChanged(ev) {
    this.showFilterPanel = false;
    
    if (this.menuType == '6') {
      this.error = null;
      this.loadExCustomers();
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

  closeFilter() {
    this.showFilterPanel = false;
  }

  selectFilter(item) {
    this.showFilterPanel = true;

    this.filterConfigData = this.filterBaseData[item.field];
  }

  filterMenuName(fItem) {
    let obj = this.currentFilterData[this.menuType]
    if (!obj) return fItem.name;

    let obj2 = obj[fItem.field];
    if (!obj2) return fItem.name;
    return obj2.name;
  }

  selectFilterItem(item) {
    this.showFilterPanel = false;
    // console.log(item);
    let obj = this.currentFilterData[this.menuType] || {};

    obj[item.field] = item;
    // console.log(this.currentFilterData);

    this.currentFilterData[this.menuType] = obj;

    // console.log(this.currentFilterData)
  }

  data: any = [];
  error: any = null;
  projects: any = null;

  keyword: string = '';
  menuType: any = '1';

  customTime: any = {
    startDate: '',
    endDate: ''
  };

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
    // {
    //   ID: '6',
    //   name: '异常客户',
    // },
    {
      ID: '4',
      name: '按揭',
    },
    {
      ID: '5',
      name: '回款',
    },
  ];

  currentFilterData: any = {};

  filterData: any = {
    '1': [
      {
        name: '时间',
        field: 'time'
      },
      {
        name: '过期状态',
        field: 'expire_state_1'
      },
      {
        name: '业态',
        field: 'industry'
      }
    ],
    '2': [
      {
        name: '时间',
        field: 'time'
      },
      {
        name: '过期状态',
        field: 'expire_state_2'
      },
      {
        name: '业态',
        field: 'industry'
      }
    ],
    '3': [
      {
        name: '时间',
        field: 'time'
      },
      {
        name: '审核状态',
        field: 'approve_state'
      },
      {
        name: '业态',
        field: 'industry'
      }
    ],
    '4': [
      {
        name: '时间',
        field: 'time'
      },
      {
        name: '客户类型',
        field: 'custom_type'
      },
      {
        name: '按揭状态',
        field: 'aj_state'
      },
      {
        name: '业态',
        field: 'industry'
      }
    ],
    '5': [
      {
        name: '时间',
        field: 'time'
      },
      {
        name: '逾期状态',
        field: 'yq_state'
      },
      {
        name: '付款方式',
        field: 'pay_type'
      },
      {
        name: '款项类型',
        field: 'bill_type'
      },
    ]
  };

  filterBaseData: any = {
    time: [
      {
        name: '全部',
        value: '-1',
        field: 'time'
      },
      {
        name: '本月',
        value: '0',
        field: 'time'
      },
      {
        name: '上月',
        value: '1',
        field: 'time'
      },
      {
        name: '自定义',
        value: '100',
        field: 'time'
      },
    ],
    industry: [
      {
        name: '全部',
        value: '-1',
        field: 'industry'
      },
      {
        name: '住宅',
        value: '1',
        field: 'industry'
      },
      {
        name: '公寓',
        value: '2',
        field: 'industry'
      },
      {
        name: '商业',
        value: '3',
        field: 'industry'
      },
      {
        name: '办公',
        value: '32',
        field: 'industry'
      },
      {
        name: '车位',
        value: '4',
        field: 'industry'
      },
      {
        name: '其他',
        value: '5',
        field: 'industry'
      }
    ],
    expire_state_1: [
      {
        name: '全部',
        value: '-1',
        field: 'expire_state_1'
      },
      {
        name: '3天内过期',
        value: '3',
        field: 'expire_state_1'
      },
      {
        name: '未过期',
        value: '0',
        field: 'expire_state_1'
      }
    ],
    expire_state_2: [
      {
        name: '全部',
        value: '-1',
        field: 'expire_state_2'
      },
      {
        name: '3天内过期',
        value: '3',
        field: 'expire_state_2'
      },
      {
        name: '未过期',
        value: '0',
        field: 'expire_state_2'
      },
      {
        name: '已过期',
        value: '1',
        field: 'expire_state_2'
      }
    ],
    approve_state: [
      {
        name: '全部',
        value: '-1',
        field: 'approve_state'
      },
      {
        name: '未审核',
        value: '0',
        field: 'approve_state'
      },
      {
        name: '已审核',
        value: '1',
        field: 'approve_state'
      },
    ],
    custom_type: [
      {
        name: '全部',
        value: '-1',
        field: 'custom_type'
      },
      {
        name: '异常客户',
        value: '0',
        field: 'custom_type'
      },
    ],
    aj_state: [
      {
        name: '全部',
        value: '-1',
        field: 'aj_state'
      },
      {
        name: '未到银行',
        value: '10',
        field: 'aj_state'
      },
      {
        name: '网上备案中',
        value: '20',
        field: 'aj_state'
      },
      {
        name: '预告预抵',
        value: '30',
        field: 'aj_state'
      },
      {
        name: '转现场全权处理',
        value: '40',
        field: 'aj_state'
      },
      {
        name: '现场处理完成',
        value: '50',
        field: 'aj_state'
      },
      {
        name: '银行受理中',
        value: '60',
        field: 'aj_state'
      },
      {
        name: '待放款',
        value: '70',
        field: 'aj_state'
      },
      {
        name: '修改备案中',
        value: '80',
        field: 'aj_state'
      },
      {
        name: '异常待处理',
        value: '90',
        field: 'aj_state'
      },
      {
        name: '异常退法务处理',
        value: '95',
        field: 'aj_state'
      },
      {
        name: '待撤消备案',
        value: '100',
        field: 'aj_state'
      },
      {
        name: '按揭中断',
        value: '110',
        field: 'aj_state'
      },
      {
        name: '已回款',
        value: '120',
        field: 'aj_state'
      },
    ],
    yq_state: [
      {
        name: '全部',
        value: '-1',
        field: 'yq_state'
      },
      {
        name: '未逾期',
        value: '0',
        field: 'yq_state'
      },
      {
        name: '已逾期',
        value: '1',
        field: 'yq_state'
      },
    ],
    pay_type: [
      {
        name: '全部',
        value: '-1'
      },
    ],
    bill_type: [
      {
        name: '全部',
        value: '-1',
        field: 'bill_type'
      },
      {
        name: '贷款',
        value: '0',
        field: 'bill_type'
      },
      {
        name: '非贷款',
        value: '1',
        field: 'bill_type'
      },
    ],
  };

  filterConfigData: any = [];

}
