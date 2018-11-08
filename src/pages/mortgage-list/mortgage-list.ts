import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, App, Content, Events } from 'ionic-angular';
import { ApiService } from '../../provider/api-service';
import { Tools } from '../../provider/Tools';
import { Utils } from '../../provider/Utils';
import { iOSFixedScrollFreeze } from '../../provider/iOSFixedScrollFreeze';
import { AppStore } from '../../provider/app-store';

/**
 * Generated class for the MortgageListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-mortgage-list',
  templateUrl: 'mortgage-list.html',
})
export class MortgageListPage {

  currentProject: any = {
    id: '',
    name: ''
  };

  currentState: any = {
    id: '',
    name: '',
  };

  keyword = '';

  error: any = '';

  dataList: any = [];

  @ViewChild(Content) content: Content;

  constructor(public navCtrl: NavController, 
    private api: ApiService,
    private tools: Tools,
    private app: App,
    private events: Events,
    private store: AppStore,
    private iosFixed: iOSFixedScrollFreeze,
    private modalCtrl: ModalController,
    public navParams: NavParams) {

      this.events.subscribe('state:changed', () => {
        // this.items = [];
        // this.prepareData();
        this.loadData();
      });
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad MortgageListPage');
    this.iosFixed.fixedScrollFreeze(this.content);

    // this.error = '请先选择项目';

    this.store.getProject(data => {
      if (data) {
        // const proj = JSON.parse(data);
        this.currentProject.id = data.value;
        this.currentProject.name = data.label;
      }

      if (!this.currentProject.id) {
        this.error = '请先选择项目';
      }

      this.loadData();
      
    });
  }

  loadMortgageStates(type) {
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
            this.forwardToPage(arr, type);
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

  startSearch(kw) {
    this.loadData();
  }

  openDetail(item) {
    this.app.getRootNavs()[0].push('MortgageDetailPage', item);
  }

  loadData() {
    if (!this.currentProject.id) return;
    this.error = null;

    this.api.POST(null, { "dotype": "GetData", 
                          "funname": "查询按揭台账信息APP",
                          "param1": Utils.getQueryString('manid'),
                          "param2": this.currentProject.id,
                          "param3": "-1",
                          "param4": "-1",
                          "param5": this.keyword,
                          "param6": this.currentState.id || '-1',
                         })
      .then(data => {
        // console.log(data);
        if (data && data['data']) {
          this.dataList = data['data'];
          this.error = this.dataList.length == 0 ? '暂无按揭数据' : null;
        } else {
          this.error = '非法错误!';
        }
      })
      .catch(error => {
        this.error = error.message || '服务器出错了';
      });
  }

  showPanel1(type) {
    if (type == 1) {
      this.loadProjects(1);
    } else if (type == 2) {
      this.loadMortgageStates(2);
    }
  }

  loadProjects(type) {
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
            this.forwardToPage(arr, type);
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

  forwardToPage(arr, type) {
    let temp = [];
    if (type == 2) {
      temp.push('全部|-1');
    }

    arr.forEach(element => {
      if (type == 1) {
        temp.push(`${element.project_name}|${element.project_id}`);
      } else if (type == 2) {
        temp.push(`${element.dic_name}|${element.dic_value}`);
      }
    });
    
    let modal = this.modalCtrl.create('CommSelectPage', { selectedItem: null, 
      title: type == 1 ? '选择项目' : '选择按揭状态', data: temp });
      modal.onDidDismiss((res) => {
        // console.log(res);
        if (!res) return;

        if (type == 1) {
          this.currentProject.name = res.label;
          this.currentProject.id   = res.value;

          this.store.saveProject(res);
          
        } else if (type == 2) {
          this.currentState.name   = res.label;
          this.currentState.id     = res.value;
        }
        
        this.loadData();
      });
    modal.present();
  }

}
