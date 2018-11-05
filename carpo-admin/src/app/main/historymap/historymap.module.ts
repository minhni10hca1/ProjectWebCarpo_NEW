import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistorymapComponent } from './historymap.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';
import { Daterangepicker } from 'ng2-daterangepicker';
import { SelectModule } from 'ng-select';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { Ng2FilterPipeModule } from 'ng2-filter-pipe';

const historymapRoutes: Routes = [
  { path: '', redirectTo: 'index', pathMatch: 'full' },
  { path: 'index', component: HistorymapComponent }
]
@NgModule({
  imports: [
    FormsModule,
    Ng2FilterPipeModule,
    CommonModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyD7Ln1SclihlJ6gmxvzhxn5AtvviHYUORQ'
    }),
    RouterModule.forChild(historymapRoutes),
    Daterangepicker,
    SelectModule,
    AngularMultiSelectModule,

  ],
  declarations: [HistorymapComponent],
  providers: []
})
export class HistorymapModule { }
