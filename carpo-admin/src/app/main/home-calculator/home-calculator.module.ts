import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeCalculatorComponent } from './home-calculator.component';
import { HomeCalculatorRouter } from './home-calculator.routes';

import { PaginationModule, ModalModule } from 'ngx-bootstrap';
import { FormsModule } from '@angular/forms';
import { DataService } from './../../core/services/data.service';
import { UtilityService } from './../../core/services/utility.service';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    PaginationModule.forRoot(),
    HomeCalculatorRouter,
    ModalModule.forRoot()
  ],
  declarations: [HomeCalculatorComponent],
  providers:[]
})
export class HomeCalculatorModule { }
