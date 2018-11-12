import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MortgageDetailPage } from './mortgage-detail';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    MortgageDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(MortgageDetailPage),
    PipesModule,
  ],
})
export class MortgageDetailPageModule {}
