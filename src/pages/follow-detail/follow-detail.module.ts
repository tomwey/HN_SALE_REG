import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FollowDetailPage } from './follow-detail';

@NgModule({
  declarations: [
    FollowDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(FollowDetailPage),
  ],
})
export class FollowDetailPageModule {}
