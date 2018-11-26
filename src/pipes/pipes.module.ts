import { NgModule } from '@angular/core';
import { TimeAgoPipe } from './time-ago/time-ago';
import { FormatWanPipe } from './format-wan/format-wan';
import { FormatNullPipe } from './format-null/format-null';
import { FormatDatePipe } from './format-date/format-date';
import { HackMobilePipe } from './hack-mobile/hack-mobile';
@NgModule({
	declarations: [TimeAgoPipe,
    FormatWanPipe,
    FormatNullPipe,
    FormatDatePipe,
    HackMobilePipe],
	imports: [],
	exports: [TimeAgoPipe,
    FormatWanPipe,
    FormatNullPipe,
    FormatDatePipe,
    HackMobilePipe]
})
export class PipesModule {}
