import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Content } from 'ionic-angular';
import { ApiService } from '../../provider/api-service';
import { iOSFixedScrollFreeze } from '../../provider/iOSFixedScrollFreeze';

/**
 * Generated class for the HouseInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-house-info',
  templateUrl: 'house-info.html',
})
export class HouseInfoPage {

  house: any;
  project: any;
  industry: any;
  floors: any = {};
  // hasUnit: boolean = true;
  @ViewChild(Content) content: Content;

  constructor(public navCtrl: NavController, 
    private api: ApiService,
    private iosFixed: iOSFixedScrollFreeze,
    public navParams: NavParams) {
    this.house = this.navParams.data.house;
    this.project = this.navParams.data.project;
    this.industry = this.navParams.data.industry;
    
    // console.log(this.project);
    // console.log(this.industry);
    // console.log(this.house);

    this.prepareUnits();
    
  }

  prepareUnits() {
    let ids = this.house.unitids.replace('NULL', '')
    if (!ids) {
      this.unit = '-1';
      return;
    } 

    ids = ids.split(',');
    let names = this.house.unitnames.replace('NULL', '').split(',');
    // console.log(this.house.unitids);
    // console.log(names);
    let count = 0;
    if (ids.length < names.length) {
      count = ids.length;
    } else {
      count = names.length;
    }

    let arr = [];
    let emptyUnitIDs = [];
    let allUnit = null;
    for(var i=0; i<count; i++) {
      let _id = ids[i];
      if (_id == '') {
        if (emptyUnitIDs.indexOf(_id) != -1) {
          continue;
        } else {
          emptyUnitIDs.push('');
          allUnit = {
            ID: '-1',
            name: ''
          };
        }
      } else {
        arr.push({
          ID: ids[i],
          name: names[i]
        });
      }
    }

    if (allUnit) {
      arr.unshift(allUnit);
    }

    this.units = arr;
    // console.log(arr);

    if (this.units.length > 0) {
      this.unit = this.units[0]['ID'];
    } 
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad HouseInfoPage');
    this.iosFixed.fixedScrollFreeze(this.content);
    this.loadRooms();
  }



  segmentChanged(ev) {
    this.loadRooms();
  }

  loadRooms() {
    this.floors = {};
    this.error = null;
    this.roomsData = [];
    this.api.POST(null, { dotype: 'GetData', 
                          funname: '获取房源房间列表APP', 
                          param1: this.project.id,
                          param2: this.industry.id,
                          param3: this.unit,
                          param4: this.house.building_id
                         })
      .then(data => {
        // console.log(data);
        // console.log('#######');
        if (data && data['data']) {
          // console.log('123');
          // this.error = null;
          this.handleData(data['data']);
        } else {
          // console.log('333333333');
          this.error = '暂无数据';
        }
      })
      .catch(error => {
        this.error = error.message || '服务器出错了';
        // console.log(error);
      });
  }

  handleData(arr) {
    if (arr.length == 0) {
      this.error = '暂无数据';
      return;
    }
    let temp = [];
    arr.forEach(item => {
      const floor = item.floor;
      
      if (item.statenum == '100') {
        item.roomcolor = '#DA9694';
      } else if (item.pushstate == '0') {
        item.roomcolor = '#D9D9D9';
      } else {
        if (item.statenum == '0') {
          item.roomcolor = '#fff';
        } else if (item.statenum == '10') {
          item.roomcolor = 'rgb(167,184,107)';
        } else if (item.statenum == '20') {
          item.roomcolor = '#538DD5';
        } 
      }
      if (this.floors[floor]) {
        this.floors[floor].push(item);
      } else {
        this.floors[floor] = [item];
      }
    });
    
    for (const key in this.floors) {
      if (this.floors.hasOwnProperty(key)) {
        const rooms = this.floors[key];
        temp.push({
          floorno: parseInt(key),
          floor: key + '楼',
          rooms: rooms
        });
      }
    }

    // this.roomsData = temp;
    this.roomsData = temp.sort((b,a) => {
      if (a.floorno < b.floorno) {
        return -1;
      }

      if (a.floorno > b.floorno) {
        return 1;
      }

      return 0;
    });
  }

  selectRoom(room) {
    // console.log(room);
    this.navCtrl.push('HouseDetailPage', { room: room, project: this.project, industry: this.industry });
  }

  formatHouseNumber(room) {
    if (!room.house_number) return '--';
    if (room.house_number.length > 2) return room.house_number;

    var no = parseInt(room.house_number);
    if (no < 10) {
      return `${room.floor}0${no}`;
    } 

    return `${room.floor}${no}`;
  }

  unit: any = '1';

  units: any = [];

  colors: any = [
    {
      ID: '1',
      name: '收盘',
      value: '#D9D9D9',
    },
    {
      ID: '2',
      name: '待售',
      value: '#fff',
    },
    {
      ID: '3',
      name: '销控',
      value: '#DA9694',
    },
    {
      ID: '4',
      name: '认购',
      value: 'rgb(167,184,107)',
    },
    {
      ID: '5',
      name: '签约',
      value: '#538DD5',
    },
  ];

  error: any = null;
  roomsData: any = [];

}
