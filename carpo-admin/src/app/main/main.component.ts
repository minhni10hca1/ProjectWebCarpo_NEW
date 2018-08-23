import { Component, OnInit, ElementRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AppUser } from '../core/domain/app-user';
import { SystemConstants } from '../core/common/system.constants';
import { UrlConstants } from '../core/common/url.constants';
import { Router } from '@angular/router';

declare var $: any;
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  public user: AppUser;
  constructor(private router: Router, private elementRef: ElementRef, private titleService: Title) {
  }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem(SystemConstants.CURRENT_USER));
    $(document).ready(function(){
      $.getScript('../assets/js/custom.js');
    });
  }
  logout() {
    localStorage.removeItem(SystemConstants.CURRENT_USER);
    this.router.navigate([UrlConstants.LOGIN]);
  }

}
