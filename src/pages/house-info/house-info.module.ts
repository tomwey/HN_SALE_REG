import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HouseInfoPage } from './house-info';
import { VirtualScrollerModule } from 'ngx-virtual-scroller';

@NgModule({
  declarations: [
    HouseInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(HouseInfoPage),
    VirtualScrollerModule
  ],
})
export class HouseInfoPageModule { }
