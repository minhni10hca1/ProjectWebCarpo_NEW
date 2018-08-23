import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { DataService } from '../../core/services/data.service';
import { NotificationService } from '../../core/services/notification.service';
import { UtilityService } from '../../core/services/utility.service';
import { MessageContstants } from '../../core/common/message.constants';
import { AuthenService } from '../../core/services/authen.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css'],
})
export class InfoComponent implements OnInit {
  @ViewChild('ViewModal') public ViewModal: ModalDirective;
  public totalRow: number;
  public pageIndex: number = 1;
  public pageSize: number = 20;
  public maxSize: number = 5;
  public filter: string = '';
  public entityView: any;

  public campaigns: any[];
  private user: any;
  constructor(
    private _dataService: DataService,
    private _notificationService: NotificationService,
    private _utilityService: UtilityService,
    public _authenService: AuthenService,
    private _ng4LoadingSpinnerService: Ng4LoadingSpinnerService,
  ) {
  }

  ngOnInit() {
    this.user = this._authenService.getLoggedInUser();
    this._ng4LoadingSpinnerService.show();
    this.search();
  }
  //Load data
  public search() {
    this._dataService.get('/campaigns/findCustomerID?page='
      + this.pageIndex + '&pageSize='
      + this.pageSize)
      .subscribe((response: any) => {
        if (response.success == 1 && response.data != []) {
          this.campaigns = response.data;
          this.pageIndex = response.PageIndex;
          this.pageSize = response.PageSize;
          this.totalRow = response.TotalRows;
        }
        this._ng4LoadingSpinnerService.hide();
      }, error => this._dataService.handleError(error));
  }
  public pageChanged(event: any): void {
    this.pageIndex = event.page;
    this.search();
  }

  //Show view form
  public showView(id: string) {
    this.entityView = this.campaigns.find(x => x._id == id);
    this.ViewModal.show();
  }
}
