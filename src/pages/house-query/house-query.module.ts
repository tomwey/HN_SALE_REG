import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HouseQueryPage } from './house-query';
// import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    HouseQueryPage,
  ],
  imports: [
    IonicPageModule.forChild(HouseQueryPage),
    // PipesModule,
  ],
})
export class HouseQueryPageModule {}
