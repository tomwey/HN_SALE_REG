import { Component } from '@angular/core';
import { VistorsQueryPage } from '../vistors-query/vistors-query';
import { HouseQueryPage } from '../house-query/house-query';
import { MyCustomerPage } from '../my-customer/my-customer';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = VistorsQueryPage;
  tab2Root = HouseQueryPage;
  tab3Root = MyCustomerPage;
  tab4Root = 'MortgageListPage';
  
  constructor() {

  }
}
