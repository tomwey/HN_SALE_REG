import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FollowHistoryPage } from './follow-history';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    FollowHistoryPage,
  ],
  imports: [
    IonicPageModule.forChild(FollowHistoryPage),
    PipesModule,
  ],
})
export class FollowHistoryPageModule {}
