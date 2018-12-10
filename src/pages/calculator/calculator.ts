import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Content } from 'ionic-angular';
import { Tools } from '../../provider/Tools';
import { iOSFixedScrollFreeze } from '../../provider/iOSFixedScrollFreeze';

/**
 * Generated class for the CalculatorPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

const SD_FIXED_RATE = 0.049;
const GJJ_FIXED_RATE = 0.0325;

@IonicPage()
@Component({
  selector: 'page-calculator',
  templateUrl: 'calculator.html',
})
export class CalculatorPage {

  loanType: any = '0';

  formData: any = {
    calcType: '0',
    houseTotal: '',
    loanRatio: '7',
    loanRatioName: '7成',
    loanTotal: '',
    loanYear: '30',
    loanYearName: '30年',
    // loanRate: '0',
    gjjTotal: '',
    gjjRate: '1',
    gjjRateName: '最新基准利率(3.25%)',
    sdTotal: '',
    sdRate: '1',
    sdRateName: '最新基准利率(4.9%)',
  };

  @ViewChild(Content) content: Content;

  constructor(public navCtrl: NavController,
    private tools: Tools,
    private iosFixed: iOSFixedScrollFreeze,
    private modalCtrl: ModalController,
    public navParams: NavParams) {
    if (this.navParams.data.calcType) {
      this.formData.calcType = this.navParams.data.calcType;
    }

    if (this.navParams.data.houseTotal) {
      this.formData.houseTotal = this.navParams.data.houseTotal;
    }

    if (this.formData.calcType === '1') {
      this.calcLoanTotal();
    }
  }

  ionViewDidLoad() {
    this.iosFixed.fixedScrollFreeze(this.content);
    // console.log('ionViewDidLoad CalculatorPage');
  }

  calculate() {
    let params = {
      loanType: this.loanType,
      loanTypename: this.loanTypes[parseInt(this.loanType)]['label'],
      loanTotal: parseInt(this.formData.loanTotal),
      sdTotal: parseInt(this.formData.sdTotal),
      gjjTotal: parseInt(this.formData.gjjTotal),
      sdRate: Math.round(10000 * parseFloat(this.formData.sdRate) * SD_FIXED_RATE) / 10000,
      gjjRate: Math.round(10000 * parseFloat(this.formData.gjjRate) * GJJ_FIXED_RATE) / 10000,
      loanYear: parseInt(this.formData.loanYear)
    };

    const houseTotal = this.formData.houseTotal || 0;
    const loanTotal = this.formData.loanTotal || 0;

    if (this.formData.calcType === '1') {
      if (parseInt(houseTotal) <= 0) {
        this.tools.showToast('房屋总价必须大于0万');
        return;
      }

      // 按房屋总价
      params['houseTotal'] = this.formData.houseTotal;
    }

    if (parseInt(loanTotal) <= 0) {
      this.tools.showToast('贷款总价必须大于0万');
      return;
    }

    this.navCtrl.push('CalcResultPage', params);
  }

  reset() {
    this.formData = {
      calcType: '0',
      houseTotal: '',
      loanRatio: '7',
      loanRatioName: '7成',
      loanTotal: '',
      loanYear: '30',
      loanYearName: '30年',
      // loanRate: '0',
      gjjTotal: '',
      gjjRate: '1',
      gjjRateName: '最新基准利率(3.25%)',
      sdTotal: '',
      sdRate: '1',
      sdRateName: '最新基准利率(4.9%)',
    };
  }

  selectData(dataKey, field, title) {
    const data = this[dataKey];
    let temp = [];
    data.forEach(element => {
      temp.push(`${element.label}|${element.value}`);
    });

    const modal = this.modalCtrl.create('CommSelectPage', { data: temp, title: title, selectedItem: null });
    modal.onDidDismiss((res) => {
      if (res) {
        this.formData[field] = res.value;
        this.formData[`${field}Name`] = res.label;

        if (field === 'loanRatio') {
          this.calcLoanTotal();
        }
      }
    });
    modal.present();
  }

  inputChanged(field, ev) {
    // console.log(field);
    // let val = parseInt(ev);
    // console.log(ev);

    if (this.loanType === '2') {
      if (field === 'loanTotal') {
        this.formData.sdTotal = isNaN(this.formData.loanTotal) ? 0 : this.formData.loanTotal;
        this.formData.gjjTotal = 0;
      } else if (field === 'sdTotal') {
        let sdTotal = parseInt(this.formData.sdTotal);
        let loanTotal = parseInt(this.formData.loanTotal);
        if (isNaN(sdTotal)) {
          sdTotal = 0;
        }
        if (isNaN(loanTotal)) {
          loanTotal = 0;
        }
        if (sdTotal <= loanTotal) {
          this.formData.gjjTotal = loanTotal - sdTotal;
        } else {
          this.formData.gjjTotal = 0;
          this.formData.sdTotal = loanTotal;

          this.tools.showToast('商业贷款不能超过贷款总额');
        }
      } else if (field === 'gjjTotal') {
        let gjjTotal = parseInt(this.formData.gjjTotal);
        let loanTotal = parseInt(this.formData.loanTotal);
        if (isNaN(gjjTotal)) {
          gjjTotal = 0;
        }
        if (isNaN(loanTotal)) {
          loanTotal = 0;
        }
        if (gjjTotal <= loanTotal) {
          this.formData.sdTotal = loanTotal - gjjTotal;
        } else {
          this.formData.gjjTotal = loanTotal;
          this.formData.sdTotal = 0;
          this.tools.showToast('公积金贷款不能超过贷款总额');
        }
      }
    }

    if (field === 'houseTotal') {
      this.calcLoanTotal();
    }
  }

  // selectChanged(field) {
  //   if (field === 'calcType') {
  //   } else if (field === 'loanRatio') {
  //     this.calcLoanTotal();
  //   }
  // }

  calcLoanTotal() {
    let houseTotal = parseInt(this.formData.houseTotal);
    let ratio = parseInt(this.formData.loanRatio) * 10;
    let loanTotal = Math.round(houseTotal * ratio / 100.0);
    // console.log(loanTotal);
    if (isNaN(loanTotal)) {
      loanTotal = 0;
    }

    this.formData.loanTotal = loanTotal;
    this.formData.sdTotal = this.formData.loanTotal;
    this.formData.gjjTotal = 0;
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
