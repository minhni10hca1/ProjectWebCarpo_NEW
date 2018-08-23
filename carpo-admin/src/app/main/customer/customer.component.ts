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
@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {

  @ViewChild('addEditModal') public addEditModal: ModalDirective;
  public totalRow: number;
  public pageIndex: number = 1;
  public pageSize: number = 10;
  public pageDisplay: number = 10;
  public filter: string = '';
  public entity: any;

  public customers: any[];
  public customerUsers: any[]; //combo người dùng
  public customerUserOptions: Array<IOption> = [{
    label: '--Vui lòng chọn--',
    value: ''
  }];
  constructor(
    private _dataService: DataService,
    private _notificationService: NotificationService,
    private _utilityService: UtilityService,
    public _authenService: AuthenService,
    private _ng4LoadingSpinnerService: Ng4LoadingSpinnerService
  ) {
    if (_authenService.checkAccess('CUSTOMER') == false) {
      _utilityService.navigateToLogin();
    }
  }

  ngOnInit() {
    this._ng4LoadingSpinnerService.show();
    this.search();
    this.loadUsers(); //load combobox
  }
  //Load data
  public search() {
    this._dataService.get('/customers/paging2?page='
      + this.pageIndex + '&pageSize='
      + this.pageSize + '&filter=' + this.filter)
      .subscribe((response: any) => {
        if (response.success == 1 && response.data != []) {
          this.customers = response.data;
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
  public showEdit(id: number) {
    // this.entity = this.customers.find(x => x._id == id);
    // this.addEditModal.show();
    this._ng4LoadingSpinnerService.show();
    this.loadDetail(id);
  }
  //Action delete
  public deleteConfirm(id: string): void {
    this._dataService.deleteId('/customers/delete', id).subscribe((response: any) => {
      this._notificationService.printSuccessMessage(MessageContstants.DELETED_OK_MSG);
      this.search();
    }, error => this._dataService.handleError(error));
  }
  //Click button delete turn on confirm
  public delete(id: string) {
    this._notificationService.printConfirmationDialog(MessageContstants.CONFIRM_DELETE_CUSTOMER_MSG, () => this.deleteConfirm(id));
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
      this._dataService.post('/customers/add', JSON.stringify(this.entity)).subscribe((response: any) => {
        this._ng4LoadingSpinnerService.hide();
        this.search();
        this.addEditModal.hide();
        form.resetForm();
        this._notificationService.printSuccessMessage(MessageContstants.CREATED_OK_MSG);
      }, error => this._dataService.handleError(error));
    }
    else {
      this._dataService.put('/customers/update/' + this.entity._id, JSON.stringify(this.entity)).subscribe((response: any) => {
        this._ng4LoadingSpinnerService.hide();
        this.search();
        this.addEditModal.hide();
        form.resetForm();
        this._notificationService.printSuccessMessage(MessageContstants.UPDATED_OK_MSG);
      }, error => this._dataService.handleError(error));
    }
  }
  loadDetail(id: any) {
    this._dataService.get('/customers/detail/' + id)
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

  //load user select
  private loadUsers() {
    this._dataService.get('/users/getComboClientbyRoleCode?role_code=3')
      .subscribe((response: any[]) => {
        this.customerUsers = response;
        this.customerUsers.forEach(i => {
          this.customerUserOptions.push(
            {
              "label": i.fullname,
              "value": i._id
            });
        });
      }, error => this._dataService.handleError(error));
  }
}
