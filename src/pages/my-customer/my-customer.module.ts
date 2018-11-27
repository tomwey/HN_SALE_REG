import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyCustomerPage } from './my-customer';
import { PipesModule } from '../../pipes/pipes.module';
import { ComponentsModule } from '../../components/components.module';

@NgModule({
  declarations: [
    MyCustomerPage,
  ],
  imports: [
    IonicPageModule.forChild(MyCustomerPage),
    PipesModule,
    ComponentsModule,
  ],
})
export class MyCustomerPageModule {}
