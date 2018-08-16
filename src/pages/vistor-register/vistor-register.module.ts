import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VistorRegisterPage } from './vistor-register';

@NgModule({
  declarations: [
    VistorRegisterPage,
  ],
  imports: [
    IonicPageModule.forChild(VistorRegisterPage),
  ],
})
export class VistorRegisterPageModule {}
