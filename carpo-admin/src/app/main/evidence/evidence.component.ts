import { Component, OnInit } from '@angular/core';
import { DataService } from '../../core/services/data.service';
import { NotificationService } from '../../core/services/notification.service';
import { UtilityService } from '../../core/services/utility.service';
import { MessageContstants } from '../../core/common/message.constants';
import { AuthenService } from '../../core/services/authen.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
@Component({
  selector: 'app-evidence',
  templateUrl: './evidence.component.html',
  styleUrls: ['./evidence.component.css']
})
export class EvidenceComponent implements OnInit {
  public totalRow: number;
  public pageIndex: number = 1;
  public pageSize: number = 50;
  //filter
  public filterDriverName: string = '';
  public filterDriverPhone: string = '';
  public filterStartDate: string = '';
  public filterEndDate: string = '';
  public driversPersonnalScroll: any[];
  //end filter
  public dateOptions: any = {
    locale: { format: 'DD/MM/YYYY' },
    alwaysShowCalendars: false,
    singleDatePicker: true
  };
  public comfirmcars: any[];
  constructor(
    private _dataService: DataService,
    private _notificationService: NotificationService,
    private _utilityService: UtilityService,
    public _authenService: AuthenService,
    private _ng4LoadingSpinnerService: Ng4LoadingSpinnerService
  ) {
  }

  ngOnInit() {
    // this.filterStartDate = moment(new Date(Date.now())).format('DD/MM/YYYY');
    // this.filterEndDate = moment(new Date(Date.now())).format('DD/MM/YYYY');
    // this.search();
    this.loadListUserScroll();
  }
  //Load data
  public search() {
    var start_time = moment(this.filterStartDate, ["DD/MM/YYYY", "YYYY-MM-DD"]);
    var end_time = moment(this.filterEndDate, ["DD/MM/YYYY", "YYYY-MM-DD"]);
    this._dataService.get('/evidences/findAllByCustomerID?page='
      + this.pageIndex + '&pageSize=' + this.pageSize
      + '&startDate=' + this.filterStartDate
      + '&endDate=' + this.filterEndDate)
      .subscribe((response: any) => {
        //console.log('response' , response);
        if (response.success == 1 && response.data != []) {
          this.comfirmcars = response.data;
          this.pageIndex = response.PageIndex;
          this.pageSize = response.PageSize;
          this.totalRow = response.TotalRows;
        }
      }, error => this._dataService.handleError(error));
  }
  public changeStartDate(value: any) {
    this.filterStartDate = moment(new Date(value.end._d)).format('DD/MM/YYYY');
  }
  public changeEndDate(value: any) {
    this.filterEndDate = moment(new Date(value.end._d)).format('DD/MM/YYYY');
  }
  public pageChanged(event: any): void {
    this.pageIndex = event.page;
    //this.search();
    this.loadListUserScroll();
  }

  // load user
  public loadListUserScroll() {
    // this._ng4LoadingSpinnerService.show();
    this._dataService.get('/cars/findAllCarByCustomerID?page='
    + this.pageIndex + '&pageSize=' + this.pageSize)
      .subscribe((response: any) => {
        this.pageIndex = response.PageIndex;
        this.pageSize = response.PageSize;
        this.totalRow = response.TotalRows;
        this.driversPersonnalScroll = response.data;
      // console.log('driver scroll:' + JSON.stringify(this.driversPersonnalScroll));
      }, error => this._dataService.handleError(error));
  }
}
