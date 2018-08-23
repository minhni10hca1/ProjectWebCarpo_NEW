import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerComponent } from './customer.component';
import { CustomerRouter } from './customer.routes';
import { PaginationModule, ModalModule } from 'ngx-bootstrap';
import { FormsModule } from '@angular/forms';
import { DataService } from './../../core/services/data.service';
import { UtilityService } from './../../core/services/utility.service';
import {SelectModule} from 'ng-select';
@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    PaginationModule.forRoot(),
    CustomerRouter,
    ModalModule.forRoot(),
    SelectModule
  ],
  declarations: [CustomerComponent],
  providers:[]
})
export class CustomerModule { }
