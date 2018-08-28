import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiService } from '../../provider/api-service';
import { Utils } from '../../provider/Utils';

/**
 * Generated class for the SurveyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-survey',
  templateUrl: 'survey.html',
})
export class SurveyPage {

  callid: any;
  tplid: any;
  proj_id: any;
  error: any = null;
  formData: any = [];
  formObj: any = {};
  constructor(public navCtrl: NavController, 
    private api: ApiService,
    
    public navParams: NavParams) {
      this.callid = this.navParams.data.callid;
      this.tplid  = this.navParams.data.tplid;
      this.proj_id = this.navParams.data.proj_id;
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad SurveyPage');
    this.loadData();
  }

  loadData() {
    this.api.POST(null, { dotype: 'GetData', 
                          funname: '获取问卷明细数据APP',
                          param1: this.callid,
                          param2: this.tplid
                          })
            .then(data => {
              console.log(data);
              let mid = 0;
              let arr = data['data'];
              if (arr.length > 0) {
                mid = arr[0].mid;
              }

              this.genSurvey(mid);
            })
            .catch(error => {
              // console.log(error);
              this.error = error.message || '服务器出错了~';
            });

  }

  genSurvey(mid) {
    this.api.POST(null, { dotype: 'GetData', 
                          funname: '获取调查问卷APP',  
                          param1: mid.toString(),
                          param2: this.tplid.toString(),
                          param3: this.proj_id.toString(),
                          param4: '1',
                          param5: '',
                          param6: this.callid,
                          param7: Utils.getQueryString('manid'),
                        })
            .then(data => {
              // console.log(data);
              if (data && data['data']) {
                let arr = data['data'];
                if (arr.length == 0) {
                  this.error = '暂无问卷数据';
                } else {
                  this.genSurveyForm(arr);
                }
              } else {
                this.error = '未知错误';
              }
            })
            .catch(error => {
              this.error = error.message || '服务器出错了~';
            });
  }

  genSurveyForm(arr) {
    let temp = [];
    arr.forEach(element => {
      const caption = element.caption
      const itype   = element.itype;
      if (itype == '1' || itype == '2') {
        // let titles = this.formObj[caption] || [];
        // titles.push(element);
        // this.formObj[caption] = titles;
        let target = this.formObj[caption];
        if (!target) {
          target = element;
          this.formObj[caption] = target;
          temp.push(target);
        }

        let titles = target.titles || [];
        titles.push({ title: element.title, 
                      titleid: element.titleid, 
                      titlevalue: element.titlevalue });
        target.titles = titles;

      } else {
        // 填空
        temp.push(element);
      }
    });

    this.formData = temp;
    console.log(this.formData);
  }

  selectItems(item,opt) {
    // console.log(type);
    console.log(opt);

    if (item.itype == '1') {
      // 单选
      item.selectedValue = opt.titleid;
    } else if (item.itype == '2') {
      // 多选
      const values = item.selectedValues || [];
      let index = values.indexOf(opt.titleid);
      if (index == -1) {
        values.push(opt.titleid);
      } else {
        values.splice(index, 1);
      }
      item.selectedValues = values;
    }
  }

}
