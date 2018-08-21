import { Injectable } from '@angular/core';
import { Content, Platform } from 'ionic-angular';

@Injectable()
export class iOSFixedScrollFreeze {


  constructor(private platform: Platform) {

  }

  fixedScrollFreeze(content: Content) {
    if (this.platform.is('mobileweb') && this.platform.is('ios')) {
      const scrollElement = content.getScrollElement();
      
      scrollElement.scrollTo(0, 1);

      content.ionScrollEnd.subscribe(evt => {
        if ((content.contentHeight + 1) < scrollElement.scrollHeight) {

          if (scrollElement.scrollTop === 0) {
            scrollElement.scrollTo(0, 1);
          }
          else if ((scrollElement.scrollTop + content.contentHeight) === scrollElement.scrollHeight) {
            scrollElement.scrollTo(0, (scrollElement.scrollTop - 1));
          }
        };
      });
    }
  }

}