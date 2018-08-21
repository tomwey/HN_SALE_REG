import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CommSelectPage } from './comm-select';

@NgModule({
  declarations: [
    CommSelectPage,
  ],
  imports: [
    IonicPageModule.forChild(CommSelectPage),
  ],
})
export class CommSelectPageModule {}
