import { Injectable } from '@angular/core';
import { Md5 } from 'ts-md5';
import * as CryptoJS from 'crypto-js';

declare const Buffer;

const fillKey = (key) => {
  const filledKey = Buffer.alloc(128 / 8);
  const keys = Buffer.from(key);
  let index = 0;
  while (index < filledKey.length) {
    filledKey[index] = keys[index];
    index += 1;
  }

  return filledKey;
}

@Injectable()
export class Utils {

  static params: any = null;
  /**
   * 获取地址栏参数
   * @param name
   * @returns {any}
   */
  static getQueryString(name): string {
    if (!this.params) {
      const encrypted = this._getQueryString('key');

      if (encrypted) {
        let result = this.aesDecrypt(encrypted, 'HN_GroupAES_2018');
        this.params = JSON.parse(result);
      }
      console.log('解析参数');
    } else {
      // console.info('params:', this.params);
      console.log('参数已经解析');
    }

    if (!this.params) {
      return this._getQueryString(name);
    }

    return this.params[name];
  }

  static _getQueryString(name): string {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    let url = decodeURIComponent(window.location.search);
    // let r = window.location.search.substr(1).match(reg);
    let r = url.substr(1).match(reg);
    if (r != null) {
      return r[2]; // 解码参数值
    }
    return '';
  }

