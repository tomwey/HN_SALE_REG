import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HouseInfoPage } from './house-info';

@NgModule({
  declarations: [
    HouseInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(HouseInfoPage),
  ],
})
export class HouseInfoPageModule {}
