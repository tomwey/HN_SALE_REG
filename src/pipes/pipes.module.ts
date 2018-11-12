import { NgModule } from '@angular/core';
import { TimeAgoPipe } from './time-ago/time-ago';
import { FormatWanPipe } from './format-wan/format-wan';
import { FormatNullPipe } from './format-null/format-null';
@NgModule({
	declarations: [TimeAgoPipe,
    FormatWanPipe,
    FormatNullPipe],
	imports: [],
	exports: [TimeAgoPipe,
    FormatWanPipe,
    FormatNullPipe]
})
export class PipesModule {}
