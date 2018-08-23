import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarComponent } from './car.component';
import { CarRouter } from './car.routes';
import { PaginationModule, ModalModule } from 'ngx-bootstrap';
import { FormsModule } from '@angular/forms';
import { DataService } from './../../core/services/data.service';
import { UtilityService } from './../../core/services/utility.service';
// Import your library
// import {NgSelectModule} from '@ng-select/ng-select';
import {SelectModule} from 'ng-select';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    PaginationModule.forRoot(),
    CarRouter,
    ModalModule.forRoot(),
    SelectModule
    // NgSelectModule.forRoot({notFoundText: 'Không tìm thấy dữ liệu', typeToSearchText: 'Tìm kiếm...'}),
  ],
  declarations: [CarComponent],
  providers:[]
})
export class CarModule { }
