import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EvidenceComponent } from './evidence.component';
import { EvidenceRouter } from './evidence.routes';
import { PaginationModule } from 'ngx-bootstrap';
import { FormsModule } from '@angular/forms';
import { DataService } from './../../core/services/data.service';
import { UtilityService } from './../../core/services/utility.service';
import { Daterangepicker } from 'ng2-daterangepicker';
import { DriverComponent } from './driver.component';

import { LightboxModule } from 'angular2-lightbox';
import { Ng2FilterPipeModule } from 'ng2-filter-pipe';
@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    PaginationModule.forRoot(),
    EvidenceRouter,
    Daterangepicker,
    LightboxModule, //popup hinh anh  
    Ng2FilterPipeModule,  
  ],
  declarations: [EvidenceComponent, DriverComponent],
  providers:[]
})
export class EvidenceModule { }
