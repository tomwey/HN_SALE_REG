import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PaymoneyListPage } from './paymoney-list';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    PaymoneyListPage,
  ],
  imports: [
    IonicPageModule.forChild(PaymoneyListPage),
    PipesModule
  ],
})
export class PaymoneyListPageModule { }
