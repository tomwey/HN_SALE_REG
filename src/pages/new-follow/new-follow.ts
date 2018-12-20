import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Events } from 'ionic-angular';
import { ApiService } from '../../provider/api-service';
import { Utils } from '../../provider/Utils';
import { Tools } from '../../provider/Tools';

/**
 * Generated class for the NewFollowPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-new-follow',
  templateUrl: 'new-follow.html',
})
export class NewFollowPage {

  // states: any = [];
  item: any = {
    state_name: '',
    state_id: '',
    start_date: '',
    memo: '',
    ex_start_date: '',
    ex_done_date: '',
    exception_types: ''
  };

  isException: boolean = false;

  subExceptions: any = {};
  parentExceptionIDs: any = [];
  parentExceptionNames: any = [];

  selectedItems: any = [];

  mortgageData: any;
  constructor(public navCtrl: NavController,
    private api: ApiService,
    private tools: Tools,
    private events: Events,
    private modalCtrl: ModalController,
    public navParams: NavParams) {
    this.mortgageData = this.navParams.data;

    if (this.mortgageData._type === 'edit') {
      this.isException = this.mortgageData.ajstate === '40' || this.mortgageData.ajstate === '90';
      this.item.state_name = this.mortgageData.ajstate_desc;
      this.item.state_id = this.mortgageData.ajstate;
      this.item.start_date = this.mortgageData.followupdate;
      this.item.memo = this.mortgageData.followupdesc;
      this.item.ex_start_date = this.mortgageData.abnormaldate
        .replace('NULL', '')
        .replace('1900-01-01', '');
      this.item.ex_done_date = this.mortgageData.abnormaldodate.replace('NULL', '').replace('1900-01-01', '');

      // console.log(this.mortgageData);

      let abnormaltypedesc = this.mortgageData.abnormaltypedesc.replace('NULL', '');
      let abnormaltypeids = this.mortgageData.abnormaltypeids.replace('NULL', '');

      let arr1 = abnormaltypedesc.split(';');
      let arr_1 = abnormaltypeids.split(';');

      let len = arr1.length;
      if (len > arr_1.length) {
        len = arr_1.length;
      }

      let temp = [];
      for (var i = 0; i < len; i++) {
        let desc1 = arr1[i];
        let id1 = arr_1[i];

        let par1 = desc1.split(':');
        let par2 = id1.split(':');

        let parent = { dic_name: par1[0], dic_id: par2[0] };

        let sub1 = par1[1];
        let sub2 = par2[1];

        if (sub1 && sub2) {
          let subArr = sub1.split(',');
          let subArr2 = sub2.split(',');

          for (var j = 0; j < subArr.length; j++) {
            temp.push({ dic_name: subArr[j], dic_id: subArr2[j], parent: parent });
          }
        }
      }

      this.selectedItems = temp;

      this.handleSelectedItems(this.selectedItems);
      // console.log(abnormaltypedesc)

      // let parent = 
      // abnormaldate: "2018-11-10"
      // abnormaldesc: "sadc"
      // abnormaldodate: "2018-11-13"
      // abnormaldomanid: "NULL"
      // abnormalname: "办理手续问题"
      // abnormalsubname: "增加首付,补银行办理费用"
      // abnormalsubtype: "3407,3405"
      // abnormaltype: "3403"
      // ajstate: "90"
      // ajstate_desc: "异常待处理"
      // create_date: "2018-11-09T09:40:45+08:00"
      // create_id: "286"
      // followupdate: "2018-10-09"
      // followupdesc: "sadc"
      // id: "782"
      // mid: "517"
      // replydesc: "NULL"
      // statetypeid: "NULL"
      // statetypename: "NULL"
    }
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad NewFollowPage');
  }

  loadMortgageStates() {
    this.api.POST(null, {
      "dotype": "GetData",
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
            this.forwardToPage(arr);
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

  selectState() {
    this.loadMortgageStates();
  }

  forwardToPage(arr, type = 0) {
    let temp = [];
    arr.forEach(element => {
      if (element.dic_value !== '95') { // 屏蔽掉异常退法务
        temp.push(`${element.dic_name}|${element.dic_value}`);
      }
    });

    let modal = this.modalCtrl.create('CommSelectPage', {
      selectedItem: null,
      title: type === 0 ? '选择按揭状态' : '选择异常类型', data: temp
    });
    modal.onDidDismiss((res) => {
      // console.log(res);
      if (!res) return;

      if (type === 0) {
        this.item.state_name = res.label;
        this.item.state_id = res.value;

        this.isException = (this.item.state_id === '40' || this.item.state_id === '90');
      } else if (type === 1) {
        // 选择异常类型
      }

    });
    modal.present();
  }

  forwardToPage2(arr) {
    let modal = this.modalCtrl.create('TreeSelectPage', {
      selectedItems: this.selectedItems,
      title: '选择异常类型', data: arr
    });
    modal.onDidDismiss((res) => {
      // console.log(res);
      if (!res) return;

      // this.selectedExceptions = res;
      this.selectedItems = res;

      this.handleSelectedItems(res);
    });
    modal.present();
  }

  handleSelectedItems(res) {
    this.parentExceptionIDs = [];
    this.parentExceptionNames = [];
    this.subExceptions = {};

    res.forEach(obj => {
      const parent = obj.parent;
      if (this.parentExceptionIDs.indexOf(parent.dic_id) === -1) {
        // 找到了
        this.parentExceptionIDs.push(parent.dic_id);
        this.parentExceptionNames.push(parent.dic_name);
      }

      let items = this.subExceptions[parent.dic_name] || [];
      items.push(obj);
      this.subExceptions[parent.dic_name] = items;
    });

  }

  selectException() {
    this.api.POST(null, {
      "dotype": "GetData",
      "funname": "通用获取数据字典数据APP",
      "param1": "471"
    })
      .then(data => {
        if (data && data['data']) {
          let arr = data['data'];

          // console.log(arr);
          // this.projects = arr;
          if (arr.length == 0) {
            this.tools.showToast('暂无异常类型数据');
          } else {
            this.forwardToPage2(arr);
          }
          // this.showSelectPage(arr);
          // this.loadIndustries(this.projects[0]);
        } else {
          this.tools.showToast('非法错误!');
        }
      })
      .catch(error => {
        this.tools.showToast(error.message || '获取异常类型失败');
      });
  }

  commit() {
    if (!this.item.state_id) {
      this.tools.showToast('按揭状态不能为空');
      return;
    }

    // if (!this.item.start_date) {
    //   this.tools.showToast('开始日期不能为空');
    //   return;
    // }

    // if (!this.item.memo) {
    //   this.tools.showToast('备注不能为空');
    //   return;
    // }

    if (this.isException) {
      if (this.parentExceptionIDs.length === 0) {
        this.tools.showToast('异常类型不能为空');
        return;
      }

      // if (!this.item.ex_start_date) {
      //   this.tools.showToast('异常开始时间不能为空');
      //   return;
      // }

      if (!this.item.ex_done_date) {
        this.tools.showToast('计划完成时间不能为空');
        return;
      }
    }

    //     @iAbnormalType VARCHAR(100),--异常类型
    // @iAbnormalName VARCHAR(500),--异常类型描述
    // @iAbnormalSubType VARCHAR(100),--异常子类型
    // @iAbnormalSubName VARCHAR(500),--异常子类型描述
    // @iAbnormalDate VARCHAR(80),--异常时间
    // @iAbnormalDoDate VARCHAR(80),--计划完成时间
    // @iAbnormalDesc VARCHAR(2000)--异常说明

    let subExIDs: any = [];
    let subExNames: any = [];

    this.parentExceptionNames.forEach(name => {
      const arr = this.subExceptions[name];

      arr.forEach(element => {
        subExIDs.push(element.dic_id);
        subExNames.push(element.dic_name);
      });

    });

    let exDesc = this.isException ? this.item.memo : '';

    this.api.POST(null, {
      dotype: 'GetData',
      funname: '新增按揭台账跟进或异常记录APP',
      param1: Utils.getQueryString('manid'),
      param2: this.mortgageData.mid || '0',
      param3: this.item.state_id,
      param4: this.item.start_date,
      param5: this.item.memo,
      param6: this.parentExceptionIDs.join(','),
      param7: this.parentExceptionNames.join(','),
      param8: subExIDs.join(','),
      param9: subExNames.join(','),
      param10: this.item.ex_start_date,
      param11: this.item.ex_done_date,
      param12: exDesc,
      param13: this.mortgageData._type === 'edit' ? this.mortgageData.id : '',
    })
      .then(data => {
        this.tools.showToast('提交成功!');

        // this.mortgageData.ajstate = this.item.state_id;
        this.mortgageData.ajstate_desc = this.item.state_name;
        this.mortgageData.followupdesc = this.item.memo;

        if (this.isException) {
          this.mortgageData.abnormalname = this.parentExceptionNames.join(',');
          this.mortgageData.abnormaldesc = exDesc;
        }

        this.events.publish('state:changed');

        this.navCtrl.pop();
      })
      .catch(error => {
        this.tools.showToast(error.message || '服务器出错了');
      });
  }

}
