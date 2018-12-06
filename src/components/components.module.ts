import { NgModule } from '@angular/core';
import { AccordionListComponent } from './accordion-list/accordion-list';
import { IonicPageModule } from 'ionic-angular/module';
import { ManItemComponent } from './man-item/man-item';
import { PipesModule } from '../pipes/pipes.module';
import { OrderSignItemComponent } from './order-sign-item/order-sign-item';
import { MortgageItemComponent } from './mortgage-item/mortgage-item';
import { ProjectSelectComponent } from './project-select/project-select';
import { CallPhoneComponent } from './call-phone/call-phone';

@NgModule({
	declarations: [AccordionListComponent,
    ManItemComponent,
    OrderSignItemComponent,
    MortgageItemComponent,
    ProjectSelectComponent,
    CallPhoneComponent],
	imports: [IonicPageModule.forChild([AccordionListComponent]), PipesModule],
	exports: [AccordionListComponent,
    ManItemComponent,
    OrderSignItemComponent,
    MortgageItemComponent,
    ProjectSelectComponent,
    CallPhoneComponent]
})
export class ComponentsModule {}
