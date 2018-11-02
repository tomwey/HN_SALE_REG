import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TreeSelectPage } from './tree-select';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    TreeSelectPage,
  ],
  imports: [
    IonicPageModule.forChild(TreeSelectPage),
    ComponentsModule,
  ],
})
export class TreeSelectPageModule {}
