import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule } from '@angular/http';

import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { Utils } from '../provider/Utils';
import { PipesModule } from '../pipes/pipes.module';
import { ApiService } from '../provider/api-service';
import { Tools } from '../provider/Tools';
import { TabsPage } from '../pages/tabs/tabs';
import { VistorsQueryPage } from '../pages/vistors-query/vistors-query';
import { HouseQueryPage } from '../pages/house-query/house-query';
import { MyCustomerPage } from '../pages/my-customer/my-customer';
import { IonicImageViewerModule } from 'ionic-img-viewer';

@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    VistorsQueryPage,
    HouseQueryPage,
    MyCustomerPage,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp, {
      mode: 'ios',
      backButtonText: '',
    }),
    PipesModule,
    IonicImageViewerModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    VistorsQueryPage,
    HouseQueryPage,
    MyCustomerPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Utils,
    ApiService,
    Tools,
  ]
})
export class AppModule {}
