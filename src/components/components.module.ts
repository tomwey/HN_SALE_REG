import { NgModule } from '@angular/core';
import { AccordionListComponent } from './accordion-list/accordion-list';
import { IonicPageModule } from 'ionic-angular/module';
import { ManItemComponent } from './man-item/man-item';
import { PipesModule } from '../pipes/pipes.module';
import { OrderSignItemComponent } from './order-sign-item/order-sign-item';
import { MortgageItemComponent } from './mortgage-item/mortgage-item';

@NgModule({
	declarations: [AccordionListComponent,
    ManItemComponent,
    OrderSignItemComponent,
    MortgageItemComponent],
	imports: [IonicPageModule.forChild([AccordionListComponent]), PipesModule],
	exports: [AccordionListComponent,
    ManItemComponent,
    OrderSignItemComponent,
    MortgageItemComponent]
})
export class ComponentsModule {}
