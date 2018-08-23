import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../core/services/data.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Response } from '@angular/http';
import { Subject } from 'rxjs/Subject';
import { AuthenService } from '../../../core/services/authen.service';
import { NotificationService } from '../../../core/services/notification.service';
import { UtilityService } from '../../../core/services/utility.service';
import { MessageContstants } from '../../../core/common/message.constants';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-contract-car-list',
  templateUrl: './contract-car-list.component.html',
  styleUrls: ['./contract-car-list.component.css']
})
export class ContractCarListComponent implements OnInit {
  public cars: any[];
  public campaignId: string;
  public totalRow: number;
  public pageIndex: number = 1;
  public pageSize: number = 50;
  public filter: string = '';
  public title: string;
  constructor(private _dataService: DataService
    , private activatedRoute: ActivatedRoute
    , public _authenService: AuthenService,
    private _notificationService: NotificationService,
    private _utilityService: UtilityService,
  ) {

  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.campaignId = params['id'];
      this.search();
    });
  }
  //Load data
  public search() {
    this._dataService.get('/campaigns/detailcars/' + this.campaignId + '?page='
      + this.pageIndex + '&pageSize='
      + this.pageSize + '&filter=' + this.filter)
      .subscribe((response: any) => {
        this.title = response.title;
        if (response.success == 1 && response.data.length > 0) {
          this.cars = response.data;
          this.pageIndex = response.PageIndex;
          this.pageSize = response.PageSize;
          this.totalRow = response.TotalRows;
        } else {
          this.cars = [];
        }
      }, error => this._dataService.handleError(error));
  }

  //Action delete
  public deleteConfirm(carid: string): void {
    this._dataService.putWithMultiParams('/campaigns/updateDeleteCar/' + this.campaignId + '/' + carid)
      .subscribe((response: any) => {
        this._notificationService.printSuccessMessage(MessageContstants.DELETED_OK_MSG);
        this.search();
      }, error => this._dataService.handleError(error));
  }
  //Click button delete turn on confirm
  public delete(carid: string) {
    this._notificationService.printConfirmationDialog(MessageContstants.CONFIRM_DELETE_MSG, () => this.deleteConfirm(carid));
  }
  public pageChanged(event: any): void {
    this.pageIndex = event.page;
    this.search();
  }
}
