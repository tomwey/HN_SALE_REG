import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SourceChangePage } from './source-change';

@NgModule({
  declarations: [
    SourceChangePage,
  ],
  imports: [
    IonicPageModule.forChild(SourceChangePage),
  ],
})
export class SourceChangePageModule {}
