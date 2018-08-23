import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityComponent } from './activity.component';
import { ActivityRouter } from './activity.routes';
import { PaginationModule } from 'ngx-bootstrap';
import { FormsModule } from '@angular/forms';
import { DataService } from './../../core/services/data.service';
import { UtilityService } from './../../core/services/utility.service';
import { TruncatePipe } from '../../core/pipes/truncate.pipe'; // quá 50 ký tự thì ...
@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    PaginationModule.forRoot(),
    ActivityRouter,
  ],
  declarations: [ActivityComponent , TruncatePipe],
  providers:[]
})
export class ActivityModule { }
