import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VistorsQueryPage } from './vistors-query';
// import { ComponentsModule } from '../../components/components.module';
// import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  declarations: [
    VistorsQueryPage,
  ],
  imports: [
    IonicPageModule.forChild(VistorsQueryPage),
    // ComponentsModule,
    // PipesModule
  ],
})
export class VistorsQueryPageModule {}
