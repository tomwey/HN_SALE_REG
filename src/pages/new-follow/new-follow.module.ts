import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewFollowPage } from './new-follow';

@NgModule({
  declarations: [
    NewFollowPage,
  ],
  imports: [
    IonicPageModule.forChild(NewFollowPage),
  ],
})
export class NewFollowPageModule {}
