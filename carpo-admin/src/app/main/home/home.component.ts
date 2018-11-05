import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DataService } from '../../core/services/data.service';
import { NotificationService } from '../../core/services/notification.service';
import { UtilityService } from '../../core/services/utility.service';
import { MessageContstants } from '../../core/common/message.constants';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { AuthenService } from '../../core/services/authen.service';
import { LoggedInUserCampaign } from '../../core/domain/loggedin.campaign';
import { NgForm } from '@angular/forms';
import { SystemConstants } from '../../core/common/system.constants';
import * as numeral from 'numeral';
import * as Chart from 'chart.js';
import * as CountUp from 'countup.js';
import { element } from 'protractor';
import { IOption } from 'ng-select';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  titleContract: string;
  entityDashboard: any;
  entityTop20Driver: any[];
  deviceIdsEntity: any = {}; //object deviceids và impression dùng để post view chart
  campaigns: any[];
  totalDistance: number = 0;
  totalImpression: number = 0;
  totalDriver: number = 0;
  private user: any;
  areaCode: String;
  campaignId: String;
  status_load: number = 0;

  public areaOptions: Array<IOption> = [{
    label: '--Xem Tất Cả--',
    value: '0'
  }];

  //bar chart
  resultbarChartData: IDataChart[] = [];
  driverChart = [];
  public isDataAvailable: boolean = false;
  public isLoadFinish: boolean = false;
  //end bar chart

  //pie chart
  districtChart = [];
  public resultpieChartData: IDataPieChart[] = [];
  endVal = 100000;
  numAnim;
  numAnimTotalImpression;
  numAnimTotalDriver;
  myTotalDistance = 0;
  public chartClicked(e: any): void {
  }

  public chartHovered(e: any): void {
  }
  //end pie chart
  constructor(
    private _dataService: DataService,
    private _notificationService: NotificationService,
    private _utilityService: UtilityService,
    private _ng4LoadingSpinnerService: Ng4LoadingSpinnerService,
    public _authenService: AuthenService,
    public elementRef: ElementRef
  ) { }

  ngOnInit() {
    this.status_load += 1;
    this.areaCode = "0";
    this.campaignId = "0";

    this.endVal = 100000000;
    // this.numAnim.reset();
    // this.numAnim = new CountUp("myTotalDistance", 0, this.endVal, 2, 100/2);
    // this.numAnim.start(function() {
    //   this.numAnim.update(this.endVal);
    // });
    this.loadComboArea(); // load combo khu vực
    //console.log("areaOptions :" + JSON.stringify(this.areaOptions));
    this.user = this._authenService.getLoggedInUser();
    this.totalDistance = 0;
    this.totalImpression = 0;
    this.totalDriver = 0;
    //admin vs manager thì ko cần xem dashboard
    if (this.user.role == "Client") {
      this.getCampaign(); //lấy ds hợp đồng
    }
    // load combo area

  }

  //load area select
  private loadComboArea() {
    this._dataService.get('/areas/getCombo').subscribe((response: any[]) => {
      response.forEach(i => {
        this.areaOptions.push(
          {
            "label": i.name,
            "value": i.code
          });
      });
    }, error => this._dataService.handleError(error));
  }

  public getCampaign() {
    this._dataService.get('/trackings/getCampaignByCustomerID')
      .subscribe((response: any) => {
        //response.data trả ra số km        
        if (response.success == 1 && response.data.length > 0) {
          this.campaigns = response.data;
          localStorage.removeItem(SystemConstants.CURRENT_USER_CAMPAIGN);
          localStorage.setItem(SystemConstants.CURRENT_USER_CAMPAIGN, JSON.stringify(response.data)); //lưu lại ds hợp đồng của user đăng nhập để dùng cho các form khác khi cần
          let campaign = this.campaigns[0];
          // console.log('vao');
          this.showChart(campaign.name, campaign.cars, campaign.impressionNo, campaign.start_time, campaign.end_time, 0); //show first khi load init
        } else {
          this.campaigns = [];
        }
      }, error => this._dataService.handleError(error));
  }

  public processChooseCampaignAndArea() {
    var arrayCampaign = new Array();
    var arrayChoose = [];
    arrayCampaign = JSON.parse(localStorage.getItem(SystemConstants.CURRENT_USER_CAMPAIGN));
    var status_cb = false;
    if (this.campaignId == "1") {
      status_cb = true;
    }
    if (this.areaCode == "0" && this.campaignId == "0") {
      this.campaigns = arrayCampaign;
      return;
    }
    for (let item of arrayCampaign) {
      //console.log("vaoitem" + JSON.stringify(item));
      if (this.areaCode == "0" && this.campaignId != "0") {
        if (item.status == status_cb) {
          arrayChoose.push(item);
        }
      } else if (this.areaCode != "0" && this.campaignId == "0") {
        if (item.areacode == this.areaCode) {
          arrayChoose.push(item);
        }
      }
      else {
        if (item.areacode == this.areaCode && item.status == status_cb) {
          arrayChoose.push(item);
        }
      }
    }
    this.campaigns = arrayChoose;
  }

  public selectedArea(event) {
    this.areaCode = event.target.value;
    this.processChooseCampaignAndArea();
  }

  public selectedCampaign(event) {
    this.campaignId = event.target.value;
    this.processChooseCampaignAndArea();
  }

  public showChart(campaingname: string, cars: any[], impressionNo: number, start_time: string, end_time: string, numStatus: number) {
    if (this.isLoadFinish == false && numStatus == 1)
      return;
    console.log("status_load"+ this.status_load);
    if (this.status_load <= 1) {
      //console.log("abc");
      this.isLoadFinish = true;
      this.status_load +=1 ;
      return;
    }
   
    this.titleContract = campaingname;
    this.deviceIdsEntity.deviceIds = cars;
    this.deviceIdsEntity.impressionNo = impressionNo;
    this.deviceIdsEntity.start_time = start_time;
    this.deviceIdsEntity.end_time = end_time;
    //document.getElementById('xemthongke').setAttribute("disabled","disabled");
    //vẽ barchart vs lấy tổng km và impression
    this.isLoadFinish = false;
    this.numAnim = new CountUp("myTotalDistance", 0, this.endVal, 2, 100 / 2);
    this.numAnim.reset();
    this.numAnim.start(function () {
      this.numAnim.update(this.endVal);
    });
    // animTotalImpression
    this.numAnimTotalImpression = new CountUp("myTotalImpression", 0, this.endVal, 2, 100 / 2);
    this.numAnimTotalImpression.reset();
    this.numAnimTotalImpression.start(function () {
      this.numAnimTotalImpression.update(this.endVal);
    });

    // animTotalDriver
    this.numAnimTotalDriver = new CountUp("mytotalDriver", 0, this.endVal, 2, 100 / 2);
    this.numAnimTotalDriver.reset();
    this.numAnimTotalDriver.start(function () {
      this.numAnimTotalDriver.update(this.endVal);
    });

    this._dataService.post('/trackings/getChartbyDeviceIds_Max20', JSON.stringify(this.deviceIdsEntity)).subscribe((response: any) => {

      if (response.success == 1 && response.data.length > 0) {
        document.getElementById('divDriverChart').style.display = 'block';
        this.entityDashboard = response.data;
        let tDistance = 0;
        let tImpression = 0;
        this.entityDashboard.forEach(function (tracking) {
          tDistance += tracking.totalDistance;
          tImpression += tracking.totalImpression;
        });

        // this.totalDistance = numeral(tDistance).format('0,0');//tổng km của tất cả tài xế theo kh đó
        // this.numAnim.reset();
        this.numAnim.pauseResume();
        document.getElementById('myTotalDistance').innerHTML = numeral(tDistance).format('0,0');
        //this.totalImpression = numeral(tImpression).format('0,0');//tổng impression của tất cả tài xế theo kh đó
        this.numAnimTotalImpression.pauseResume();
        document.getElementById('myTotalImpression').innerHTML = numeral(tImpression).format('0,0');

        //this.totalDriver = cars.length;//tổng tất cả tài xế theo kh đó
        this.numAnimTotalDriver.pauseResume();
        document.getElementById('mytotalDriver').innerHTML = numeral(cars.length).format('0,0');
        //document.getElementById('xemthongke').removeAttribute("disabled");
        this.isLoadFinish = true;
        //lấy top 20 tài xế
        this.entityTop20Driver = response.data.slice(0, 20);
        //bar chart
        let drivers = this.entityTop20Driver || [];
        var rData = [];
        drivers.forEach(function (driver) {
          let element = {
            label: driver.fullname,
            data: Math.floor(driver.totalImpression)
          };
          rData.push(element);
        });
        this.resultbarChartData = rData;
        $('#divDriverChart').html(''); //remove canvas
        $('#divDriverChart').html('<canvas id="driverCanvas"></canvas>'); //add lại
        var driverChartOption = {
          type: 'bar',
          data: {
            labels: this.resultbarChartData.map(item => item.label),
            datasets: [{
              backgroundColor: '#03A9F4',
              borderColor: '#3F51B5',
              label: 'Impression',
              data: this.resultbarChartData.map(item => item.data),
            }],
          },
          options: {
            scales: {
              xAxes: [{ display: false }],
              yAxes: [{
                ticks: {
                  beginAtZero: true
                }
              }]
            },
            responsive: true
          }
        };
        this.driverChart = [];
        this.driverChart = new Chart('driverCanvas', driverChartOption);
      } else {
        console.log('ko có data');
        document.getElementById('divDriverChart').style.display = 'none';
        this.driverChart = [];
        this.totalDistance = 0;
        this.totalImpression = 0;
        this.totalDriver = 0;
      }
    }, error => this._dataService.handleError(error));

    //vẽ pie chart theo điểm
    this._dataService.post('/trackings/getPieChartbyDeviceIds_Max10', JSON.stringify(this.deviceIdsEntity)).subscribe((response: any) => {
      if (response.success == 1 && response.data.length > 0) {
        document.getElementById('divDistrictChart').style.display = 'block';
        const backgroundColor = [
          '#2196F3',
          '#03A9F4',
          '#F44336',
          '#E91E63',
          '#9C27B0',
          '#4CAF50',
          '#FFC107',
          '#00FF00',
          '#607D8B'
        ];
        this.resultpieChartData = response.data;
        $('#divDistrictChart').html(''); //remove canvas
        $('#divDistrictChart').html('<canvas id="districtCanvas"></canvas>'); //add lại
        var pieDistrictOption = {
          type: 'pie',
          data: {
            labels: this.resultpieChartData.map(item => item.label),
            datasets: [{
              data: this.resultpieChartData.map(item => item.data),
              backgroundColor: backgroundColor,
            }],
          },
          options: {
            legend: { position: 'right' },
            tooltips: {
              intersect: false,
              callbacks: {
                label: function (tooltipItem, data) {
                  var dataset = data.datasets[tooltipItem.datasetIndex];
                  var total = dataset.data.reduce(function (previousValue, currentValue, currentIndex, array) {
                    return previousValue + currentValue;
                  });
                  var currentValue = dataset.data[tooltipItem.index];
                  var precentage = Math.floor(((currentValue / total) * 100) + 0.5);
                  return precentage + "%";
                }
              }
            }
          }
        };
        this.districtChart = [];
        this.districtChart = new Chart('districtCanvas', pieDistrictOption);
      } else {
        this.districtChart = [];
        document.getElementById('divDistrictChart').style.display = 'none';
      }
    }, error => this._dataService.handleError(error));
  }
}

export interface IDataChart {
  label: any;
  data: any;
}

export interface IDataPieChart {
  label: any;
  data: any;
}
