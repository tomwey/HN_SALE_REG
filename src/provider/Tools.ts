import { Injectable } from '@angular/core';
import { ToastController, LoadingController, Loading } from 'ionic-angular';

@Injectable()
export class Tools {

    private loading: Loading;
    // private loadingIsOpen: boolean = false;
  
    constructor(private toastCtrl: ToastController,
                private loadingCtrl: LoadingController) {
      // console.log('Hello ToolService Provider');
    }

    /**
    * 显示提示信息
    * @param message 信息内容
    * @param duration 显示时长
    */
    showToast(message: string = '操作完成', duration: number = 2000): void {
        this.toastCtrl.create({
        message: message,
        duration: duration,
        position: 'middle',
        showCloseButton: false
        }).present();
    }

    /**
     * 显示Loading
     * @param content 显示的内容
     */
    showLoading(content: string = ''): void {
        // if ( !this.loadingIsOpen ) {
        // this.loadingIsOpen = true;
        // this.loading = this.loadingCtrl.create({
        //     content: content,
        //     spinner: 'crescent',
        // });
        // this.loading.present();
        //     setTimeout( () => {
        //         this.hideLoading();
        //     }, 10000 ) // 最长显示10秒
        // }
        if (!this.loading) {
            let loading = this.loadingCtrl.create({
                content: content,
                spinner: 'ios'//'crescent',
            });
            loading.present();
            this.loading = loading;
        }
    }

    /**
     * 关闭Loading
     */
    hideLoading(): void {
        // setTimeout(() => {//延迟200毫秒可以避免嵌套请求loading重复打开和关闭
        this.loading && this.loading.dismiss().catch(error => {
            console.log(`loading error: ${JSON.stringify(error)}`);
        });
        this.loading = null;
        // }, 200);
    }

}