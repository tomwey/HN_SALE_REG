import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CalcResultPage } from './calc-result';

@NgModule({
  declarations: [
    CalcResultPage,
  ],
  imports: [
    IonicPageModule.forChild(CalcResultPage),
  ],
})
export class CalcResultPageModule {}
