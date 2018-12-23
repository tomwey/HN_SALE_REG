import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController, Content } from 'ionic-angular';
import { ApiService } from '../../provider/api-service';
import { Utils } from '../../provider/Utils';
// import { Tools } from '../../provider/Tools';
import { AppStore } from '../../provider/app-store';
import { iOSFixedScrollFreeze } from '../../provider/iOSFixedScrollFreeze';
// import { Tools } from '../../provider/Tools';

/**
 * Generated class for the SearchSelectPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-search-select',
  templateUrl: 'search-select.html',
})
export class SearchSelectPage {

  keyword: any = '';
  placeholder: any = '搜索';

  source: any;

  data: any = [];
  error: any = null;

  proj_id: any;

  currentProject: any = {
    id: '',
    name: ''
  };

  @ViewChild(Content) content: Content;

  constructor(public navCtrl: NavController,
    private viewCtrl: ViewController,
    private api: ApiService,
    private modalCtrl: ModalController,
    // private tools: Tools,
    private iosFixed: iOSFixedScrollFreeze,
    private store: AppStore,
    public navParams: NavParams) {
    this.source = this.navParams.data.source;
    this.proj_id = this.navParams.data.proj_id;

    if (this.source.field == 'old_person') {
      this.placeholder = '输入老业主姓名搜索';
    } else if (this.source.field == 'employer') {
      this.placeholder = '输入员工姓名搜索';
    } else if (this.source.field == 'company') {
      this.placeholder = '输入转介公司名字搜索';
    }

    this.error = this.placeholder;

    // 加载选中的项目
    this.store.getProject(data => {
      if (data) {
        // const proj = JSON.parse(data);
        this.currentProject.id = data.value;
        this.currentProject.name = data.label;
      }
    });

    // hack history back
    // var foo = { ss1: true };
    // history.pushState(foo, "search", " ");
  }

  ionViewDidLoad() {
    this.iosFixed.fixedScrollFreeze(this.content);
    // console.log('ionViewDidLoad SearchSelectPage');
    this.startSearch('');
  }

  startSearch(kw) {
    if (this.source.field != 'company' && kw.trim() == '') return;
    // 获取转介公司APP
    let params = null;

    if (this.source.field == 'employer') {
      params = { dotype: "selman", manname: kw.trim() };
    } else if (this.source.field == 'old_person') {
      params = {
        dotype: "GetData",
        funname: '获取老客户APP',
        param1: kw.trim(),
        param2: this.currentProject.id,
        param3: Utils.getQueryString('manid')
      };
    } else if (this.source.field == 'company') {
      params = {
        dotype: "GetData",
        funname: '获取转介公司APP',
        param1: kw.trim(),
        param2: /*Utils.getQueryString('manid')*/this.proj_id
      };
    }

    this.api.POST(null, params)
      .then(data => {
        // console.log(data);
        if (data && data['data']) {
          this.data = data['data'];
          if (this.data.length > 0) {
            this.error = null;
          } else {
            this.error = `未搜索到与“${kw}”相关的结果`;
          }
        } else {
          this.error = '获取数据异常';
        }
      })
      .catch(error => {
        this.error = error.message || "服务器出错了~";
      });
  }

  close() {
    this.viewCtrl.dismiss().catch();
  }

  selectProject() {
    let modal = this.modalCtrl.create('SelectProjectPage');
    modal.onDidDismiss(data => {
      if (!data) return;

      this.currentProject.name = data.label;
      this.currentProject.id = data.value;

      this.startSearch(this.keyword);

    })
    modal.present();

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

  //     // this.store.saveProject(res);

  //     this.startSearch(this.keyword);

  //     // this.loadData();
  //   });
  //   modal.present();
  // }

  selectItem(item) {
    if (this.source.field == 'employer') {
      this.viewCtrl.dismiss({
        label: item.man_name,
        value: item.man_id
      })
    } else if (this.source.field == 'old_person') {
      // return item.name;
      this.viewCtrl.dismiss({
        label: item.custname,
        value: item.conid
      })
    } else if (this.source.field == 'company') {
      // return item.name;
      this.viewCtrl.dismiss({
        label: item.comname,
        value: item.comid
      })
    }
  }

  fetchTitle(item) {
    if (this.source.field == 'employer') {
      return item.man_name;
    } else if (this.source.field == 'old_person') {
      return `${item.project_name} ${item.house_no}`;
    } else if (this.source.field == 'company') {
      return item.comname;
    }

    return '';
  }

  fetchSubtitle(item) {
    if (this.source.field == 'employer') {
      return item.station_name;
    } else if (this.source.field == 'old_person') {
      return item.custname;
    } else if (this.source.field == 'company') {
      return item.areaname;
    }

    return '';
  }

}
