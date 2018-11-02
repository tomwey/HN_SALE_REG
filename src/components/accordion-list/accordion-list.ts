import { Component, Input, ViewChild, ElementRef, Renderer } from '@angular/core';

/**
 * Generated class for the AccordionListComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'accordion-list',
  templateUrl: 'accordion-list.html'
})
export class AccordionListComponent {

  @ViewChild('wrapper', { read: ElementRef }) wrapper;
  @Input('expanded') expanded;
  @Input('expandedHeight') expandedHeight;

  constructor(public renderer: Renderer) {
    
  }

  ngAfterViewInit() {
    if (this.expandedHeight) {
      this.renderer.setElementStyle(this.wrapper.nativeElement, 
          'height', this.expandedHeight + 'px');
    }
  }

}
