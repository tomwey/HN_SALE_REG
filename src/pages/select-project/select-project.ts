import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Content } from 'ionic-angular';
import { Utils } from '../../provider/Utils';
import { ApiService } from '../../provider/api-service';
import { iOSFixedScrollFreeze } from '../../provider/iOSFixedScrollFreeze';

/**
 * Generated class for the SelectProjectPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-select-project',
  templateUrl: 'select-project.html',
})
export class SelectProjectPage {

  areaProjects: any = {};
  areas: any = [];
  error: any = null;
  projects: any = {};

  currentArea: any;

  l1Projects: any = [];

  onlyShowL1Projects: boolean = false;

  @ViewChild(Content) content: Content;
  constructor(public navCtrl: NavController,
    private viewCtrl: ViewController,
    private api: ApiService,
    private iosFixed: iOSFixedScrollFreeze,
    public navParams: NavParams) {
    this.onlyShowL1Projects = this.navParams.data.onlyShowL1Projects;

    // hack history back
    // var foo = { sp1: true };
    // history.pushState(foo, "selectproject", " ");
  }

  ionViewDidLoad() {
    this.iosFixed.fixedScrollFreeze(this.content);

    setTimeout(() => {
      this.loadData();
    }, 300);
  }

  loadData() {
    this.api.POST(null, {
      "dotype": "GetData",
      "funname": "案场获取项目列表APP",
      "param1": Utils.getQueryString("manid")
    })
      .then(data => {
        if (data && data['data']) {
          let arr = data['data'];
          this.error = arr.length === 0 ? '暂无项目数据' : null;

          this.handleProject(arr);

          this.content.resize();

        } else {
          this.error = '非法错误！';
        }
      })
      .catch(error => {
        this.error = '服务器获取项目出错~';
      });
  }

  handleProject(arr) {
    // {"area_id":"1679352",
    //   "area_name":"成都",
    //   "area_order":"2",
    //   "isproject":false,
    //   "project_aliasname":"江屿一",
    //   "project_id":"1291558",
    //   "project_name":"枫丹江屿一期",
    //   "project_order":"2400",
    //   "project_pid":"1291556"
    // }
    // this.areas.indexOf()
    arr.forEach(proj => {
      if (this.areas.indexOf(proj.area_name) === -1) {
        this.areas.push(proj.area_name);
      }
      // console.log(proj);

      if (proj.isproject) { // 项目
        let _projects = this.areaProjects[proj.area_name] || [];
        // console.log(_projects);
        _projects.push(proj);
        this.areaProjects[proj.area_name] = _projects;
      } else { // 项目分期
        let projectChildren = this.projects[proj.project_pid] || [];
        projectChildren.push(proj);
        this.projects[proj.project_pid] = projectChildren;
      }
    });

    // console.log(this.areaProjects);
    // console.log(this.projects);

    if (this.areas.length > 0) {
      this.currentArea = this.areas[0];
      this.segmentChanged(null);
    }
  }

  segmentChanged(ev) {
    // console.log(ev);
    // console.log(this.areaProjects);
    this.l1Projects = this.areaProjects[this.currentArea];
    // console.log(this.l1Projects);
  }

  expandItem(item) {
    if (this.onlyShowL1Projects) {
      this.selectProject(item, null);
      return;
    }

    this.l1Projects.map(obj => {
      if (item === obj) {
        obj.expanded = !obj.expanded;
      } else {
        obj.expanded = false;
      }
    });
  }

  selectProject(item, ev: Event) {
    if (ev) ev.stopPropagation();

    if (!item) return;

    let data = { label: item.project_name, value: item.project_id };
    this.viewCtrl.dismiss(data);
  }

  close() {
    this.viewCtrl.dismiss();
  }

}
