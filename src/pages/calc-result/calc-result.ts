import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the CalcResultPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-calc-result',
  templateUrl: 'calc-result.html',
})
export class CalcResultPage {

  loanData: any;
  calcLoanData: any = [];

  distMoney: any = null;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.loanData = this.navParams.data;
    // console.log(this.loanData);
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad CalcResultPage');
    this.startCalc();
  }

  segmentChanged(ev) {
    this.startCalc();
  }

  startCalc() {
    let loanTotal = 0, backTotal = 0, lxTotal = 0, monthBack = 0; // 贷款总额，还款总额，利息总额，月还款
    let months = this.loanData.loanYear * 12;
    loanTotal = this.loanData.loanTotal;

    if (this.loanData.loanType === '2') {
      // 组合贷款

      if (this.calcType === '0') {
        // 等额本息
        monthBack = this.getBXMonthMoney(this.loanData.sdRate, this.loanData.sdTotal * 10000.0, months) +
          this.getBXMonthMoney(this.loanData.gjjRate, this.loanData.gjjTotal * 10000.0, months);
        backTotal = monthBack * months;
        backTotal = Math.round(backTotal * 100) / 100;

        lxTotal = Math.round((backTotal - loanTotal * 10000.0) * 100) / 100;
      } else {
        // 等额本金
        for (let i = 0; i < months; i++) {
          let currMoneyBack = this.getBJMonthMoney(this.loanData.sdRate,
            this.loanData.sdTotal * 10000.0, months, i) +
            this.getBJMonthMoney(this.loanData.gjjRate, this.loanData.gjjTotal * 10000.0, months, i);
          backTotal += currMoneyBack;
          if (i === 0) {
            monthBack = Math.round(currMoneyBack * 100) / 100;
          } else if (i === 1) {
            this.distMoney = Math.round(100 * (monthBack - currMoneyBack)) / 100
          }
        }

        backTotal = Math.round(backTotal * 100) / 100;
        lxTotal = Math.round((backTotal - loanTotal * 10000.0) * 100) / 100
      }
    } else {
      // 其它
      let currRate = this.loanData.loanType === '0' ? this.loanData.sdRate : this.loanData.gjjRate;

      if (this.calcType === '0') {
        // 等额本息
        monthBack = this.getBXMonthMoney(currRate, loanTotal * 10000.0, months)
        backTotal = monthBack * months;
        lxTotal = Math.round((backTotal - loanTotal * 10000.0) * 100) / 100;
      } else {
        // 等额本金

        for (let i = 0; i < months; i++) {
          let currBackMoney = this.getBJMonthMoney(currRate,
            loanTotal * 10000.0, months, i);
          backTotal += currBackMoney;
          if (i === 0) {
            monthBack = Math.round(currBackMoney * 100) / 100;
          } else if (i === 1) {
            this.distMoney = Math.round(100 * (monthBack - currBackMoney)) / 100;
          }
        }

        backTotal = Math.round(backTotal * 100) / 100;
        lxTotal = Math.round((backTotal - loanTotal * 10000.0) * 100) / 100
      }

      // console.log(monthBack);
    }

    let temp = [];
    if (this.loanData.houseTotal) {
      temp.push({ label: '房屋总价', value: `${this.loanData.houseTotal}万` });
    }

    if (this.loanData.loanType === '2') {
      // 组合贷款
      temp.push({ label: '商贷利率', value: `${this.loanData.sdRate * 100}%` });
      temp.push({ label: '公积金利率', value: `${this.loanData.gjjRate * 100}%` });
    } else {
      if (this.loanData.loanType === '0') {
        // 商贷
        temp.push({ label: '商贷利率', value: `${this.loanData.sdRate * 100}%` });
      } else {
        temp.push({ label: '公积金利率', value: `${this.loanData.gjjRate * 100}%` });
      }
    }
    temp.push({ label: '贷款总额', value: `${loanTotal}万` });
    if (this.loanData.loanType === '2') {
      temp.push({ label: '商业贷款', value: `${this.loanData.sdTotal}万` });
      temp.push({ label: '公积金贷款', value: `${this.loanData.gjjTotal}万` });
    }
    temp.push({ label: '还款总额', value: `${(backTotal / 10000.0).toFixed(1)}万` });
    temp.push({ label: '支付利息', value: `${(lxTotal / 10000.0).toFixed(1)}万` });
    temp.push({ label: '贷款月数', value: `${months}月` });
    if (this.calcType === '0') {
      temp.push({ label: '每月还款', value: `${monthBack.toFixed(2)}元` });
    } else {
      temp.push({ label: '首月还款', value: `${monthBack.toFixed(2)}元` });
    }

    this.calcLoanData = temp;
    // console.log(temp);
  }

  // 计算等额本息月还款
  getBXMonthMoney(yearRate, loanTotal, totalMonth) {
    // console.log(yearRate);
    // console.log(loanTotal);
    // console.log(totalMonth);
    var monthRate = yearRate / 12.0;//月利率
    // console.log(monthRate);

    return loanTotal * monthRate * Math.pow(1 + monthRate, totalMonth) /
      (Math.pow(1 + monthRate, totalMonth) - 1);
  }

  // 计算等额本金月还款
  getBJMonthMoney(yearRate, loanTotal, totalMonth, currMonth) {
    var monthRate = yearRate / 12.0; //月利率
    var bjMoney = parseFloat(loanTotal) / totalMonth; // 本金
    return (loanTotal - bjMoney * currMonth) * monthRate + bjMoney;
  }

  calcTypes: any = [
    {
      label: '等额本息',
      value: '0'
    },
    {
      label: '等额本金',
      value: '1'
    },
  ];
  calcType: any = '0';

}
