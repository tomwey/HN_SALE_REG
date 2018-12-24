import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, App, Content, IonicPage } from 'ionic-angular';
import { ApiService } from '../../provider/api-service';
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
  timeout: number = 300;

  @ViewChild(Content) content: Content;

  constructor(public navCtrl: NavController,
    private app: App,
    private iosFixed: iOSFixedScrollFreeze,
    private api: ApiService,
    public navParams: NavParams) {

  }

  ionViewDidLoad() {
    this.iosFixed.fixedScrollFreeze(this.content);
  }

  onSelectedProject(ev) {
    // console.log(ev);
    if (ev) {
      this.currentProject = ev;
    }

    if (!this.currentProject.id) {
      this.error = '请选择项目';
    }

    if (ev.fromStore) {
      setTimeout(() => {
        this.loadIndustries(this.currentProject.id);
      }, 350);
    } else {
      this.industries = [];
      this.loadIndustries(this.currentProject.id);
    }

  }

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

      })
      .catch(error => {
        this.error2 = error.message || '服务器出错了~';
      })
  }

  openHouse(item) {
    let industry = null;
    this.industries.forEach(element => {
      if (this.industryID === element.id) {
        industry = element;
      }
    });
    this.app.getRootNavs()[0].push('HouseInfoPage',
      { house: item, project: this.currentProject, industry: industry });
  }

  segmentChanged(ev) {
    this.loadHouses();
  }

  loadHouses() {
    this.error = null;

    this.api.POST(null, {
      dotype: 'GetData',
      funname: '获取房源楼栋列表APP',
      param1: this.currentProject.id,
      param2: this.industryID
    }, '正在加载', true)
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
