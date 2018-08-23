import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { DataService } from '../../core/services/data.service';
import { NotificationService } from '../../core/services/notification.service';
import { UtilityService } from '../../core/services/utility.service';
import { MessageContstants } from '../../core/common/message.constants';
import { AuthenService } from '../../core/services/authen.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css'],
})
export class ActivityComponent implements OnInit {
  public totalRow: number;
  public pageIndex: number = 1;
  public pageSize: number = 20;
  public filter: string = '';
  public entity: any;

  public activitys: any[];
  //filter
  public filterCollection: string = '';

  constructor(
    private _dataService: DataService,
    private _notificationService: NotificationService,
    private _utilityService: UtilityService,
    public _authenService: AuthenService,
    private _ng4LoadingSpinnerService: Ng4LoadingSpinnerService
  ) {
  }

  ngOnInit() {
    this._ng4LoadingSpinnerService.show();
    this.search();
  }
  //Load data
  public search() {
    console.log('search' , this.pageIndex);
    this._dataService.get('/activitys/paging?page='
      + this.pageIndex + '&pageSize=' + this.pageSize
      + '&filter=' + this.filterCollection)
      .subscribe((response: any) => {
        if (response.success == 1 && response.data != []) {
          this.activitys = response.data;
          this.pageIndex = response.PageIndex;
          this.pageSize = response.PageSize;
          this.totalRow = response.TotalRows;
          this._ng4LoadingSpinnerService.hide();
        } else {
          this._ng4LoadingSpinnerService.hide();
        }
      }, error => this._dataService.handleError(error));
  }
  public reset() {
    this.filterCollection = '';
    this.search();
  }
  public pageChanged(event: any): void {
    this.pageIndex = event.page;
    console.log('this.pageIndex' , this.pageIndex);
    this._ng4LoadingSpinnerService.show();
    this.search();
  }
}
