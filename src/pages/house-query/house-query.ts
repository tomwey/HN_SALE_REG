import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, App, ModalController, Content,IonicPage } from 'ionic-angular';
import { ApiService } from '../../provider/api-service';
import { Utils } from '../../provider/Utils';
import { AppStore } from '../../provider/app-store';
import { Tools } from '../../provider/Tools';
import { iOSFixedScrollFreeze } from '../../provider/iOSFixedScrollFreeze';

/**
 * Generated class for the HouseQueryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-house-query',
  templateUrl: 'house-query.html',
})
export class HouseQueryPage {

  showPanel: boolean = false;
  projects: any = [];

  error2: any = null;
  
  industries: any = [];

  keyword: any = '';

  currentProject: any = {
    id: '',
    name: ''
  };

  industryID: any;

  @ViewChild(Content) content: Content;

  constructor(public navCtrl: NavController, 
    private app: App,
    private store: AppStore,
    private tools: Tools,
    private iosFixed: iOSFixedScrollFreeze,
    private modalCtrl: ModalController,
    private api: ApiService,
    public navParams: NavParams) {

  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad HouseQueryPage');
    // this.loadProjects();

    // this.loadIndustries(this.currentProject.id);
    this.iosFixed.fixedScrollFreeze(this.content);

    this.store.getProject((data) => {
      if (data) {
        this.currentProject.id = data.value;
        this.currentProject.name = data.label;
      }

      if (!this.currentProject.id) {
        this.error = '请选择项目';
      }

      // console.log(this.currentProject);
      setTimeout(() => {
        this.loadIndustries(this.currentProject.id);
      }, 300);
      
    });
  }

  // ionViewWillLeave() {
  //   this.showPanel = false;
  // }

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

        this.industries = [];

        this.loadIndustries(this.currentProject.id);

        // this.loadData();
      });
    modal.present();
  }

  // loadProjects() {
  //   this.api.POST(null, { "dotype": "GetData", 
  //         "funname": "案场获取项目列表APP", 
  //         "param1": Utils.getQueryString("manid") })
  //     .then(data => {
  //       if (data && data['data']) {
  //         let arr = data['data'];
  //         // console.log(arr);
  //         this.projects = arr;
  //         // this.showSelectPage(arr);
  //         // this.loadIndustries(this.projects[0]);
  //       }
  //     })
  //     .catch(error => {
  //       // this.tools.showToast(error.message || '获取项目失败');
  //     });
  // }

  loadIndustries(project_id) {
    // console.log(project_id);
    if (!project_id) {
      return;
    }

    this.api.POST(null, { "dotype": "GetData", "funname": "获取房源业态APP", "param1": project_id }, '', false)
      .then(data => {
        // console.log(data);
        if (data && data['data']) {
          let arr = data['data'];

          if (arr.length == 0) {
            this.error2 = '暂无业态数据';
          } else {
            this.error2 = null;
          }

          let temp = [];
          arr.forEach(element => {
            temp.push({
              id: element.usertype_id,
              name: element.usertype_name
            });
          });

          this.industries = temp;

          this.content.resize();

          // console.log(this.industries);

          if (this.industries.length > 0) {
            this.industryID = this.industries[0].id;
          }

          this.loadHouses();

        } else {
          this.error2 = '未知错误';
        }

        

        // if (this.industries.length > 0) {
        //   let ind = this.industries[0];
        //   // this.currentIndustry.id = ind.usertype_id;
        //   // this.currentIndustry.name = ind.usertype_name;

        //   this.industryID = (ind.usertype_id || '').toString();
          
        //   this.loadHouses();
        // }
        
      })
      .catch(error => {
        this.error2 = error.message || '服务器出错了~';
      })
  }

  openHouse(item) {
    let industry = null;
    this.industries.forEach(element => {
      if (this.industryID === element.id ) {
        industry = element;
      }
    });
    this.app.getRootNavs()[0].push('HouseInfoPage',
      { house: item, project: this.currentProject, industry: industry });
  }

  // selectProject(proj, ev: Event) {
  //   ev.stopPropagation();
  //   this.currentProject.id = proj.project_id;
  //   this.currentProject.name = proj.project_name;

  //   this.currentIndustry.id = '';
  //   this.currentIndustry.name = '';

  //   this.houses = [];
  //   this.error = '选择项目和业态查询数据';

  //   this.loadIndustries(proj);
  // }

  // selectIndustry(ind) {

  //   this.showPanel = false;

  //   // if (ind.usertype_id != this.currentIndustry.id) {
  //     this.currentIndustry.id = ind.usertype_id;
  //     this.currentIndustry.name = ind.usertype_name;

  //     this.loadHouses();
  //   // }

  // }

  segmentChanged(ev) {
    // console.log(ev);

    this.loadHouses();
  }

  loadHouses() {
    this.error = null;
    
    this.api.POST(null, { dotype: 'GetData', 
                          funname: '获取房源楼栋列表APP', 
                          param1: this.currentProject.id, 
                          param2: this.industryID }, '正在加载', true)
      .then(data => {
        // console.log(data);
        if (data && data['data']) {
          this.houses = data['data'];
          if (this.houses.length == 0) {
            this.error = '暂无数据';
          } else {
            this.error = null;
          }
        } else {
          this.error = '未知错误';
        }
      })
      .catch(error => {
        this.error = error.message || '服务器出错了';
      });
  }

  startSearch(kw) {

  }

  error: any = null;
  houses: any = [];

}
