import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, Content } from 'ionic-angular';
import { ApiService } from '../../provider/api-service';
import { Utils } from '../../provider/Utils';
import { Tools } from '../../provider/Tools';
import { iOSFixedScrollFreeze } from '../../provider/iOSFixedScrollFreeze';

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
  title: any = '问卷调查';
  
  @ViewChild(Content) content: Content;

  constructor(public navCtrl: NavController, 
    private api: ApiService,
    private tools: Tools,
    private events: Events,
    private iosFixed: iOSFixedScrollFreeze,
    public navParams: NavParams) {
      this.callid = this.navParams.data.callid;
      this.tplid  = this.navParams.data.tplid;
      this.proj_id = this.navParams.data.proj_id;
      
      this.title = this.tplid === '8' ? '来电问卷' : '来访问卷';

      console.log(this.proj_id);
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad SurveyPage');
    this.iosFixed.fixedScrollFreeze(this.content);
    
    const obj = this.navParams.data.surveyData;
    // console.log(obj);

    if (obj && obj[this.tplid]) {
      this.formData = obj[this.tplid];
    } 

    if (this.formData.length === 0) {
      this.loadData();
    }
  }

  loadData() {
    // console.log(this.callid);
    // console.log(this.tplid);

    this.api.POST(null, { dotype: 'GetData', 
                          funname: '获取问卷明细数据APP',
                          param1: this.callid.toString(),
                          param2: this.tplid.toString(),
                          param3: this.proj_id,
                          }, '', false)
            .then(data => {
              // console.log(data);
              if (data && data['data']) {
                let mid = 0;
                let arr = data['data'];
                if (arr.length > 0) {
                  mid = arr[0].mid;
                }

                this.genSurvey(mid);
              } else {
                this.error = '未配置问卷';
              }
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
      let ele = JSON.parse(JSON.stringify(element));
      if (ele.titlevalue && ele.titlevalue !== '1') {
        ele.addvalue = '';
      }

      const caption = element.caption
      // const itype   = element.itype;
      // if (itype == '1' || itype == '2') {
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
        titles.push(ele);
        target.titles = titles;

      // } else {
      //   // 填空
      //   temp.push(element);
      // }
    });

    this.formData = temp;
    // console.log(this.formData);
  }

  selectItems(item,opt) {
    // console.log(type);
    // console.log(opt);

    if (item.itype == '1') {
      // 单选
      // item.selectedValue = opt.titleid;

      item.titles.forEach(obj => {
        obj.titlevalue = "";
      });
      opt.titlevalue = "1";

    } else if (item.itype == '2') {
      // 多选
      if (opt.titlevalue == "1") {
        opt.titlevalue = "";
      } else {
        opt.titlevalue = "1";
      }
      // const values = item.selectedValues || [];
      // let index = values.indexOf(opt.titleid);
      // if (index == -1) {
      //   values.push(opt.titleid);
      // } else {
      //   values.splice(index, 1);
      // }
      // item.selectedValues = values;

      // item.titles.forEach(obj => {
      //   if (values.indexOf(obj.titleid) != -1) {
      //     obj.titlevalue = "1";
      //   } else {
      //     obj.titlevalue = "";
      //   }
      // });

    }
  }

  commit() {
    // let sql = '';
    let requiredCount = 0;
    let needRequiredCount = 0;

    this.formData.forEach(element => {
      // console.log(element);
      if (element.ismust) {
        needRequiredCount ++;
      }
      
      // if ( (element.selectedValue || element.addvalue || 
      //     (element.selectedValues && element.selectedValues.length > 0))) {
      //       requiredCount ++;
      //     }
      let titles = element.titles;
      let inputCount = 0;
      if (titles) { // 单选或者多选
        titles.forEach(obj => {
          // console.log(obj);
          
          
          // if ( obj.addvalue || obj.titlevalue ) {
          //   inputCount ++;
          // }
          if (obj.itype == '3') {
            if (obj.addvalue) {
              inputCount ++;
            }
          } else {
            if (obj.titlevalue && obj.titlevalue == '1') {
              inputCount ++;
            }
          }

          // if (obj.itype == '3') {
          //   if (obj.ismust) {
          //     requiredCount ++;
          //   }
          // } else {
          //   if (obj.titlevalue) {
          //     requiredCount ++;
          //   }
          // }
          // console.log(obj);
          // sql += ` update H_SP_Questionnaire_DB set TitleValue = ${obj.titlevalue || "''"}, AddValue = '${obj.addvalue || ""}' where did = ${obj.did}`;
        });
      } else { // 填空
        // if (element.addvalue) {
          // console.log(123);
          // sql += ` update H_SP_Questionnaire_DB set AddValue = '${element.addvalue || ""}' where did = ${element.did}`;
        // }
      }

      if (inputCount > 0) {
        requiredCount ++;
      }
    });
    // console.log(sql);
    // console.log(requiredCount);
    // console.log(needRequiredCount);

    if (requiredCount != needRequiredCount) {
      this.tools.showToast('有必填未完成，请确认');
      return;
    }

    let data = this.navParams.data.surveyData || {};
    data[this.tplid] = this.formData;
    // console.log(data);

    this.events.publish('survey:saved', data);

    this.navCtrl.pop();

    // this.api.SendSurvey(sql)
    //   .then(data => {
    //     // console.log(data);
    //     // if (data && data['data']) {
    //     //   let arr = data['data'];
    //     //   if (arr.length > 0) {
    //     //     let item = arr[0];
    //     //     if (item.code == '0') {
    //           this.tools.showToast('保存数据成功');
    //     //     } else {
    //     //       this.tools.showToast(item.codemsg);
    //     //     }
    //     //   } else {
    //     //     this.tools.showToast('未知错误');
    //     //   }
    //     // } else {
    //     //   this.tools.showToast('未知错误');
    //     // }
    //   })
    //   .catch(error => {
    //     // console.log(error);
    //     this.tools.showToast(error.message || '服务器出错了~');
    //   });

  }

}
