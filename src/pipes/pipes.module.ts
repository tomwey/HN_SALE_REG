import { NgModule } from '@angular/core';
import { TimeAgoPipe } from './time-ago/time-ago';
import { FormatWanPipe } from './format-wan/format-wan';
import { FormatNullPipe } from './format-null/format-null';
import { FormatDatePipe } from './format-date/format-date';
@NgModule({
	declarations: [TimeAgoPipe,
    FormatWanPipe,
    FormatNullPipe,
    FormatDatePipe],
	imports: [],
	exports: [TimeAgoPipe,
    FormatWanPipe,
    FormatNullPipe,
    FormatDatePipe]
})
export class PipesModule {}
