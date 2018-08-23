import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContractComponent } from './contract.component';
import { ContractRouter } from './contract.routes';
import { PaginationModule, ModalModule } from 'ngx-bootstrap';
import { FormsModule } from '@angular/forms';
import { DataService } from './../../core/services/data.service';
import { UtilityService } from './../../core/services/utility.service';
import { Daterangepicker } from 'ng2-daterangepicker';
import { SelectModule } from 'ng-select';

import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { ContractCarAddComponent } from './contract-car-add/contract-car-add.component';
import { ContractCarListComponent } from './contract-car-list/contract-car-list.component';
import { DualListBoxModule } from './dual-list-box/dual-list-box.module';
import { ContractCarFindComponent } from './contract-car-find/contract-car-find.component';
@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    PaginationModule.forRoot(),
    ContractRouter,
    Daterangepicker,
    ModalModule.forRoot(),
    SelectModule,
    DualListBoxModule,
    AngularMultiSelectModule,
  ],
  declarations: [ContractComponent, ContractCarAddComponent, ContractCarListComponent, ContractCarFindComponent],
  providers: []
})
export class ContractModule { }
