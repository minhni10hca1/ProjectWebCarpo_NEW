import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { DataService } from '../../core/services/data.service';
import { NotificationService } from '../../core/services/notification.service';
import { UtilityService } from '../../core/services/utility.service';
import { MessageContstants } from '../../core/common/message.constants';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AuthenService } from '../../core/services/authen.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
// import { NgSelectModule, NgOption } from '@ng-select/ng-select';
import { IOption } from 'ng-select';

@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.css']
})
export class CarComponent implements OnInit {

  @ViewChild('addEditModal') public addEditModal: ModalDirective;
  public totalRow: number;
  public pageIndex: number = 1;
  public pageSize: number = 50;
  public pageDisplay: number = 10;
  public filter: string = '';
  public entity: any;

  public cars: any[];
  //filter
  public filterLicense_plate: string = '';
  public filterDevice_id: string = '';
  //end filter
  public cargroups: any[]; //combo leader
  public campaigns: any[]; //combo hợp đồng
  public cargroupOptions: Array<IOption> = [{
    label: '--Vui lòng chọn--',
    value: ''
  }];
  public comboUsers: any[]; //combo hợp đồng
  public comboUserOptions: Array<IOption> = [{
    label: '--Vui lòng chọn--',
    value: ''
  }];
  public checkedItems: any[];
  constructor(
    private _dataService: DataService,
    private _notificationService: NotificationService,
    private _utilityService: UtilityService,
    public _authenService: AuthenService,
    private _ng4LoadingSpinnerService: Ng4LoadingSpinnerService
  ) {
    this.checkedItems = [];
  }

  ngOnInit() {
    this._ng4LoadingSpinnerService.show();
    this.search();
    this.loadCargoups(); //load combo cargroup
    this.loadUsers(); //load combo user
    this.loadCampaigns(); //load combo hợp đồng
  }
  //Load data
  public search() {
    this._dataService.get('/cars/paging?page='
      + this.pageIndex + '&pageSize=' + this.pageSize
      + '&device_id=' + this.filterDevice_id
      + '&license_plate=' + this.filterLicense_plate)
      .subscribe((response: any) => {
        if (response.success == 1 && response.data != []) {
          this.cars = response.data;
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
    this.filterLicense_plate = '';
    this.filterDevice_id = '';
    this.search();
  }
  //Show add form
  public showAdd() {
    this.entity = {};
    this.addEditModal.show();
  }
  //Show edit form
  public showEdit(id: number) {
    this._ng4LoadingSpinnerService.show();
    this.loadDetail(id);
  }
  //Action delete
  public deleteConfirm(id: string): void {
    this._dataService.deleteId('/cars/delete', id).subscribe((response: any) => {
      this._notificationService.printSuccessMessage(MessageContstants.DELETED_OK_MSG);
      this.search();
    }, error => this._dataService.handleError(error));
  }
  //Click button delete turn on confirm
  public delete(id: string) {
    this._notificationService.printConfirmationDialog(MessageContstants.CONFIRM_DELETE_MSG, () => this.deleteConfirm(id));
  }

  //Save change for modal popup
  public saveChanges(form: NgForm) {
    if (form.valid) {
      this.saveData(form);
    }
  }
  private saveData(form: NgForm) {
    this._ng4LoadingSpinnerService.show();
    if (this.entity._id == undefined) {
      this._dataService.post('/cars/add', JSON.stringify(this.entity)).subscribe((response: any) => {
        this._ng4LoadingSpinnerService.hide();
        this.search();
        this.addEditModal.hide();
        form.resetForm();
        this._notificationService.printSuccessMessage(MessageContstants.CREATED_OK_MSG);
      }, error => this._dataService.handleError(error));
    }
    else {
      this._dataService.put('/cars/update/' + this.entity._id, JSON.stringify(this.entity)).subscribe((response: any) => {
        this._ng4LoadingSpinnerService.hide();
        this.search();
        this.addEditModal.hide();
        form.resetForm();
        this._notificationService.printSuccessMessage(MessageContstants.UPDATED_OK_MSG);
      }, error => this._dataService.handleError(error));
    }
  }
  loadDetail(id: any) {
    this._dataService.get('/cars/detail/' + id)
      .subscribe((response: any) => {
        if (response.success == 1 && response.data != []) {
          this.entity = response.data;
          this._ng4LoadingSpinnerService.hide();
          this.addEditModal.show();
        } else {
          this._ng4LoadingSpinnerService.hide();
          this.addEditModal.show();
        }
      }, error => this._dataService.handleError(error));
  }
  public pageChanged(event: any): void {
    this.pageIndex = event.page;
    this.search();
  }

  //load combo cargroup
  private loadCargoups() {
    this._dataService.get('/cargroups/getCombo').subscribe((response: any[]) => {
      this.cargroups = response;
      this.cargroups.forEach(i => {
        this.cargroupOptions.push(
          {
            "label": i.full_name + ' - ' + i.phone,
            "value": i._id
          });
      });
    });
  }

  //load combo người dùng
  private loadUsers() {
    this._dataService.get('/users/getComboClientbyRoleCode?role_code=2').subscribe((response: any[]) => {
      this.comboUsers = response;
      this.comboUsers.forEach(i => {
        this.comboUserOptions.push(
          {
            "label": i.fullname,
            "value": i._id
          });
      });
    });
  }
  //load combo danh sách hợp đồng
  private loadCampaigns() {
    this._dataService.get('/campaigns/getCombo').subscribe((response: any[]) => {
      this.campaigns = response;
    });
  }
}

