import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the CalculatorPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-calculator',
  templateUrl: 'calculator.html',
})
export class CalculatorPage {

  loanType: any = '0';

  formData: any = {
    calcType: '0',
    houseTotal: 0,
    loanRatio: '7',
    loanTotal: 0,
    loanYear: '30',
    // loanRate: '0',
    gjjTotal: 0,
    gjjRate: '1',
    sdTotal: 0,
    sdRate: '1',
  };

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad CalculatorPage');
  }

  calculate() {
    
  }

  reset() {
    this.formData = {
      calcType: '0',
      houseTotal: 0,
      loanRatio: '7',
      loanTotal: 0,
      loanYear: '30',
      gjjTotal: 0,
      gjjRate: '1',
      sdTotal: 0,
      sdRate: '1',
    };
  }

  loanTypes: any = [
    {
      label: '商业贷款',
      value: '0'
    },
    {
      label: '公积金贷款',
      value: '1'
    },
    {
      label: '组合贷款',
      value: '2'
    }
  ];

  loanRatios: any = [
    {
      label: '7成',
      value: '7'
    },
    {
      label: '6成',
      value: '6'
    },
    {
      label: '5成',
      value: '5'
    },
    {
      label: '4成',
      value: '4'
    },
    {
      label: '3成',
      value: '3'
    },
    {
      label: '2成',
      value: '2'
    },
  ];

  calcTypes: any = [
    {
      label: '按贷款总价',
      value: '0'
    },
    {
      label: '按房屋总价',
      value: '1'
    },
  ];

  sdRates: any = [
    {
      label: '最新基准利率(4.9%)',
      value: '1'
    },
    {
      label: '最新基准利率9.5折',
      value: '0.95'
    },
    {
      label: '最新基准利率9折',
      value: '0.9'
    },
    {
      label: '最新基准利率8.8折',
      value: '0.88'
    },
    {
      label: '最新基准利率8.5折',
      value: '0.85'
    },
    {
      label: '最新基准利率8折',
      value: '0.8'
    },
    {
      label: '最新基准利率7.5折',
      value: '0.75'
    },
    {
      label: '最新基准利率7折',
      value: '0.7'
    },
    {
      label: '最新基准利率1.05倍',
      value: '1.05'
    },
    {
      label: '最新基准利率1.1倍',
      value: '1.1'
    },
    {
      label: '最新基准利率1.2倍',
      value: '1.2'
    },
    {
      label: '最新基准利率1.3倍',
      value: '1.3'
    },
  ];

  gjjRates: any = [
    {
      label: '最新基准利率(3.25%)',
      value: '1'
    },
    {
      label: '最新基准利率1.1倍',
      value: '1.1'
    },
    {
      label: '最新基准利率1.2倍',
      value: '1.2'
    },];

  loanYears: any = [
    {
      label: '30年',
      value: '30'
    },
    {
      label: '25年',
      value: '25'
    },
    {
      label: '20年',
      value: '20'
    },
    {
      label: '15年',
      value: '15'
    },
    {
      label: '10年',
      value: '10'
    },
    {
      label: '5年',
      value: '5'
    },
  ];
}
