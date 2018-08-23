import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { SystemConstants } from '../../core/common/system.constants';
import { LoggedInUser } from '../domain/loggedin.user';
import { NotificationService } from './notification.service';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthenService {

  constructor(
    private _notificationService: NotificationService,
    private _http: Http
  ) { }

  login(username: string, password: string) {
    try {
      let body = "username=" + encodeURIComponent(username) + "&password=" + encodeURIComponent(password);
      let headers = new Headers();
      headers.append("Content-Type", "application/x-www-form-urlencoded");
      let options = new RequestOptions({ headers: headers });

      return this._http.post(SystemConstants.BASE_API + '/users/login', body, options).map((response: Response) => {
        if (response.json().success == 1) {
          console.log('dang nhap ok');
          let user: LoggedInUser = response.json().data; //lấy data key
          if (user && user.access_token) {
            localStorage.removeItem(SystemConstants.CURRENT_USER);
            localStorage.removeItem(SystemConstants.CURRENT_USER_CAMPAIGN);
            localStorage.setItem(SystemConstants.CURRENT_USER, JSON.stringify(user));
          }
        } else {
          console.log('dang nhap that bai');
          localStorage.removeItem(SystemConstants.CURRENT_USER);
          localStorage.removeItem(SystemConstants.CURRENT_USER_CAMPAIGN);
          this._notificationService.printErrorMessage(response.json().message);
        }
      });
    } catch (error) {
      this._notificationService.printErrorMessage(error);
    }
  }
  logout() {
    localStorage.removeItem(SystemConstants.CURRENT_USER);
  }

  isUserAuthenticated(): boolean {
    let user = localStorage.getItem(SystemConstants.CURRENT_USER);
    if (user != null) {
      return true;
    }
    else
      return false;
  }

  getLoggedInUser(): LoggedInUser {
    let user: LoggedInUser;
    if (this.isUserAuthenticated()) {
      var userData = JSON.parse(localStorage.getItem(SystemConstants.CURRENT_USER));
      user = new LoggedInUser(
        userData._id,
        userData.access_token,
        userData.username,
        userData.fullname,
        userData.email,
        userData.photo, userData.role, userData.permissions);
    }
    else { user = null; }
    return user;
  }

  checkAccess(functionId: string) {
    // var user = this.getLoggedInUser();
    // var result: boolean = false;
    // var permission: any[] = JSON.parse(user.permissions);
    // var roles: any[] = JSON.parse(user.role);
    // var hasPermission: number = permission.findIndex(x => x.FunctionId == functionId && x.CanRead == true);
    // if (hasPermission != -1 || roles.findIndex(x => x == "Admin") != -1) {
    //   return true;
    // }
    // else
    //   return false;

    let user = localStorage.getItem(SystemConstants.CURRENT_USER);
    if (user != null) {
      return true;
    }
    else
      return false;

  }
  hasPermission2(functionId: string, action: string): boolean {
    // var user = this.getLoggedInUser();
    // var result: boolean = false;
    // var permission: any[] = JSON.parse(user.permissions);
    // var roles: any[] = JSON.parse(user.role);
    // switch (action) {
    //   case 'create':
    //     var hasPermission: number = permission.findIndex(x => x.FunctionId == functionId && x.CanCreate == true);
    //     if (hasPermission != -1 || roles.findIndex(x => x == "Admin") != -1)
    //       result = true;
    //     break;
    //   case 'update':
    //     var hasPermission: number = permission.findIndex(x => x.FunctionId == functionId && x.CanUpdate == true);
    //     if (hasPermission != -1 || roles.findIndex(x => x == "Admin") != -1)
    //       result = true;
    //     break;
    //   case 'delete':
    //     var hasPermission: number = permission.findIndex(x => x.FunctionId == functionId && x.CanDelete == true);
    //     if (hasPermission != -1 || roles.findIndex(x => x == "Admin") != -1)
    //       result = true;
    //     break;
    // }
    // return result;
    return true;
  }

  hasPermission(): boolean {
    var user = this.getLoggedInUser();
    var result: boolean = false;
    var roles: String = user.role;
    if (roles == "Admin")
      result = true;
    return result;
  }

  hasPermission_Client(): boolean {
    var user = this.getLoggedInUser();
    var result: boolean = false;
    var roles: String = user.role;
    if (roles != "CarAds")
      result = true;
    return result;
  }
}
