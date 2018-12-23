import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import { ApiService } from '../../provider/api-service';
import { Utils } from '../../provider/Utils';
import { iOSFixedScrollFreeze } from '../../provider/iOSFixedScrollFreeze';

/**
 * Generated class for the HouseDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-house-detail',
  templateUrl: 'house-detail.html',
})
export class HouseDetailPage {

  house: any;
  project: any;
  error: any = null;

  roomData: any = {};

  hideInfo: boolean = false;

  @ViewChild(Content) content: Content;

  constructor(public navCtrl: NavController,
    private api: ApiService,
    private iosFixed: iOSFixedScrollFreeze,
    public navParams: NavParams) {
    this.house = this.navParams.data.room;
    this.project = this.navParams.data.project;
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad HouseDetailPage');
    this.iosFixed.fixedScrollFreeze(this.content);

    this.hideInfo = (Utils.getQueryString('hide') === '1');
    // console.log(Utils.getQueryString('hide'));

    this.loadData();
  }

  loadData() {
    this.api.POST(null, {
      dotype: "GetData",
      funname: '获取房源房间信息APP',
      param1: this.house.house_id,
      param2: Utils.getQueryString('manid')
    })
      .then(data => {
        // console.log(data);
        if (data && data['data']) {
          let arr = data['data'];
          if (arr.length > 0) {
            this.error = null;
            this.prepareData(arr[0]);
          } else {
            this.error = '未知错误';
          }

          this.content.resize();
        } else {
          this.error = '未知错误';
        }
      })
      .catch(error => {
        this.error = error.message || '服务器出错了~';
      });
  }

  gotoCalc() {
    let total = parseInt(this.roomData.stdmoney) / 10000.0;
    total = Math.round(total * 100) / 100.0;
    this.navCtrl.push('CalculatorPage', { calcType: '1', houseTotal: total });
  }

  prepareData(roomData) {
    this.roomData = roomData;

    let state = '';
    if (this.house.statenum == '100') {
      state = '销控';
    } else if (this.house.pushstate == '0') {
      state = '收盘';
    } else {
      if (this.house.statenum == '0') {
        state = '待售';
      } else if (this.house.statenum == '10') {
        state = '认购';
      } else if (this.house.statenum == '20') {
        state = '签约';
      }
    }

    this.data = [
      {
        label: '房间名称',
        value: `${this.project.name} ${roomData.house_no}`
      },
      {
        label: '房源状态',
        value: state,
      },
      {
        label: '房源户型',
        value: roomData.layout
      },
      {
        label: '房源楼层',
        value: `${roomData.floor} 层`
      },
      {
        label: '建筑面积',
        value: `${roomData.buildarea} m²`
      },
      {
        label: '套内面积',
        value: `${roomData.setarea} m²`
      },
      // {
      //   label: '底价建面单价',
      //   value: `${roomData.basepriceb == 'NULL' ? '--' : roomData.basepriceb}元/m²`
      // },
      // {
      //   label: '底价套内单价',
      //   value: `${roomData.baseprices == 'NULL' ? '--' : roomData.baseprices}元/m²`
      // },
      // {
      //   label: '底价总价',
      //   value: `${roomData.basemoney == 'NULL' ? '--' : roomData.basemoney}元`
      // },

    ];

    this.data2 = [
      {
        label: '成交建筑单价',
        value: `${roomData.priceb == 'NULL' ? '--' : roomData.priceb} 元/m²`
      },
      {
        label: '成交套内单价',
        value: `${roomData.prices == 'NULL' ? '--' : roomData.prices} 元/m²`
      },
      {
        label: '成交总价',
        value: `${roomData.money && roomData.money == 'NULL' ? '--' : Utils.formatMoney(roomData.money)} 元`
      }];

    if (this.house.statenum === '0' ||
      this.house.statenum === '10' ||
      this.house.statenum === '20'
    ) {
      this.data.push({
        label: '标准建面单价',
        value: `${roomData.stdpriceb == 'NULL' ? '--' : roomData.stdpriceb} 元/m²`
      });
      this.data.push({
        label: '标准套内单价',
        value: `${roomData.stdprices == 'NULL' ? '--' : roomData.stdprices} 元/m²`
      });
      this.data.push({
        label: '标准总价',
        value: `${roomData.stdmoney && roomData.stdmoney == 'NULL' ? '--' : Utils.formatMoney(roomData.stdmoney)} 元`
      });
    }

    this.data.push({
      label: '户型图',
      value: roomData.layoutannexurl || '',
      type: '2',
    });

    // console.log(this.data);
  }

  data2: any = [];
  data: any = [];

}
