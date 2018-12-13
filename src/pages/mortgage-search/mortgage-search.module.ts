import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MortgageSearchPage } from './mortgage-search';

@NgModule({
  declarations: [
    MortgageSearchPage,
  ],
  imports: [
    IonicPageModule.forChild(MortgageSearchPage),
  ],
})
export class MortgageSearchPageModule {}
