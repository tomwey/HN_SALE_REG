import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ApiService } from '../../provider/api-service';
import { Utils } from '../../provider/Utils';
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

  constructor(public navCtrl: NavController, 
    private viewCtrl: ViewController,
    private api: ApiService,
    // private tools: Tools
    public navParams: NavParams) {
      this.source = this.navParams.data;

      if (this.source.field == 'old_person') {
        this.placeholder = '输入老业主姓名搜索';
      } else if (this.source.field == 'employer') {
        this.placeholder = '输入员工姓名搜索';
      } else if (this.source.field == 'company') {
        this.placeholder = '输入转介公司名字搜索';
      }

      this.error = this.placeholder;
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad SearchSelectPage');
  }

  startSearch(kw) {
    if (kw.trim() == '') return;
    // 获取转介公司APP
    let params = null;

    if (this.source.field == 'employer') {
      params = { dotype: "selman", manname: kw.trim() };
    } else if (this.source.field == 'old_person') {
      params = { dotype: "GetData", 
                 funname: '获取老客户APP', 
                 param1: kw.trim(), 
                 param2: Utils.getQueryString('manid') };
    } else if (this.source.field == 'company') {
      params = { dotype: "GetData", 
                 funname: '获取转介公司APP', 
                 param1: kw.trim(), 
                 param2: Utils.getQueryString('manid') };
    }

    this.api.POST(null, params)
      .then(data => {
        console.log(data);
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

  selectItem(item) {
    if (this.source.field == 'employer') {
      this.viewCtrl.dismiss({
        label: item.man_name,
        value: item.man_id
      })
    } else if (this.source.field == 'old_person') {
      // return item.name;
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
      return item.name;
    } else if (this.source.field == 'company') {
      return item.comname;
    }

    return '';
  }

  fetchSubtitle(item) {
    if (this.source.field == 'employer') {
      return item.station_name;
    } else if (this.source.field == 'old_person') {
      return item.name;
    } else if (this.source.field == 'company') {
      return item.areaname;
    }

    return '';
  }

}
