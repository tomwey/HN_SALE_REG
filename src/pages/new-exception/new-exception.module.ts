import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewExceptionPage } from './new-exception';

@NgModule({
  declarations: [
    NewExceptionPage,
  ],
  imports: [
    IonicPageModule.forChild(NewExceptionPage),
  ],
})
export class NewExceptionPageModule {}
