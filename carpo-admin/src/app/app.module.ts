import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, PreloadAllModules } from '@angular/router';
import { AppComponent } from './app.component';
import { appRoutes } from './app.routes'; //cái này là module routes
import { AuthGuard } from './core/guards/auth.guard';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { NotfoundComponent } from './notfound/notfound.component';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { Ng4LoadingSpinnerModule } from 'ng4-loading-spinner';
import { SelectModule } from 'ng-select';
import { DualListBoxModule } from 'ng2-dual-list-box';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
@NgModule({
  declarations: [
    AppComponent,
    NotfoundComponent,
    ForbiddenComponent,

  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes, { preloadingStrategy: PreloadAllModules }),
    // RouterModule.forRoot(appRoutes), //khai báo routes cho toàn hệ thống
    PaginationModule.forRoot(),//paging,
    Ng4LoadingSpinnerModule,
    SelectModule,
    DualListBoxModule.forRoot(),
    AngularMultiSelectModule,
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent],
})
export class AppModule { }
