import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { DataService } from '../../core/services/data.service';
import { NotificationService } from '../../core/services/notification.service';
import { UtilityService } from '../../core/services/utility.service';
import { MessageContstants } from '../../core/common/message.constants';
import { AuthenService } from '../../core/services/authen.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Lightbox } from 'angular2-lightbox';

@Component({
  selector: 'app-driver',
  templateUrl: './driver.component.html',
  styleUrls: ['./driver.component.css']
})
export class DriverComponent implements OnInit {
  public drivername: String;
  public drivers: any[];
  public driversPersonnal: any[];
  public driversPersonnalScroll: any[];
  public campaigns: any[]; //combo hợp đồng
  private p_userId: String;
  entityDriver: any;
  driverFilter: any = { license_plate: '' };
  constructor(
    private _dataService: DataService,
    private _notificationService: NotificationService,
    private _utilityService: UtilityService,
    public _authenService: AuthenService,
    private _ng4LoadingSpinnerService: Ng4LoadingSpinnerService,
    private activatedRoute: ActivatedRoute,
    private _lightbox: Lightbox
  ) {
  }

  ngOnInit() {
    this.drivername = '';
    this.activatedRoute.params.subscribe((params: Params) => {
      this.p_userId = params['id'];
    });
    this.search();
    this.loadListUserScroll();
    this.loadCampaigns();
  }

   //load combo danh sách hợp đồng
   private loadCampaigns() {
    this._dataService.get('/campaigns/getCombo').subscribe((response: any[]) => {
      this.campaigns = response;
    });
  }

  public selectedCampaign(event) {
    let campaign_id = event.target.value;
    //console.log('value campaign',campaign_id);
    this._dataService.get('/cars/getListCarByCampaignID_Evidence/' + campaign_id)
    .subscribe((response: any) => {
      this.driversPersonnalScroll = response.data;
     // console.log('driver scroll:' + JSON.stringify(this.driversPersonnalScroll));
      if (this.driversPersonnalScroll.length > 0) {
        
      } else {
        // this._ng4LoadingSpinnerService.hide();
      }
    }, error => this._dataService.handleError(error));
  }

  open(index: number): void {
    // open lightbox
    this._lightbox.open(this.drivers, index);
  }

  openPersonnal(index: number): void {
    // open lightbox
    this._lightbox.open(this.driversPersonnal, index);
  }

  //Load data
  public search() {
    this._ng4LoadingSpinnerService.show();
    this._dataService.get('/evidences/findListImgUser/' + this.p_userId)
      .subscribe((response: any) => {
        if (response.success == 1 && response.data != []) {
          var resDrivers = [];
          var resDriversPersonnal = [];
          let itemname = '';
          response.data.forEach(function(item) {
            // this.drivername = item.user_id.fullname;
            let type = item.type;
            itemname = item.user_id.fullname;
            const album = {
              src: item.image,
              caption: item.created_date,
              thumb: item.image
            };
            if(type == 1){
              // hinh chung minh 
              resDrivers.push(album);  
            }else{
              // hinh ca nhan
              resDriversPersonnal.push(album);
            }
                      
          });
          this.drivername = itemname;
         // console.log('this.drivername',this.drivername);
          this.drivers = resDrivers;
          this.driversPersonnal = resDriversPersonnal;
          this._ng4LoadingSpinnerService.hide();
        } else {
          this.drivers = [];
          this._ng4LoadingSpinnerService.hide();
        }
      }, error => this._dataService.handleError(error));
  }

  // load list user in scroll
public loadListUserScroll() {
  // this._ng4LoadingSpinnerService.show();
  this._dataService.get('/cars/getListCarByCustomerID_Evidence')
    .subscribe((response: any) => {
      this.driversPersonnalScroll = response.data;
     // console.log('driver scroll:' + JSON.stringify(this.driversPersonnalScroll));
      if (this.driversPersonnalScroll.length > 0) {
        
      } else {
        // this._ng4LoadingSpinnerService.hide();
      }
    }, error => this._dataService.handleError(error));
}

// show info user
public showInfoDriver(Id: string) {
  //console.log('show info:' + Id );
   this.p_userId = Id;
   this.search();
}

}


