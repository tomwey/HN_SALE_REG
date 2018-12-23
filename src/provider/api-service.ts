import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, URLSearchParams, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Md5 } from 'ts-md5';
import { Tools } from './Tools';
import 'rxjs/add/operator/timeout';

/*
  Generated class for the ApiService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
// 正式服务器和账号
const API_HOST: string = "http://cys.afterwind.cn/api/v1";
const API_KEY: string = "c2fb2548ed4460dd10c7f62b33d9082e";
const API_SERVER: string = "http://erp20-app.heneng.cn:16681";

// 测试账号和测试服务器
// const API_HOST: string = "http://0.0.0.0:3000/api/v1";
// const API_KEY:  string = "be96ef2e32664eba84fa6b8407fe8bc7";

export interface ResultData {
  code: number,
  total?: number,
  data: any,
}

export interface ErrorData {
  code: number,
  message: string,
}

@Injectable()
export class ApiService {

  count: number = 0;

  constructor(public http: Http, private tools: Tools) {
    // console.log('Hello ApiService Provider');
  }

  // 处理GET请求
  GET(uri, params, loadingText = '加载中...', showLoading = true) {
    if (showLoading) {
      this.showLoading(loadingText);
    }

    let url = API_SERVER + '/' + uri;

    // 获取时间戳
    // let i = new Date().getTime();

    // 组装参数
    let searchParams = new URLSearchParams();

    // 设置安全参数
    // searchParams.set('i', i.toString());
    // searchParams.set('ak', this.generateAccessKey(i));

    // 合并传进来的参数
    for (let param in params) {
      searchParams.set(param, params[param]);
    }

    // 参数签名
    // searchParams.set('sign', ApiService.signParams(params));

    return new Promise((resolve, reject) => {
      this.http.get(url, new RequestOptions({ search: searchParams }))
        .toPromise()
        .then(resp => {
          this.hideLoading();
          // console.log('success');
          let result = this.handleSuccess(resp);
          if (result.code == 0) {
            resolve(result);
            // resolve({ data: result.data, total: result.total });
          } else {
            reject(result);
          }
        })
        .catch(error => {
          this.hideLoading();
          let err = this.handleError(error);
          reject(err);
        });
    });

  } // end get 

  // 发起调查问卷
  SendSurvey(sql, loadingText = '正在加载', showLoading = true) {
    if (showLoading) {
      this.showLoading(loadingText);
    }

    let url = API_SERVER + '/savedata'; //+ '/api';//API_HOST + '/' + uri;

    // 参数签名
    // params.sign = ApiService.signParams(params);

    // // 组装参数
    // let i  = new Date().getTime();
    // let ak = this.generateAccessKey(i);

    // params.i  = i;
    // params.ak = ak; 

    // 封装请求
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let requestOptions = new RequestOptions({ headers: headers });
    return new Promise((resolve, reject) => {
      this.http.post(url, sql, requestOptions)
        .toPromise()
        .then(resp => {
          this.hideLoading();
          // console.log('success');
          let result = this.handleSuccess(resp);
          if (parseInt(result.code) == 0) {
            resolve(result);
            // resolve({ data: result.data, total: result.total });
          } else {
            reject(result);
          }
        })
        .catch(error => {
          this.hideLoading();

          let err = this.handleError(error);
          reject(err);
        });
    });
  } // end post

  // 处理POST请求
  POST(uri, params, loadingText = '正在加载', showLoading = true) {
    if (showLoading) {
      this.showLoading(loadingText);
    }

    let url = API_SERVER; //+ '/api';//API_HOST + '/' + uri;

    // 参数签名
    // params.sign = ApiService.signParams(params);

    // // 组装参数
    // let i  = new Date().getTime();
    // let ak = this.generateAccessKey(i);

    // params.i  = i;
    // params.ak = ak; 

    // 封装请求
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let requestOptions = new RequestOptions({ headers: headers });
    return new Promise((resolve, reject) => {
      this.http.post(url, JSON.stringify(params), requestOptions)
        .timeout(60000)
        .toPromise()
        .then(resp => {
          this.hideLoading();
          // console.log('success');
          let result = this.handleSuccess(resp);
          if (parseInt(result.code) == 0) {
            resolve(result);
            // resolve({ data: result.data, total: result.total });
          } else {
            reject(result);
          }
        })
        .catch(error => {
          this.hideLoading();

          let err = this.handleError(error);
          reject(err);
        });
    });
  } // end post

  // 上传文件
  upload(uri, body: FormData) {
    let url = API_HOST + '/' + uri;

    // 组装参数
    let i = new Date().getTime();
    let ak = this.generateAccessKey(i);

    body.append('i', i.toString());
    body.append('ak', ak);

    // let headers = new Headers({'Content-Type': 'multipart/form-data'});
    return this.http.post(url, body, null)
      .toPromise()
      .then(this.handleSuccess)
      .catch(this.handleError);
  }

  // FormData提交
  POST2(uri, body: FormData, loadingText = '正在提交', showLoading = true) {
    if (showLoading) {
      this.showLoading(loadingText);
    }

    let url = API_SERVER + '/scm';

    // 组装参数
    // let i  = new Date().getTime();
    // let ak = this.generateAccessKey(i);

    // body.append('i', i.toString());
    // body.append('ak', ak);

    // let headers = new Headers({'Content-Type': 'multipart/form-data'});
    // const options = new RequestOptions();
    return new Promise((resolve, reject) => {
      this.http.post(url, body)
        .toPromise()
        .then(resp => {
          this.hideLoading();
          // console.log('success');
          let result = this.handleSuccess(resp);
          if (result.code == 0) {
            resolve(result);
            // resolve({ data: result.data, total: result.total });
          } else {
            reject(result);
          }
        })
        .catch(error => {
          this.hideLoading();

          let err = this.handleError(error);
          reject(err);
        });
    });
    //.then(this.handleSuccess)
    //.catch(this.handleError);
  }

  // 生成MD5
  private generateAccessKey(i): string {
    return Md5.hashStr(API_KEY + i.toString(), false).toString();
  } // end generate access key

  // 处理请求成功的回调
  private handleSuccess(resp: Response): any {
    let body = resp.json();
    // console.log(`result: ${JSON.stringify(body)}`);
    if (parseInt(body.code) == 0) {
      let rd: ResultData = { code: 0, total: body.total || 0, data: body.data || [] };
      return rd;
    } else {
      let errorData: ErrorData = { code: body.code, message: body.msg };
      return errorData;
    }
  } // end handle success

  private handleError(error: Response | any) {
    console.log('###################');
    console.log(error);
    console.log('###################');
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.msg ? error.msg : error.toString();
    }

    let errorData: ErrorData = { code: 500, message: errMsg };
    return errorData;
  } // end handle error 

  static signParams(params: any): string {
    if (!params) return null;
    // console.log(params);
    let signStr = '';
    let keys = Object.keys(params).sort();
    // console.log(`keys:${keys}`);
    if (keys.length == 0) return null;

    keys.forEach(key => {
      let value = params[key];
      // console.log(value + ':' + JSON.stringify(value));
      signStr += value + ':';
    })

    signStr += API_KEY;

    return Md5.hashStr(signStr, false).toString();
  }

  private showLoading(loadingText) {
    // console.log(this.count);
    // if (++this.count === 1) {
    this.tools.showLoading(loadingText);
    // }
  }

  private hideLoading() {
    // console.log('hide');
    // console.log(this.count);
    // if (--this.count === 0) {
    this.tools.hideLoading();
    // }
  }

}
