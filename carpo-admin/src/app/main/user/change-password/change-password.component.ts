import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoggedInUser } from '../../../core/domain/loggedin.user';
import { AuthenService } from '../../../core/services/authen.service';
import { UrlConstants } from '../../../core/common/url.constants';
import { NotificationService } from '../../../core/services/notification.service';
import { DataService } from '../../../core/services/data.service';
import { UtilityService } from '../../../core/services/utility.service';
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  public user: LoggedInUser;
  constructor(
    private _authenService: AuthenService,
    private _notificationService: NotificationService,
    private _dataService: DataService,
    private _utilityService: UtilityService,
  ) { }

  ngOnInit() {
    this.user = this._authenService.getLoggedInUser();
  }

  saveChange(form: NgForm) {
    if (form.valid) {
      this.saveData(form);
    }
  }
  private saveData(form: NgForm) {
    this._dataService.put('/users/changepassword/' + this.user.id, JSON.stringify(this.user))
      .subscribe((response: any) => {
        if (response.success == 1) {
          form.resetForm();
          this._notificationService.printSuccessMessage("Đổi mật khẩu thành công!");
          this._utilityService.navigateToLogin(); //thành công login lại
        } else {
          form.resetForm();
          this._notificationService.printErrorMessage(response.data);
        }
      }, error => this._dataService.handleError(error));
  }
}
