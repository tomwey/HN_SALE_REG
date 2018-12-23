import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, App, ModalController, Content } from 'ionic-angular';
import { ApiService } from '../../provider/api-service';
import { AppStore } from '../../provider/app-store';
import { Utils } from '../../provider/Utils';
// import { Tools } from '../../provider/Tools';
import { iOSFixedScrollFreeze } from '../../provider/iOSFixedScrollFreeze';

/**
 * Generated class for the StatListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-stat-list',
  templateUrl: 'stat-list.html',
})
export class StatListPage {

  title: string = '';
  type: string;

  error: any = null;
  data: any = [];

  currentProject: any = {
    id: '',
    name: ''
  };

  @ViewChild(Content) content: Content;

  constructor(public navCtrl: NavController,
    private app: App,
    private api: ApiService,
    private store: AppStore,
    // private tools: Tools,
    private iosFixed: iOSFixedScrollFreeze,
    private modalCtrl: ModalController,
    public navParams: NavParams) {
    this.type = this.navParams.data.type;
    this.title = this.navParams.data.title;

    this.store.getProject(data => {
      if (data) {
        this.currentProject.id = data.value;
        this.currentProject.name = data.label;
      }
    });
  }

  ionViewDidLoad() {
    this.iosFixed.fixedScrollFreeze(this.content);

    setTimeout(() => {
      this.loadData();
    }, 300);
  }

  selectProject() {
    // this.api.POST(null, {
    //   "dotype": "GetData",
    //   "funname": "案场获取项目列表APP",
    //   "param1": Utils.getQueryString("manid")
    // })
    //   .then(data => {
    //     if (data && data['data']) {
    //       let arr = data['data'];
    //       // console.log(arr);
    //       // this.projects = arr;
    //       if (arr.length == 0) {
    //         this.tools.showToast('暂无项目数据');
    //       } else {
    //         this.forwardToPage(arr);
    //       }
    //       // this.showSelectPage(arr);
    //       // this.loadIndustries(this.projects[0]);
    //     } else {
    //       this.tools.showToast('非法错误!');
    //     }
    //   })
    //   .catch(error => {
    //     this.tools.showToast(error.message || '获取项目失败');
    //   });

    let modal = this.modalCtrl.create('SelectProjectPage');
    modal.onDidDismiss(data => {
      if (!data) return;

      this.store.saveProject(data);

      this.currentProject.name = data.label;
      this.currentProject.id = data.value;

      this.loadData();
    })
    modal.present();

  }

  // forwardToPage(arr) {
  //   let temp = [];

  //   arr.forEach(element => {
  //     temp.push(`${element.project_name}|${element.project_id}`);
  //   });

  //   let modal = this.modalCtrl.create('CommSelectPage', {
  //     selectedItem: null,
  //     title: '选择项目', data: temp
  //   });
  //   modal.onDidDismiss((res) => {
  //     // console.log(res);
  //     if (!res) return;

  //     this.currentProject.name = res.label;
  //     this.currentProject.id = res.value;

  //     this.store.saveProject(res);

  //     this.loadData();

  //     // this.loadData();
  //   });
  //   modal.present();
  // }

  loadData() {
    // this.error = null;
    // this.data = [];

    this.api.POST(null, {
      dotype: 'GetData',
      funname: '获取销售系统过期数据详情APP',
      param1: this.currentProject.id,
      param2: Utils.getQueryString('manid'),
      param3: this.type,
      // param4: ''
    })
      .then(data => {
        if (data && data['data']) {
          let arr = data['data'];
          this.error = arr.length === 0 ? '暂无数据' : null;
          // if (arr.length > 0) {
          this.prepareData(arr);
          // }
        } else {
          this.error = '非法错误';
        }
      })
      .catch(error => {
        this.error = error.message || '服务器出错了~';
      });
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
        let dateEnd = new Date();//获取当前时间
        let dateDiff = dateBegin.getTime() - dateEnd.getTime() + 24 * 60 * 60 * 1000;//时间差的毫秒数
        // console.log(dateDiff);
        let days = Math.floor(dateDiff / (24 * 3600 * 1000));

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
    // console.log(item);
    if (this.type == '4') {
      this.app.getRootNavs()[0].push('ExCustomerReplyPage', item);
    } else {
      this.app.getRootNavs()[0].push('VistorRegisterPage', { person: item });
    }
  }

  selectItem2(item) {
    // console.log(item);
    this.app.getRootNavs()[0].push('PaymoneyListPage', item);
  }

}
