import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CargroupComponent } from './cargroup.component';
import { CargroupRouter } from './cargroup.routes';
import { PaginationModule, ModalModule } from 'ngx-bootstrap';
import { FormsModule } from '@angular/forms';
import { DataService } from './../../core/services/data.service';
import { UtilityService } from './../../core/services/utility.service';
import { SelectModule } from 'ng-select';
@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    PaginationModule.forRoot(),
    CargroupRouter,
    ModalModule.forRoot(),
    SelectModule
  ],
  declarations: [CargroupComponent],
  providers: []
})
export class CargroupModule { }
