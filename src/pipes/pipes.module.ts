import { NgModule } from '@angular/core';
import { TimeAgoPipe } from './time-ago/time-ago';
import { FormatWanPipe } from './format-wan/format-wan';
@NgModule({
	declarations: [TimeAgoPipe,
    FormatWanPipe],
	imports: [],
	exports: [TimeAgoPipe,
    FormatWanPipe]
})
export class PipesModule {}
