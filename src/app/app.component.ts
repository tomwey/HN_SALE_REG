import { Component } from '@angular/core';
import { Platform, IonicApp } from 'ionic-angular';
import { HomePage } from '../pages/home/home';
// import { StatusBar } from '@ionic-native/status-bar';
// import { SplashScreen } from '@ionic-native/splash-screen';
// import { TabsPage } from '../pages/tabs/tabs';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = HomePage;

  constructor(
    platform: Platform,
    private _ionicApp: IonicApp
    // statusBar: StatusBar, 
    // splashScreen: SplashScreen
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      // statusBar.styleDefault();
      // splashScreen.hide();

    });
    this.backButtonListener();
  }

  backButtonListener(): void {
    window.onpopstate = (evt) => {
      let activePortal = this._ionicApp._loadingPortal.getActive() ||
        this._ionicApp._modalPortal.getActive() ||
        this._ionicApp._toastPortal.getActive() ||
        this._ionicApp._overlayPortal.getActive();
      // console.log(activePortal);
      if (activePortal) {
        activePortal.dismiss();
        return;
      }
    }
  }
}

