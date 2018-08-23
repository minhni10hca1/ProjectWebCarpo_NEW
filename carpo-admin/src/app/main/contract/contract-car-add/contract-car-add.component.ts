import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DataService } from '../../../core/services/data.service';

import { NotificationService } from '../../../core/services/notification.service';
import { UtilityService } from '../../../core/services/utility.service';
import { MessageContstants } from '../../../core/common/message.constants';
@Component({
  selector: 'app-contract-car-add',
  templateUrl: './contract-car-add.component.html',
  styleUrls: ['./contract-car-add.component.css']
})
export class ContractCarAddComponent implements OnInit {
  public campaignId: string;
  public title: string = '';
  /** begin modal gán xe cho hợp đồng */
  dropdownList = [];
  public itemAvailableCarOptions: any = []; //ds xe chưa gán hợp đồng
  selectedItemsCar = [];
  dropdownSettings = {};
  public campaignCarEntity: any = {};

  /** end modal gán xe cho hợp đồng */
  constructor(private _utilityService: UtilityService,
    private activatedRoute: ActivatedRoute,
    private _dataService: DataService,
    private _notificationService: NotificationService) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      this.campaignId = params['id'];
      this.campaignCarEntity = {
        _id: params['id']
      };
    });
    this.dropdownSettings = {
      singleSelection: false,
      text: "--Vui lòng chọn xe--",
      selectAllText: 'Tất cả',
      unSelectAllText: 'Bỏ chọn',
      enableSearchFilter: true,
      classes: "myclass custom-class"
    };
    this.itemAvailableCarOptions = [];
    this.loadAvailableCars(); //load ds những xe chưa dc gán vào hợp đồng
    this.selectedItemsCar = [];
    //load ds xe đã có trong hợp đồng
    this.search();
  }

  public search() {
    this._dataService.get('/campaigns/detailcars/' + this.campaignId + '?page=1&pageSize=10000')
      .subscribe((response: any) => {
        this.title = response.title;
        this.selectedItemsCar = [];
        if (response.success == 1 && response.data.length > 0) {
          response.data.forEach(i => {
            this.selectedItemsCar.push(
              {
                "id": i._id,
                "itemName": i.device_id,
                "capital": i.license_plate + '-' + i.car_manufacturer
              });
          });
        }
      }, error => this._dataService.handleError(error));
  }
  //Save change for modal popup cars
  public saveCampaignCars(form: NgForm) {
    if (form.valid) {
      this.campaignCarEntity.cars = {}; // object is empty
      this.campaignCarEntity.cars = this.selectedItemsCar;
      this._dataService.put('/campaigns/updateCars/' + this.campaignCarEntity._id, JSON.stringify(this.campaignCarEntity)).subscribe((response: any) => {
        this._notificationService.printSuccessMessage(MessageContstants.CREATED_OK_MSG);
        this.loadAvailableCars(); //load ds những xe chưa dc gán vào hợp đồng
        this.search();
      }, error => this._dataService.handleError(error));
    }
  }

  onItemSelect(item: any) {
    console.log('sitem', item);
    console.log(this.selectedItemsCar);
  }
  OnItemDeSelect(item: any) {
    console.log('ditem', item);
    console.log(this.selectedItemsCar);
  }
  onSelectAll(items: any) {
    this.selectedItemsCar = items;
  }
  onDeSelectAll(items: any) {
    this.selectedItemsCar = items;
  }

  //load danh sách xe chưa có hợp đồng
  private loadAvailableCars() {
    this._dataService.get('/cars/available')
      .subscribe((response: any) => {
        if (response.success == 1 && response.data != []) {
          this.dropdownList = response.data;
          this.dropdownList.forEach(i => {
            this.itemAvailableCarOptions.push(
              {
                "id": i._id,
                "itemName": i.device_id,
                "capital": i.license_plate + '-' + i.car_manufacturer
              });
          });
        }
      }, error => this._dataService.handleError(error));
  }
}
