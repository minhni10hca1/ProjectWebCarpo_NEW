import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfoComponent } from './info.component';
import { InfoRouter } from './info.routes';
import { PaginationModule, ModalModule } from 'ngx-bootstrap';
import { FormsModule } from '@angular/forms';
import { DataService } from './../../core/services/data.service';
import { UtilityService } from './../../core/services/utility.service';
import { DetailComponent } from './detail/detail.component';
import { Daterangepicker } from 'ng2-daterangepicker';
import { DataTablesModule } from 'angular-datatables'; //dùng datatable
@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    PaginationModule.forRoot(),
    InfoRouter,
    ModalModule.forRoot(),
    Daterangepicker,
    DataTablesModule
  ],
  declarations: [InfoComponent, DetailComponent],
  providers:[]
})
export class InfoModule { }
