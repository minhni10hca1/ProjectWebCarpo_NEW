import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotificationService } from '../core/services/notification.service';
import { AuthenService } from '../core/services/authen.service';
import { MessageContstants } from '../core/common/message.constants';
import { UrlConstants } from '../core/common/url.constants';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  host: { '[class.someClass]': 'someField' }
})
export class LoginComponent implements OnInit, OnDestroy {
  loading = false;
  model: any = {};
  returnUrl: string;
  bodyClasses: string = "login";
  constructor(
    private authenService: AuthenService,
    private notificationService: NotificationService,
    private router: Router,

  ) { }

  ngOnInit(): void {
    let body = document.getElementsByTagName('body')[0];
    body.classList.add(this.bodyClasses);
  }
  ngOnDestroy() {
    let body = document.getElementsByTagName('body')[0];
    body.classList.remove(this.bodyClasses);
  }
  login() {
    try {
      this.loading = true;
      this.authenService.login(this.model.username, this.model.password).subscribe(data => {
        if (data == undefined) {
          this.router.navigate([UrlConstants.LOGIN]);
        }
        this.loading = false;
        this.router.navigate([UrlConstants.HOME]);
      }, error => {
        if (error.status == 401) {
          this.notificationService.printErrorMessage(MessageContstants.LOGIN_ERROR_MSG);
        } if (error.status == 403) {
          this.notificationService.printErrorMessage(MessageContstants.LOGIN_INACTIVE_SUSPENDDED_MSG);
        }
        else {
          this.notificationService.printErrorMessage(MessageContstants.SYSTEM_ERROR_MSG);
        }
        this.loading = false;
      });
    } catch (error) {
      this.loading = false;
    }
  }
}
