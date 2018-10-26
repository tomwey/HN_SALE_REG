import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MortgageDetailPage } from './mortgage-detail';

@NgModule({
  declarations: [
    MortgageDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(MortgageDetailPage),
  ],
})
export class MortgageDetailPageModule {}
