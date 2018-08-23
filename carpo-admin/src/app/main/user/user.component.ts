import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DataService } from '../../core/services/data.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { NotificationService } from '../../core/services/notification.service';
import { UploadService } from '../../core/services/upload.service';
import { AuthenService } from '../../core/services/authen.service';
import { UtilityService } from '../../core/services/utility.service';

import { MessageContstants } from '../../core/common/message.constants';
import { SystemConstants } from '../../core/common/system.constants';

import { IMultiSelectOption } from 'angular-2-dropdown-multiselect';

//dùng http get api của ní
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

declare var moment: any;
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  @ViewChild('modalAddEdit') public modalAddEdit: ModalDirective;
  // @ViewChild('photo') photo;
  public myRoles: string[] = [];
  public pageIndex: number = 1;
  public pageSize: number = 50;
  public totalRow: number;
  public filter: string = '';
  public users: any[];
  public entity: any;
  public baseFolder: string = SystemConstants.BASE_API;
  is_edit: boolean;
  is_required: boolean;
  //filter
  public filterRoleCode: string = '';
  public filterStatus: string = '';
  //end filter
  public dateOptions: any = {
    locale: { format: 'DD/MM/YYYY' },
    alwaysShowCalendars: false,
    singleDatePicker: true
  };
  public customers: any[]; //ds combo kh
  public cargroups: any[]; //ds combo cargroup
  constructor(private _dataService: DataService,
    private _notificationService: NotificationService,
    private _utilityService: UtilityService,
    private _uploadService: UploadService,
    public _authenService: AuthenService,
    public httpClient: HttpClient
  ) {
    this.is_edit = false;
    this.is_required = true;
  }

  ngOnInit() {
    this.entity = {
      password: '',
      confirmPassword: ''
    }
    this.loadData();
    this.loadCustomers();
    this.loadCarGroups();
  }
  public selectedRoleCode(event) {
    let value = event.target.value;
    this.loadData();
  }
  public selectedStatus(event) {
    let value = event.target.value;
    this.loadData();
  }
  loadData() {
    this._dataService.get('/users/paging?page=' + this.pageIndex + '&pageSize=' + this.pageSize
      + '&filter=' + this.filter
      + '&role_code=' + this.filterRoleCode
      + '&status=' + this.filterStatus
    )
      .subscribe((response: any) => {
        if (response.success == 1 && response.data != []) {
          this.users = response.data;
          this.pageIndex = response.PageIndex;
          this.pageSize = response.PageSize;
          this.totalRow = response.TotalRows;
        }
      }
      , (error) => {
        this._dataService.handleError(error);
      });
  }
  loadUserDetail(id: any) {
    this._dataService.get('/users/detail/' + id)
      .subscribe((response: any) => {
        if (response.success == 1 && response.data != []) {
          this.entity = response.data;
          this.entity.birthday = moment(new Date(this.entity.birthday)).format('DD/MM/YYYY');
        }
      }, (error) => {
        this._dataService.handleError(error);
      });
  }
  pageChanged(event: any): void {
    this.pageIndex = event.page;
    this.loadData();
  }
  showAddModal() {
    this.is_required = true;
    this.is_edit = false;
    this.entity = {};
    this.entity.password = '';
    this.entity.confirmPassword = '';
    this.modalAddEdit.show();
  }
  showEditModal(id: any) {
    this.is_required = false;
    this.is_edit = true;
    this.loadUserDetail(id);
    this.modalAddEdit.show();
  }
  saveChange(form: NgForm) {
    if (form.valid) {
      this.saveData(form);
    }
  }
  private saveData(form: NgForm) {
    if (this.entity._id == undefined) {
      this._dataService.post('/users/signup', JSON.stringify(this.entity)).subscribe((response: any) => {
        //chạy thêm api của ní để đăng ký gì đó...
        this.registerfromWeb();
        this.loadData();
        this.modalAddEdit.hide();
        form.resetForm();
        this._notificationService.printSuccessMessage(MessageContstants.CREATED_OK_MSG);
      }, error => this._dataService.handleError(error));
    }
    else {
      this._dataService.put('/users/update/' + this.entity._id, JSON.stringify(this.entity))
        .subscribe((response: any) => {
          this.loadData();
          this.modalAddEdit.hide();
          form.resetForm();
          this._notificationService.printSuccessMessage(MessageContstants.UPDATED_OK_MSG);
        }, error => this._dataService.handleError(error));
    }
  }
  deleteItem(id: any) {
    this._notificationService.printConfirmationDialog(MessageContstants.CONFIRM_DELETE_MSG, () => this.deleteItemConfirm(id));
  }
  deleteItemConfirm(id: any) {
    this._dataService.deleteId('/users/delete', id).subscribe((response: Response) => {
      this._notificationService.printSuccessMessage(MessageContstants.DELETED_OK_MSG);
      this.loadData();
    });
  }
  public selectSex(event) {
    this.entity.sex = event.target.value
  }

  public selectedDate(value: any) {
    this.entity.birthday = moment(value.end._d).format('DD/MM/YYYY');
  }

  //load combo danh sách khách hàng
  private loadCustomers() {
    this._dataService.get('/customers/getCombo').subscribe((response: any[]) => {
      this.customers = response;
    }, error => this._dataService.handleError(error));
  }
  //load combo danh sách car group
  private loadCarGroups() {
    this._dataService.get('/cargroups/getCombo').subscribe((response: any[]) => {
      this.cargroups = response;
    }, error => this._dataService.handleError(error));
  }
  //api đăng ký bên ní
  private registerfromWeb(): any {
    this._dataService.getApiNi('/register-user-from-web?phone=' + this.entity.phone + '&password=' + this.entity.password)
      .subscribe((response: any) => {
        if (response.status == 0) {
          this._notificationService.printErrorMessage('Đăng ký api mobile không thành công, Vui lòng xem lại Api!');
        }
        console.log(response);
      }, (error) => {
        console.log(error);
        this._notificationService.printErrorMessage('Đăng ký api mobile không thành công, Vui lòng xem lại Api!');
      });
  }
}
