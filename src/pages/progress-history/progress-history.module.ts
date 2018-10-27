import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProgressHistoryPage } from './progress-history';

@NgModule({
  declarations: [
    ProgressHistoryPage,
  ],
  imports: [
    IonicPageModule.forChild(ProgressHistoryPage),
  ],
})
export class ProgressHistoryPageModule {}
