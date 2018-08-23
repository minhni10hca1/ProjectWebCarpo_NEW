import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { DataService } from '../../core/services/data.service';
import { NotificationService } from '../../core/services/notification.service';
import { UtilityService } from '../../core/services/utility.service';
import { MessageContstants } from '../../core/common/message.constants';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AuthenService } from '../../core/services/authen.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { IOption } from 'ng-select';
import { ContractCarFindComponent } from './contract-car-find/contract-car-find.component';

declare var moment: any;

@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.css'],
})
export class ContractComponent implements OnInit {

  @ViewChild('addEditModal') public addEditModal: ModalDirective;
  @ViewChild('ViewModal') public ViewModal: ModalDirective;
  @ViewChild('carManageModal') public carManageModal: ModalDirective;

  //gọi form popup search
  @ViewChild('SearchCarModal') public SearchCarModal: ModalDirective;
  @ViewChild(ContractCarFindComponent) private ContractCarFindComponent: ContractCarFindComponent;
  //gọi form popup search

  public totalRow: number;
  public pageIndex: number = 1;
  public pageSize: number = 50;
  public pageDisplay: number = 10;
  public filter: string = '';
  public entity: any;
  public entityView: any;
  public campaigns: any[];
  public customers: any[]; //combo khách hàng
  public customerOptions: Array<IOption> = [{
    label: '--Vui lòng chọn--',
    value: ''
  }];
  public areaOptions: Array<IOption> = [{
    label: '--Vui lòng chọn--',
    value: ''
  }];

  public dateOptions: any = {
    locale: { format: 'DD/MM/YYYY' },
    alwaysShowCalendars: false,
    singleDatePicker: true
  };

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
    this.loadComboCustomer(); //load combobox
    this.loadComboArea(); // load combo khu vực
  }

  //Load data
  public search() {
    var strUrlParam = "pagingCustomer2";
    if (this.user.role == "Admin" || this.user.role == "Manager") {
      strUrlParam = "pagingCustomerAdmin2";
    }
    this._dataService.get('/campaigns/' + strUrlParam + '?page='
      + this.pageIndex + '&pageSize='
      + this.pageSize + '&filter=' + this.filter)
      .subscribe((response: any) => {
        if (response.success == 1 && response.data != []) {
          this.campaigns = response.data;
          this.pageIndex = response.PageIndex;
          this.pageSize = response.PageSize;
          this.totalRow = response.TotalRows;
          this._ng4LoadingSpinnerService.hide();
        } else {
          this._ng4LoadingSpinnerService.hide();
        }
      }, error => this._dataService.handleError(error));
  }
  //Show add form
  public showAdd() {
    this.entity = {};
    this.addEditModal.show();
  }
  //Show edit form
  public showEdit(id: string) {
    this._ng4LoadingSpinnerService.show();
    this.loadDetail(id);
  }

  //Show view form
  public showView(id: string) {
    this.entityView = this.campaigns.find(x => x._id == id);
    this.ViewModal.show();
  }

  //Show search form
  public showSearchCar() {
    this.ContractCarFindComponent.entity = []; //reset lại form popup
    this.ContractCarFindComponent.filter = ""; //reset lại form popup
    this.SearchCarModal.show();
  }
  //Action delete
  public deleteConfirm(id: string): void {
    this._dataService.deleteId('/campaigns/delete', id).subscribe((response: any) => {
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
      this._dataService.post('/campaigns/add', JSON.stringify(this.entity)).subscribe((response: any) => {
        this._ng4LoadingSpinnerService.hide();
        this.search();
        this.addEditModal.hide();
        form.resetForm();
        this._notificationService.printSuccessMessage(MessageContstants.CREATED_OK_MSG);
      }, error => this._dataService.handleError(error));
    }
    else {
      this._dataService.put('/campaigns/update/' + this.entity._id, JSON.stringify(this.entity)).subscribe((response: any) => {
        this._ng4LoadingSpinnerService.hide();
        this.search();
        this.addEditModal.hide();
        form.resetForm();
        this._notificationService.printSuccessMessage(MessageContstants.UPDATED_OK_MSG);
      }, error => this._dataService.handleError(error));
    }
  }

  loadDetail(id: any) {
    this._dataService.get('/campaigns/detail/' + id)
      .subscribe((response: any) => {
        if (response.success == 1 && response.data != []) {
          this.entity = response.data;
          this.entity.start_time = moment(new Date(this.entity.start_time)).format('DD/MM/YYYY');
          this.entity.end_time = moment(new Date(this.entity.end_time)).format('DD/MM/YYYY');
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

  //load customer select
  private loadComboCustomer() {
    this._dataService.get('/customers/getCombo').subscribe((response: any[]) => {
      this.customers = response;
      this.customers.forEach(i => {
        this.customerOptions.push(
          {
            "label": i.company_name,
            "value": i._id
          });
      });
    }, error => this._dataService.handleError(error));
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
  public changeStartDate(value: any) {
    this.entity.start_time = moment(new Date(value.end._d)).format('DD/MM/YYYY');
  }
  public changeEndDate(value: any) {
    this.entity.end_time = moment(new Date(value.end._d)).format('DD/MM/YYYY');
  }
}
