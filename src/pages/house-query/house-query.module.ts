import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HouseQueryPage } from './house-query';
import { ComponentsModule } from '../../components/components.module';
// import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    HouseQueryPage,
  ],
  imports: [
    IonicPageModule.forChild(HouseQueryPage),
    ComponentsModule
    // PipesModule,
  ],
})
export class HouseQueryPageModule {}
