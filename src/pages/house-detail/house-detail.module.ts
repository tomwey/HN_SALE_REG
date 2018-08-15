import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HouseDetailPage } from './house-detail';
import { IonicImageViewerModule } from 'ionic-img-viewer';

@NgModule({
  declarations: [
    HouseDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(HouseDetailPage),
    IonicImageViewerModule,
  ],
})
export class HouseDetailPageModule {}
