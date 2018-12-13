import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Content } from 'ionic-angular';
import { iOSFixedScrollFreeze } from '../../provider/iOSFixedScrollFreeze';

/**
 * Generated class for the TreeSelectPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tree-select',
  templateUrl: 'tree-select.html',
})
export class TreeSelectPage {

  title: any;
  data: any;

  keyword: any = '';

  parents: any = [];

  selectedItems: any = [];

  @ViewChild(Content) content: Content;

  constructor(public navCtrl: NavController,
    private viewCtrl: ViewController,
    private iosFixed: iOSFixedScrollFreeze,
    public navParams: NavParams) {
    this.data = this.navParams.data.data;
    this.title = this.navParams.data.title;

    this.selectedItems = this.navParams.data.selectedItems || [];
    // console.log(this.selectedItems);
    this.prepareData();

    // hack history back
    // var foo = { ts1: true };
    // history.pushState(foo, "treeselect", " ");
  }

  prepareData() {
    let temp = [];
    this.data.forEach(item => {
      if (item.dic_pid == 0) {
        item.children = [];
        this.parents.push(item);
      } else {
        for (var i = 0; i < this.parents.length; i++) {
          if (this.parents[i].dic_id == item.dic_pid) {
            this.parents[i].children.push(item);
            item.parent = this.parents[i];
            for (var j = 0; j < this.selectedItems.length; j++) {
              const obj = this.selectedItems[j];
              if (obj.dic_id === item.dic_id) {
                item.checked = true;
                temp.push(item);
                break;
              }
            }
            break;
          }
        }
      }
    });

    this.selectedItems = temp;
  }

  ionViewDidLoad() {
    this.iosFixed.fixedScrollFreeze(this.content);
    // console.log('ionViewDidLoad TreeSelectPage');
  }

  selectedItem(ev, item) {
    // console.log(ev);
    // console.log(item);

    if (!ev.checked) {
      // const index = this.selectedParents.indexOf(item.parent);
      const index = this.selectedItems.indexOf(item);
      if (index != -1) {
        this.selectedItems.splice(index, 1);
      }

      // this.selectedItems.splice(index, 1);
      // if (index != -1) {
      //   const items = item.parent.selectedItems || [];
      //   const idx = items.indexOf(item);
      //   if (idx != -1) {
      //     items.splice(idx, 1);
      //   }

      //   if (items.length == 0) {
      //     this.selectedParents.splice(index, 1);
      //   } else {
      //     item.parent.selectedItems = items;
      //   }
      // }
    } else {
      this.selectedItems.push(item);
    }

    // console.log(this.selectedItems);
  }

  close() {
    this.viewCtrl.dismiss().catch();
  }

  done() {
    this.viewCtrl.dismiss(this.selectedItems).catch();
  }

  startSearch(kw) {

  }

  expandItem(item) {

    this.parents.map((listItem) => {

      if (item == listItem) {
        listItem.expanded = !listItem.expanded;
      } else {
        // listItem.expanded = false;
      }

      return listItem;

    });

  }

}
