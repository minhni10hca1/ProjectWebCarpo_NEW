import { Component, Input, Output, EventEmitter, ElementRef, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Daterangepicker } from 'ng2-daterangepicker';
import { DataService } from '../../../core/services/data.service';
import { NotificationService } from '../../../core/services/notification.service';
import { UtilityService } from '../../../core/services/utility.service';
import { MessageContstants } from '../../../core/common/message.constants';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { DataTableDirective } from 'angular-datatables'; //dùng datatable

import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-buttons';
import * as numeral from 'numeral';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  public filterStartDate: string = '';
  public filterEndDate: string = '';
  public filterFirstDayMonth: string = '';
  public filterLastDayMonth: string = '';
  public dateOptions: any = {
    locale: { format: 'DD/MM/YYYY' },
    alwaysShowCalendars: false,
    singleDatePicker: true
  };
  public campaignId: string;
  public totalKmMonth: number;
  public totalKmToday: number;
  public totalKmRankDate: number;
  flagTotal = false;

  //test
  private cartrackingsTable: any;
  private tableWidget: any;
  @Input() carTrackings: any[];
  //test
  constructor(
    private daterangepicker: Daterangepicker,
    private _dataService: DataService,
    private _notificationService: NotificationService,
    private _utilityService: UtilityService,
    private _ng4LoadingSpinnerService: Ng4LoadingSpinnerService,
    private activatedRoute: ActivatedRoute,
    private el: ElementRef

  ) {
    this.totalKmToday = 0;
    this.totalKmMonth = 0;
    this.totalKmRankDate = 0;
  }
  ngOnInit() {

    this.carTrackings = []; //fai có
    this.activatedRoute.params.subscribe((params: Params) => {
      this.campaignId = params['id'];
    });
    this.filterStartDate = moment(new Date(Date.now())).format('DD/MM/YYYY');
    this.filterEndDate = moment(new Date(Date.now())).format('DD/MM/YYYY');
    this.search(); //load data

    //thống kê km theo tháng
    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    this.filterFirstDayMonth = moment(firstDay).format('DD/MM/YYYY'); //lấy ngày đầu tiên của tháng hiện tại
    this.filterLastDayMonth = moment(lastDay).format('DD/MM/YYYY'); //lấy ngày cuối cùng của tháng hiện tại
    this.getTotalDistance_Month(); //lấy km theo tháng
    //thống kê km theo tháng
  }

  public search() {
    this.carTrackings = [];
    var start_time = moment(this.filterStartDate, ["DD/MM/YYYY", "YYYY-MM-DD"]);
    var end_time = moment(this.filterEndDate, ["DD/MM/YYYY", "YYYY-MM-DD"]);
    this._ng4LoadingSpinnerService.show();
    this._dataService.get('/trackings/getListCarByCampaignID/' + this.campaignId
      + '?startDate=' + this.filterStartDate
      + '&endDate=' + this.filterEndDate)
      .subscribe((response: any) => {
        if (response.success == 1 && response.data.length > 0) {
          this.carTrackings = response.data;
          let totalDistance = 0;
          this.carTrackings.forEach(element => {
            totalDistance += element.totalDistance;
          });
          this.totalKmRankDate = numeral(totalDistance / 1000).format('0,0'); //luôn luôn tính lại khi tìm kiếm
          if (this.flagTotal == false) {
            this.totalKmToday = numeral(totalDistance / 1000).format('0,0'); //chỉ load 1 lần khi onInit
          }
        } else {
          this.totalKmToday = 0;
          this.totalKmRankDate = 0;
          this.carTrackings = [];
        }
        this.flagTotal = true;
        //init table
        if (this.tableWidget) {
          this.tableWidget.destroy();
        }
        let tableOptions: any = {
          dom: 'Bfrtip',
          buttons: ["excel","pdf"],
          data: this.carTrackings,
          pagingType: 'full_numbers',
          pageLength: 50,
          autoWidth: false,
          processing: true,
          stateSave: true,
          columns: [
            {
              title: 'Tài xế', data: 'fullname',
              render: function (data, type, row) {
                let html = '';
                if (row.status == 'DISABLED') {
                  html = data + '&nbsp<span class="label label-danger">Đã nghỉ</span>';
                } else {
                  html = data + '&nbsp<span class="label label-success">Hoạt động</span>';
                }
                return html;
              }
            },
            { title: 'Điện thoại', data: 'phone' },
            { title: 'DeviceId', data: 'device_id' },
            { title: 'Biển số', data: 'license_plate' },
            { title: 'Loại xe', data: 'car_manufacturer' },
            {
              title: 'Tổng Km',
              data: 'totalDistance',
              render: function (data, type, row) {
                return numeral(data / 1000).format('0,0');
              }
            }
          ],
        }
        //end init table
        this.cartrackingsTable = $(this.el.nativeElement.querySelector('table'));
        this.tableWidget = this.cartrackingsTable.DataTable(tableOptions);
        this._ng4LoadingSpinnerService.hide();
      }, error => this._dataService.handleError(error));
  }
  public changeStartDate(value: any) {
    this.filterStartDate = moment(new Date(value.end._d)).format('DD/MM/YYYY');
  }
  public changeEndDate(value: any) {
    this.filterEndDate = moment(new Date(value.end._d)).format('DD/MM/YYYY');
  }

  public getTotalDistance_Month() {
    this._dataService.get('/trackings/getListCarByCampaignIDMonth/' + this.campaignId
      + '?startDate=' + this.filterFirstDayMonth
      + '&endDate=' + this.filterLastDayMonth)
      .subscribe((response: any) => {
        //response.data trả ra số km
        if (response.success == 1 && response.data > 0) {
          let totalDistanceMonth = 0;
          totalDistanceMonth = response.data;
          this.totalKmMonth = numeral(totalDistanceMonth / 1000).format('0,0'); //chỉ load 1 lần khi onInit
        } else {
          this.totalKmMonth = 0;
        }
      }, error => this._dataService.handleError(error));
  }

  getExportFileTitle() {
    let fileName = 'KM Tài xế ';
    let start_time = moment(this.filterStartDate, ["DD/MM/YYYY", "YYYY-MM-DD"]);
    let end_time = moment(this.filterEndDate, ["DD/MM/YYYY", "YYYY-MM-DD"]);
    if (this.filterStartDate && this.filterEndDate) {
      fileName += start_time.format('DD/MM') + ' - ' + end_time.format('DD/MM');
    }
    fileName = fileName.trim();
    return fileName;
  }
}
