import { NgModule } from '@angular/core';
import { AccordionListComponent } from './accordion-list/accordion-list';
import { IonicPageModule } from 'ionic-angular/module';
import { ManItemComponent } from './man-item/man-item';
import { PipesModule } from '../pipes/pipes.module';

@NgModule({
	declarations: [AccordionListComponent,
    ManItemComponent],
	imports: [IonicPageModule.forChild([AccordionListComponent]), PipesModule],
	exports: [AccordionListComponent,
    ManItemComponent]
})
export class ComponentsModule {}
