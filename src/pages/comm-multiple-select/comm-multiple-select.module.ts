import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CommMultipleSelectPage } from './comm-multiple-select';

@NgModule({
  declarations: [
    CommMultipleSelectPage,
  ],
  imports: [
    IonicPageModule.forChild(CommMultipleSelectPage),
  ],
})
export class CommMultipleSelectPageModule { }
