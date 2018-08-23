import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeedbackRouter } from './feedback.routes';
import { FeedbackComponent } from './feedback.component';
import { DataTablesModule } from 'angular-datatables'; //dùng datatable
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { FormsModule } from '@angular/forms'; //phải có
import { ModalModule } from 'ngx-bootstrap/modal';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    FeedbackRouter,
    MultiselectDropdownModule,
    DataTablesModule,
    ModalModule.forRoot(),
  ],
  declarations: [FeedbackComponent]
})
export class FeedbackModule { }
