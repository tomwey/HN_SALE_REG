import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FollowHistoryPage } from './follow-history';

@NgModule({
  declarations: [
    FollowHistoryPage,
  ],
  imports: [
    IonicPageModule.forChild(FollowHistoryPage),
  ],
})
export class FollowHistoryPageModule {}
