import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController, Content, Events } from 'ionic-angular';
import { ApiService } from '../../provider/api-service';
import { Tools } from '../../provider/Tools';
import { Utils } from '../../provider/Utils';
import { iOSFixedScrollFreeze } from '../../provider/iOSFixedScrollFreeze';

/**
 * Generated class for the VistorRegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-vistor-register',
  templateUrl: 'vistor-register.html',
})
export class VistorRegisterPage {

  // {"callid":"1",
  //  "custname":"张三",
  //  "followcnt":"1",
  //  "knowway":"NULL",
  //  "sex":"NULL",
  //  "srctypeid":"NULL",
  //  "srctypename":"NULL",
  //  "statedesc":"跟进",
  //  "statenum":"0",
  //  "telephone":"15000000000"}

  person: any = {
    custname: '',
    telephone: '',
    knowway: '',
    sex: '',
    srctypename: '',
  };
  followtype: any;
  currentFollowType: any;

  surveyData: any;

  source?: any = null;

  followcontent: any = '';
  followid: any = '0';

  currentSelectBtn: any = null;

  proj_id: any;

  operType: any = '0';

  buttons: any = [
    {
      label: '无',
      value: 0,
    },
    {
      label: '20%',
      value: 20,
    },
    {
      label: '40%',
      value: 40,
    },
    {
      label: '60%',
      value: 60,
    },
    {
      label: '80%',
      value: 80,
    },
    {
      label: '100%',
      value: 100,
    },
  ];

  knowwayReadonly: any = false;
  mobileReadonly: any = true;

  followtypes: any = [
    {
      label: '来电',
      value: '10',
    },
    {
      label: '来访',
      value: '20'
    },
    {
      label: '回访',
      value: '30',
    },
    {
      label: '微信',
      value: '40',
    },
    {
      label: '其他',
      value: '50'
    }
  ];

  @ViewChild(Content) content: Content;

  constructor(public navCtrl: NavController, 
    private api: ApiService,
    private tools: Tools,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private events: Events,
    private iosFixed: iOSFixedScrollFreeze,
    public navParams: NavParams) {
    this.person = this.navParams.data.person;

    if (this.person.knowway) {
      this.knowwayReadonly = true;
    }

    if (this.navParams.data.isNew == '1') {
      this.mobileReadonly = false;
    }

    this.proj_id = this.navParams.data.proj_id;
    
    this.followtype = this.navParams.data.followtype == 1 ? '10' : '20';
    this.currentFollowType = this.followtype;

    for (const key in this.person) {
      if (this.person.hasOwnProperty(key)) {
        if (this.person[key] == 'NULL') {
          this.person[key] = '';
        }
      }
    }

    if (this.person.srcname && this.person.srctypeid) {

      if (this.person.srctypeid == '1') {
        this.source = { descname: '老业主', field: 'old_person', label: this.person.srcname };
      } else if (this.person.srctypeid == '3') {
        this.source = { descname: '转介公司', field: 'company', label: this.person.srcname };
      } else if (this.person.srctypeid == '5') {
        this.source = { descname: '公司员工', field: 'employer', label: this.person.srcname };
      } else if (this.person.srctypeid == '6') {
        this.source = { descname: '公司员工', field: 'employer', label: this.person.srcname };
      }
    }

    this.events.subscribe('survey:saved', (data) => {
      this.surveyData = data;
    });

  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad VistorRegisterPage');
    this.iosFixed.fixedScrollFreeze(this.content);
    if (!this.person.callid || this.person.callid == '0') {
      
      this.api.POST(null, { dotype: 'GetData', 
                            funname: '获取表的主键APP', 
                            param1: Utils.getQueryString('manid'),
                            param2: 'H_SP_Call',
                           })
              .then(data => {
                console.log(data);
                if (data && data['data']) {
                  let arr = data['data'];
                  if (arr.length > 0) {
                    this.person.callid = arr[0].id;
                  }
                }
              })
              .catch(error => {});
    }
  }

  sendFlow() {
    this.api.POST(null, { dotype: 'GetData', 
                          funname: '客户来源类型变更APP', 
                          param1: '1',
                          param2: this.person.callid,
                          param3: Utils.getQueryString('manid')
                         })
      .then(data => {
        // console.log(data);
        // this.tools.showToast('流程发起成功');
        if (data && data['data']) {
          let arr = data['data'];
          if (arr.length == 0) {
            this.tools.showToast('未知错误');
          } else {
            let item = arr[0];
            if (item.code == '0') {
              this.tools.showToast('发起变更流程成功');
            } else {
              this.tools.showToast(item.errmsg);
            }
          }
        } else {
          this.tools.showToast('未知错误');
        }
      })
      .catch(error => {
        // console.log(error);
        this.tools.showToast(error.message || '服务器出错了');
      });
  }

  changeSRCType() {
    this.alertCtrl.create({
      title: '客户来源修改流程发起',
      subTitle: '客户来源修改需要发起申请流程，您确定吗？',
      buttons: [
        {
          text: '取消',
          role: 'Cancel'
        },
        {
          text: '发起流程',
          handler: () => {
            this.sendFlow();
          }
        }
      ]
    }).present();
  }

  selectPersonSource() {

    if (this.person.callid && this.person.callid != '0' && this.person.callid != 'NULL' && this.person.srctypename && this.person.srctypename != 'NULL') { return; }

    this.api.POST(null, { "dotype": "GetData", 
        "funname": "通用获取数据字典数据APP", 
        "param1": '415' })
    .then(data => {
      console.log(data);
      if (data && data['data']) {
        let arr = data['data'];
        this.showSelectPage(arr, '选择客户来源', 1);
      }
    })
    .catch(error => {
      this.tools.showToast(error.message || '获取数据失败');
    });
  }

  showSelectPage(arr, title, type) {
    let data = [];
    // console.log(arr);
    arr.forEach(element => {
      // "project_id":"1291428","project_name":"珍宝金楠一期"
      data.push(`${element.dic_name}|${element.dic_value}`);  
    });
    let selectedItem = null;
    // if (this.person.srctypename && this.person.srctypeid) {
    //   selectedItem = `${this.person.srctypename}|${this.person.srctypeid}`;
    // }
    let modal = this.modalCtrl.create('CommSelectPage', { selectedItem: selectedItem, 
                                                          title: title, data: data })
    modal.onDidDismiss((res) => {
      if (res) {
        // this.storage.set('selected.project', JSON.stringify(data));
        if (type == 1) { // 客户来源
          this.person.srctypename = res.label;
          this.person.srctypeid   = res.value;

          if (res.value == '1') {
            this.source = { descname: '老业主', field: 'old_person' };
          } else if (res.value == '3') {
            this.source = { descname: '转介公司', field: 'company' };
          } else if (res.value == '5') {
            this.source = { descname: '公司员工', field: 'employer' };
          } else if (res.value == '6') {
            this.source = { descname: '公司员工', field: 'employer' };
          } else {
            this.source = null;
          }
        } else if (type == 2) { // 证件类型
          this.person.cardtypename = res.label;
          this.person.cardtypeid = res.value;
        }
      }
    });
    modal.present();
  }

  handleOper(type, typename) {
    this.alertCtrl.create({
      title: '操作提示',
      subTitle: `您确定要${typename}该客户吗？`,
      buttons: [
        {
          text: '取消',
          role: 'Cancel'
        },
        {
          text: '确定',
          handler: () => {
            this.save(type,typename);
          }
        }
      ]
    }).present();
  }

  selectSourceDetail() {
    if (this.person.srcname) { return; }
    let modal = this.modalCtrl.create('SearchSelectPage', { source: this.source, proj_id: this.proj_id });
    modal.onDidDismiss((data) => {
      if (data) {
        this.source.label = data.label;
        this.source.value = data.value;
      }
    });
    modal.present();
  }

  selectBtn(btn) {
    if (this.currentSelectBtn) {
      this.currentSelectBtn.selected = false;
    }

    btn.selected = true;
    
    this.currentSelectBtn = btn;
  }

  openSurvey() {
    if (!this.person.callid || this.person.callid == 0 || this.person.callid == 'NULL') {
      this.tools.showToast('还未做过跟进，不能进行问卷调查');
      return;
    }
    this.navCtrl.push('SurveyPage', { callid: this.person.callid, 
                                      tplid: this.followtype == '10' ? 8 : 6,
                                      proj_id: this.proj_id,
                                      surveyData: this.surveyData,
                                     });
  }

  save(type, typename) {
    this.operType = type;

    if (type == '0') {
      if (!this.followcontent || this.followcontent.trim() == '') {
        this.tools.showToast('跟进内容不能为空');
        return;
      }
    }

    let params = {
      dotype: 'GetData',
      funname: '案场新建更新访客记录APP',
      param1: Utils.getQueryString('manid'),
      param2: Utils.getQueryString('manname'),
      param3: this.person.callid || '0',
      param4: this.person.telephone,
      param5: this.person.custname,
      param6: this.person.sex,
      param7: this.person.cardtypeid || this.person.cardtype,
      param8: this.person.cardno,
      param9: this.person.srctypeid,
      param10: this.source ? this.source.value : '',
      param11: this.navParams.data.proj_id,
      param12: this.followtype,
      param13: this.person.knowway,
      param14: this.source ? this.source.label : '',
      param15: this.person.srcmemo,
      param16: this.currentFollowType,
      param17: (this.currentSelectBtn ? this.currentSelectBtn.value : 0).toString(),
      param18: this.followcontent,
      param19: type,
      param20: this.followid,
    };

    this.tools.showLoading('提交中...');

    this.api.POST(null, params, '', false)
      .then(data => {
        // console.log(data);
        if (this.followid == '0') {
          this.person.followcnt = parseInt(this.person.followcnt || 0) + 1;
        }
        
        if (data && data['data']) {
          let arr = data['data'];
          if (arr.length > 0) {
            
            // 重置跟进相关数据

            // this.followcontent = '';

            // if (this.currentSelectBtn) {
            //   this.currentSelectBtn.selected = false;
            //   this.currentSelectBtn = null;
            // }

            if (this.operType == '0') {
              this.person.callid = this.person.callid || arr[0].callid;
              this.followid = arr[0].followid;
              this.person.statenum     = this.person.statenum || '0';
              this.person.statedesc = this.person.statedesc || '跟进';
              // this.tools.showToast('保存跟进成功');
              if (this.surveyData) {
                this.saveSurvey();
              } else {
                this.tools.showToast('保存成功');
                this.tools.hideLoading();
              }
              
            } else {
              this.person.statenum     = this.operType;
              this.person.statedesc = this.operType == '30' ? '丢失' : '作废';
              this.tools.showToast('操作成功');
              this.tools.hideLoading();
            }
            
          } else {
            this.tools.showToast('未知错误');
            this.tools.hideLoading();
          }
        } else {
          this.tools.showToast('未知错误');
          this.tools.hideLoading();
        }
      })
      .catch(error => {
        this.tools.showToast(error.message || '服务器出错了~');
        this.tools.hideLoading();
      });
  }

  generateSql2() {
    let sql = '';
    this.surveyData.forEach(element => {
      let titles = element.titles;
      let inputCount = 0;
      if (titles) { // 单选或者多选
        titles.forEach(obj => {

          sql += ` update H_SP_Questionnaire_DB set TitleValue = ${obj.titlevalue || "''"}, AddValue = ${obj.addvalue || "''"} where did = ${obj.did}`;
        });
      } else { // 填空
        // if (element.addvalue) {
          sql += ` update H_SP_Questionnaire_DB set AddValue = ${element.addvalue || "''"} where did = ${element.did}`;
        // }
      }
    });
    return sql;
  }

  saveSurvey() {
    let sql = this.generateSql2 ();

    this.api.SendSurvey(sql, '', false)
      .then(data => {
        // console.log(data);
        // if (data && data['data']) {
        //   let arr = data['data'];
        //   if (arr.length > 0) {
        //     let item = arr[0];
        //     if (item.code == '0') {
              this.tools.showToast('保存成功');

              this.surveyData = null;

              this.tools.hideLoading();
        //     } else {
        //       this.tools.showToast(item.codemsg);
        //     }
        //   } else {
        //     this.tools.showToast('未知错误');
        //   }
        // } else {
        //   this.tools.showToast('未知错误');
        // }
      })
      .catch(error => {
        // console.log(error);
        this.tools.showToast(error.message || '服务器出错了~');
        this.tools.hideLoading();
      });
  }

  selectFollowType(type) {
    this.currentFollowType = type.value;
  }

  selectCardType() {
    this.api.POST(null, { "dotype": "GetData", 
          "funname": "通用获取数据字典数据APP", 
          "param1": '88' })
      .then(data => {
        console.log(data);
        if (data && data['data']) {
          let arr = data['data'];
          this.showSelectPage(arr, '选择证件类型', 2);
        }
      })
      .catch(error => {
        this.tools.showToast(error.message || '获取证件类型失败');
      });
  }

  viewHistory() {
    if (parseInt(this.person.followcnt || 0) == 0) {
      this.tools.showToast('还没跟进过，不能查看~');
      return;
    }

    this.navCtrl.push('FollowHistoryPage', { callid: this.person.callid });
  }

}
