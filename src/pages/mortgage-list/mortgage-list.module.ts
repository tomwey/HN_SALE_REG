import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MortgageListPage } from './mortgage-list';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    MortgageListPage,
  ],
  imports: [
    IonicPageModule.forChild(MortgageListPage),
    PipesModule,
  ],
})
export class MortgageListPageModule {}