  static getRandomString(len): string {
    len = len || 32;
    var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    var maxPos = $chars.length;
    var pwd = '';
    for (var i = 0; i < len; i++) {
      pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
  }

  static md5(string): string {
    return Md5.hashStr(string, false).toString();
  }

  static isWeiXin(): boolean {
    let ua = window.navigator.userAgent.toLowerCase();
    let results: RegExpMatchArray = ua.match(/MicroMessenger/i);
    if (results && results.toString() == 'micromessenger') {
      return true;
    } else {
      return false;
    }
  }

  /**
   * 日期对象转为日期字符串
   * @param date 需要格式化的日期对象
   * @param sFormat 输出格式,默认为yyyy-MM-dd                        年：y，月：M，日：d，时：h，分：m，秒：s
   * @example  dateFormat(new Date())                               "2017-02-28"
   * @example  dateFormat(new Date(),'yyyy-MM-dd')                  "2017-02-28"
   * @example  dateFormat(new Date(),'yyyy-MM-dd HH:mm:ss')         "2017-02-28 13:24:00"   ps:HH:24小时制
   * @example  dateFormat(new Date(),'yyyy-MM-dd hh:mm:ss')         "2017-02-28 01:24:00"   ps:hh:12小时制
   * @example  dateFormat(new Date(),'hh:mm')                       "09:24"
   * @example  dateFormat(new Date(),'yyyy-MM-ddTHH:mm:ss+08:00')   "2017-02-28T13:24:00+08:00"
   * @example  dateFormat(new Date('2017-02-28 13:24:00'),'yyyy-MM-ddTHH:mm:ss+08:00')   "2017-02-28T13:24:00+08:00"
   * @returns {string}
   */
  static dateFormat(date: Date, sFormat: String = 'yyyy-MM-dd'): string {
    let time = {
      Year: 0,
      TYear: '0',
      Month: 0,
      TMonth: '0',
      Day: 0,
      TDay: '0',
      Hour: 0,
      THour: '0',
      hour: 0,
      Thour: '0',
      Minute: 0,
      TMinute: '0',
      Second: 0,
      TSecond: '0',
      Millisecond: 0
    };
    time.Year = date.getFullYear();
    time.TYear = String(time.Year).substr(2);
    time.Month = date.getMonth() + 1;
    time.TMonth = time.Month < 10 ? "0" + time.Month : String(time.Month);
    time.Day = date.getDate();
    time.TDay = time.Day < 10 ? "0" + time.Day : String(time.Day);
    time.Hour = date.getHours();
    time.THour = time.Hour < 10 ? "0" + time.Hour : String(time.Hour);
    time.hour = time.Hour < 13 ? time.Hour : time.Hour - 12;
    time.Thour = time.hour < 10 ? "0" + time.hour : String(time.hour);
    time.Minute = date.getMinutes();
    time.TMinute = time.Minute < 10 ? "0" + time.Minute : String(time.Minute);
    time.Second = date.getSeconds();
    time.TSecond = time.Second < 10 ? "0" + time.Second : String(time.Second);
    time.Millisecond = date.getMilliseconds();

    return sFormat.replace(/yyyy/ig, String(time.Year))
      .replace(/yyy/ig, String(time.Year))
      .replace(/yy/ig, time.TYear)
      .replace(/y/ig, time.TYear)
      .replace(/MM/g, time.TMonth)
      .replace(/M/g, String(time.Month))
      .replace(/dd/ig, time.TDay)
      .replace(/d/ig, String(time.Day))
      .replace(/HH/g, time.THour)
      .replace(/H/g, String(time.Hour))
      .replace(/hh/g, time.Thour)
      .replace(/h/g, String(time.hour))
      .replace(/mm/g, time.TMinute)
      .replace(/m/g, String(time.Minute))
      .replace(/ss/ig, time.TSecond)
      .replace(/s/ig, String(time.Second))
      .replace(/fff/ig, String(time.Millisecond))
  }

  static dateDiff(date) {//di作为一个变量传进来
    //如果时间格式是正确的，那下面这一步转化时间格式就可以不用了
    var dateBegin = new Date(date.replace(/-/g, "/"));//将-转化为/，使用new Date
    var dateEnd = new Date();//获取当前时间
    var dateDiff = dateBegin.getTime() - dateEnd.getTime();//时间差的毫秒数
    var dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000));//计算出相差天数
    var leave1 = dateDiff % (24 * 3600 * 1000)    //计算天数后剩余的毫秒数
    var hours = Math.floor(leave1 / (3600 * 1000))//计算出小时数
    //计算相差分钟数
    var leave2 = leave1 % (3600 * 1000)    //计算小时数后剩余的毫秒数
    var minutes = Math.floor(leave2 / (60 * 1000))//计算相差分钟数
    //计算相差秒数
    var leave3 = leave2 % (60 * 1000)      //计算分钟数后剩余的毫秒数
    var seconds = Math.round(leave3 / 1000)
    return { days: dayDiff, hours: hours, minutes: minutes, seconds: seconds, mseconds: dateDiff };
  }

  static formatMoney(money) {
    if (money && money != null) {
      money = String(money);
      let left = money.split('.')[0], right = money.split('.')[1];
      right = right ? (right.length >= 2 ? '.' + right.substr(0, 2) : '.' + right + '0') : '.00';
      let temp = left.split('').reverse().join('').match(/(\d{1,3})/g);
      return (Number(money) < 0 ? "-" : "") + temp.join(',').split('').reverse().join('') + right;
    } else if (money === 0) {   //注意===在这里的使用，如果传入的money为0,if中会将其判定为boolean类型，故而要另外做===判断
      return '0.00';
    } else {
      return "";
    }
  }

  static aesEncrypt(string, key) {
    if (!string || !key) return null;
    key = CryptoJS.enc.Utf8.parse(fillKey(key));
    return CryptoJS.AES.encrypt(string, key, {
      iv: '',
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    }).ciphertext.toString();
  }

  static aesDecrypt(string, key) {
    if (!string || !key) return null;
    // console.log(CryptoJS.enc);
    key = CryptoJS.enc.Utf8.parse(fillKey(key));
    let bytes = CryptoJS.AES.decrypt(CryptoJS.enc.Base64.stringify(CryptoJS.enc.Hex.parse(string)), key, {
      iv: '',
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    return bytes.toString(CryptoJS.enc.Utf8);
  }

}