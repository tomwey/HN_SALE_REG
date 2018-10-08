import { Component } from '@angular/core';
import { NavController, NavParams, App } from 'ionic-angular';
import { ApiService } from '../../provider/api-service';
import { Utils } from '../../provider/Utils';

/**
 * Generated class for the HouseQueryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// @IonicPage()
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
  
  currentIndustry: any = {
    id: '',
    name: '',
  };

  constructor(public navCtrl: NavController, 
    private app: App,
    private api: ApiService,
    public navParams: NavParams) {
      if (!this.currentIndustry.id || !this.currentProject.id) {
        this.error = '选择项目和业态查询房源';
      }
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad HouseQueryPage');
    this.loadProjects();
  }

  ionViewWillLeave() {
    this.showPanel = false;
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

  loadIndustries(project) {
    this.api.POST(null, { "dotype": "GetData", "funname": "获取房源业态APP", "param1": project.project_id })
      .then(data => {
        console.log(data);
        if (data && data['data']) {
          this.industries = data['data'];

          if (this.industries.length == 0) {
            this.error2 = '暂无业态数据';
          } else {
            this.error2 = null;
          }
        } else {
          this.error2 = '未知错误';
        }
      })
      .catch(error => {
        this.error2 = error.message || '服务器出错了~';
      })
  }

  openHouse(item) {
    this.app.getRootNavs()[0].push('HouseInfoPage',
      { house: item, project: this.currentProject, industry: this.currentIndustry });
  }

  selectProject(proj, ev: Event) {
    ev.stopPropagation();
    this.currentProject.id = proj.project_id;
    this.currentProject.name = proj.project_name;

    // this.currentIndustry.id = '';
    // this.currentIndustry.name = '';

    this.loadIndustries(proj);
  }

  selectIndustry(ind) {

    this.showPanel = false;

    // if (ind.usertype_id != this.currentIndustry.id) {
      this.currentIndustry.id = ind.usertype_id;
      this.currentIndustry.name = ind.usertype_name;

      this.loadHouses();
    // }

  }

  loadHouses() {
    this.api.POST(null, { dotype: 'GetData', 
                          funname: '获取房源楼栋列表APP', 
                          param1: this.currentProject.id, 
                          param2: this.currentIndustry.id })
      .then(data => {
        console.log(data);
        if (data && data['data']) {
          this.houses = data['data'];
          if (this.houses.length == 0) {
            this.error = '未找到房源数据';
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
