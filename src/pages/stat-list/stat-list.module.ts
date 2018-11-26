import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StatListPage } from './stat-list';
import { ComponentsModule } from '../../components/components.module';
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    StatListPage,
  ],
  imports: [
    IonicPageModule.forChild(StatListPage),
    ComponentsModule,
    PipesModule,
  ],
})
export class StatListPageModule {}
