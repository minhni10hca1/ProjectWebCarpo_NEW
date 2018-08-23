import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeatmapRouter } from './heatmap.routes';
import { HeatmapComponent } from './heatmap.component';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HeatmapRouter,
    MultiselectDropdownModule
  ],
  declarations: [HeatmapComponent]
})
export class HeatmapModule { }
