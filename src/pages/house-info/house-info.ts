import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HouseInfoPage');
  }

  segmentChanged(ev) {

  }

  GetColor(room) {
    // this.colors.forEach(element => {
    //   console.log(element);
    //   if (element.ID == room.state) {
    //     return element.value;
    //   }
    // });
    // return null;
    let index = parseInt(room.state) - 1;
    return this.colors[index].value;
  }

  selectRoom(room) {
    // console.log(room);
    this.navCtrl.push('HouseDetailPage', room);
  }

  unit: any = '1';

  units: any = [
    {
      ID: '1',
      name: '一单元'
    },
    {
      ID: '2',
      name: '二单元'
    },
    {
      ID: '3',
      name: '三单元'
    },
  ];

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

  roomsData: any = [
    {
      floor: '10楼',
      rooms: [
        {
          name: '1001',
          state: '2',
        },
        {
          name: '1002',
          state: '3',
        },
        {
          name: '1003',
          state: '1',
        },
        {
          name: '1004',
          state: '2',
        },
        {
          name: '1005',
          state: '2',
        },
      ],
    },
    {
      floor: '9楼',
      rooms: [
        {
          name: '901',
          state: '1',
        },
        {
          name: '902',
          state: '2',
        },
        {
          name: '903',
          state: '3',
        },
        {
          name: '904',
          state: '2',
        },
        {
          name: '905',
          state: '4',
        },
        {
          name: '906',
          state: '4',
        },
      ],
    },

    {
      floor: '8楼',
      rooms: [
        {
          name: '801',
          state: '1',
        },
        {
          name: '802',
          state: '2',
        },
        {
          name: '803',
          state: '3',
        },
        // {
        //   name: '804',
        //   state: '2',
        // },
        // {
        //   name: '805',
        //   state: '4',
        // },
      ],
    },
    
  ];

}
