import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user.component';
import { Routes, RouterModule } from '@angular/router';
import { DataService } from '../../core/services/data.service';
import { NotificationService } from '../../core/services/notification.service';
import { UploadService } from '../../core/services/upload.service';

import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { Daterangepicker } from 'ng2-daterangepicker';
import { EqualValidator } from '../../core/directives/equal-validator.directive';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { HttpClientModule } from '@angular/common/http'; // dùng cho get, post api từ ní
const userRoutes: Routes = [
  //localhost:4200/main/user
  { path: '', redirectTo: 'index', pathMatch: 'full' },
  //localhost:4200/main/user/index
  { path: 'index', component: UserComponent },
  { path: 'changepassword/:id', component: ChangePasswordComponent },
]
@NgModule({
  imports: [
    CommonModule,
    PaginationModule,
    FormsModule,
    MultiselectDropdownModule,
    Daterangepicker,
    ModalModule.forRoot(),
    RouterModule.forChild(userRoutes),
    HttpClientModule, // dùng cho get, post api từ ní
  ],
  declarations: [UserComponent, EqualValidator, ChangePasswordComponent],
  providers: [DataService, NotificationService, UploadService]
})
export class UserModule { }
