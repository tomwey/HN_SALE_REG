import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyCustomerPage } from './my-customer';
import { PipesModule } from '../../pipes/pipes.module';
import { ComponentsModule } from '../../components/components.module';
import { VirtualScrollerModule } from 'ngx-virtual-scroller';

@NgModule({
  declarations: [
    MyCustomerPage,
  ],
  imports: [
    IonicPageModule.forChild(MyCustomerPage),
    PipesModule,
    ComponentsModule,
    VirtualScrollerModule,
  ],
})
export class MyCustomerPageModule { }
