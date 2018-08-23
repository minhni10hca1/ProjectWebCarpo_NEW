import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Router } from '@angular/router';
import { SystemConstants } from './../common/system.constants';
import { AuthenService } from './authen.service';
import { NotificationService } from './notification.service';
import { UtilityService } from './utility.service';

import { Observable } from 'rxjs/Observable';

// Observable class extensions
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';

// Observable operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

import { MessageContstants } from './../common/message.constants';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
@Injectable()
export class DataService {
  private headers: Headers;
  constructor(
    private _http: Http,
    private _router: Router, private _authenService: AuthenService,
    private _notificationService: NotificationService, private _utilityService: UtilityService,
    private _ng4LoadingSpinnerService: Ng4LoadingSpinnerService
  ) {
    this.headers = new Headers();
    this.headers.append('Content-Type', 'application/json');
  }
  get(uri: string) {
    this.headers.delete("Authorization");
    this.headers.append("Authorization", this._authenService.getLoggedInUser().access_token);
    return this._http.get(SystemConstants.BASE_API + uri, { headers: this.headers }).map(this.extractData);
  }
  getApiNi(uri: string): Observable<any> {
    return this._http.get(SystemConstants.BASE_API_NI + uri).map(this.extractData);
  }
  getObServable(uri: string): Observable<any> {
    this.headers.delete("Authorization");
    this.headers.append("Authorization", this._authenService.getLoggedInUser().access_token);
    return this._http.get(SystemConstants.BASE_API + uri, { headers: this.headers }).map(this.extractData);
  }

  post(uri: string, data?: any) {
    this.headers.delete("Authorization");
    this.headers.append("Authorization", this._authenService.getLoggedInUser().access_token);
    return this._http.post(SystemConstants.BASE_API + uri, data, { headers: this.headers }).map(this.extractData);
  }
  put(uri: string, data?: any) {
    this.headers.delete("Authorization");
    this.headers.append("Authorization", this._authenService.getLoggedInUser().access_token);
    return this._http.put(SystemConstants.BASE_API + uri, data, { headers: this.headers }).map(this.extractData);
  }
  putWithMultiParams(uri: string) {
    this.headers.delete("Authorization");
    this.headers.append("Authorization", this._authenService.getLoggedInUser().access_token);
    return this._http.delete(SystemConstants.BASE_API + uri, { headers: this.headers }).map(this.extractData);
  }
  deleteId(uri: string, id: string) {
    this.headers.delete("Authorization");
    this.headers.append("Authorization", this._authenService.getLoggedInUser().access_token);
    return this._http.delete(SystemConstants.BASE_API + uri + "/" + id, { headers: this.headers })
      .map(this.extractData);
  }
  delete(uri: string, key: string, id: string) {
    this.headers.delete("Authorization");
    this.headers.append("Authorization", this._authenService.getLoggedInUser().access_token);
    return this._http.delete(SystemConstants.BASE_API + uri + "/?" + key + "=" + id, { headers: this.headers })
      .map(this.extractData);
  }
  deleteWithMultiParams(uri: string, params) {
    this.headers.delete('Authorization');

    this.headers.append("Authorization", this._authenService.getLoggedInUser().access_token);
    var paramStr: string = '';
    for (let param in params) {
      paramStr += param + "=" + params[param] + '&';
    }
    return this._http.delete(SystemConstants.BASE_API + uri + "/?" + paramStr, { headers: this.headers })
      .map(this.extractData);

  }
  postFile(uri: string, data?: any) {
    let newHeader = new Headers();
    newHeader.append("Authorization", this._authenService.getLoggedInUser().access_token);
    return this._http.post(SystemConstants.BASE_API + uri, data, { headers: newHeader })
      .map(this.extractData);
  }
  private extractData(res: Response) {
    let body = res.json();
    return body || {};
  }
  public handleError(error: any) {
    var error2: any[];
    this._ng4LoadingSpinnerService.hide(); //khi lỗi thì ẩn loading
    if (error.status == 0) { //or whatever condition you like to put
      this._utilityService.navigateToError();
    }
    if (error.status == 401) {
      localStorage.removeItem(SystemConstants.CURRENT_USER);
      this._notificationService.printErrorMessage(MessageContstants.LOGIN_AGAIN_MSG);
      this._utilityService.navigateToLogin();
    }
    else if (error.status == 403) {
      // localStorage.removeItem(SystemConstants.CURRENT_USER);
      this._notificationService.printErrorMessage(MessageContstants.FORBIDDEN);
      this._utilityService.navigateToForbidden();
    }
    else {
      console.log(JSON.stringify(error));
      let body = error.json();
      var errorMessage: any;
      var flagError: boolean = false;
      if (body.message) {
        errorMessage = body.message;
        flagError = true;
      }
      if (body.error) {
        errorMessage = body.error;
        flagError = false;
      }
      let errMsg = JSON.parse(error._body).data;
      let status = JSON.parse(error._body).status;
      if (status == 11000) {
        this._notificationService.printErrorMessage(errMsg); //trùng dữ liệu
      } else {
        if (status == 500) {
          this._notificationService.printErrorMessage("Có lỗi xảy ra trong quá trình xử lý dữ liệu"); //500 error
        } else {
          if (flagError) {
            this._notificationService.printErrorMessage(this.handleValidationMessage(errorMessage).toString());
          } else {
            this._notificationService.printErrorMessage(this.handleValidationError(errorMessage).toString());
          }
        }
      }
    }
  }

  public handleValidationError(err) {
    const messages = []
    if (err.errors) {
      for (let field in err.errors) {
        messages.push(err.errors[field].messages);
      }
    }
    return messages;
  }

  public handleValidationMessage(err) {
    const messages = []
    console.log('err.name', err.name);
    console.log('err.message', err.message);
    if (err.name == 'ValidationError') {
      messages.push(err.message);
    }
    return messages;
  }
}
