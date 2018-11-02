import { NgModule } from '@angular/core';
import { AccordionListComponent } from './accordion-list/accordion-list';
import { IonicPageModule } from 'ionic-angular/module';

@NgModule({
	declarations: [AccordionListComponent],
	imports: [IonicPageModule.forChild([AccordionListComponent])],
	exports: [AccordionListComponent]
})
export class ComponentsModule {}
