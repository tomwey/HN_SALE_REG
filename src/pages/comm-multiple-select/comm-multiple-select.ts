import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Content } from 'ionic-angular';
import { iOSFixedScrollFreeze } from '../../provider/iOSFixedScrollFreeze';

/**
 * Generated class for the CommSelectPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-comm-multiple-select',
  templateUrl: 'comm-multiple-select.html',
})
export class CommMultipleSelectPage {

  data: any = [];
  error: any = null;

  selectedItems: any = [];

  keyword: any = '';
  originData: any = [];

  title: any = '请选择';

  singleMode: boolean = false;

  checkAll: boolean = false;

  @ViewChild(Content) content: Content;

  constructor(public navCtrl: NavController,
    private viewCtrl: ViewController,
    private iosFixed: iOSFixedScrollFreeze,
    public navParams: NavParams) {
    this.data = this.navParams.data.data;
    this.title = this.navParams.data.title;
    this.selectedItems = this.navParams.data.selectedItems;

    if (this.data.length == 0) {
      this.error = '暂无数据';
    }

    this.originData = this.data;

    // console.log(this.data);

    this.checkAll = this.navParams.data.checkAll || this.data.length === this.selectedItems.length;

    // hack history back
    // var foo = { cms1: true };
    // history.pushState(foo, "Anything", " ");
  }

  ionViewDidLoad() {
    this.iosFixed.fixedScrollFreeze(this.content);
  }

  selectAll() {
    // console.log(ev);
    if (this.checkAll) {
      this.data.map(element => {
        element.checked = false;
        return element;
      });
      this.checkAll = false;
      this.selectedItems = [];
    } else {
      this.data.map(element => {
        element.checked = true;
        return element;
      });
      this.selectedItems = JSON.parse(JSON.stringify(this.data));
      this.checkAll = true;
    }
  }

  toggle(item) {
    item.checked = !item.checked;
    if (item.checked) {

      this.selectedItems.push(item);
    } else {
      let index = -1;
      for (let i = 0; i < this.selectedItems.length; i++) {
        if (this.selectedItems[i].label === item.label) {
          index = i;
        }
      }

      if (index !== -1) {
        this.selectedItems.splice(index, 1);
      }
    }
    this.checkAll = this.selectedItems.length === this.data.length;
  }

  startSearch(kw) {
    if (kw.trim() == '') {
      this.data = this.originData;
      return;
    }

    this.data = this.originData.filter(item => {
      return item.label.indexOf(kw.trim().toLowerCase()) > -1;
    });
  }

  close() {
    this.viewCtrl.dismiss().catch();
  }

  confirm() {
    console.info(this.selectedItems);
    this.viewCtrl.dismiss({ checkAll: this.checkAll, selectedItems: this.selectedItems });
  }

}
