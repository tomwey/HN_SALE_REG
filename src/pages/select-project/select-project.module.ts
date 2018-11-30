import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SelectProjectPage } from './select-project';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    SelectProjectPage,
  ],
  imports: [
    IonicPageModule.forChild(SelectProjectPage),
    ComponentsModule
  ],
})
export class SelectProjectPageModule {}
