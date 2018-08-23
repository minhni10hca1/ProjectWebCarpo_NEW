import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrackingComponent } from './tracking.component';
import { TrackingRouter } from './tracking.routes';
import { FormsModule } from '@angular/forms';
import { DataService } from './../../core/services/data.service';
import { UtilityService } from './../../core/services/utility.service';
import { Ng2FilterPipeModule } from 'ng2-filter-pipe';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    TrackingRouter,
    Ng2FilterPipeModule //dùng để filter list item
  ],
  declarations: [TrackingComponent],
  providers: []
})
export class TrackingModule { }
