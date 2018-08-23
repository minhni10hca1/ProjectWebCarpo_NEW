import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { DataService } from '../../core/services/data.service';
import { NotificationService } from '../../core/services/notification.service';
import { UtilityService } from '../../core/services/utility.service';
import { MessageContstants } from '../../core/common/message.constants';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { AuthenService } from '../../core/services/authen.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
@Component({
  selector: 'app-area',
  templateUrl: './area.component.html',
  styleUrls: ['./area.component.css']
})
export class AreaComponent implements OnInit {

  @ViewChild('addEditModal') public addEditModal: ModalDirective;
  public totalRow: number;
  public pageIndex: number = 1;
  public pageSize: number = 10;
  public pageDisplay: number = 10;
  public filter: string = '';
  public entity: any;

  public areas: any[];
  //filter
  public filterAreaCode: string = '';

  constructor(
    private _dataService: DataService,
    private _notificationService: NotificationService,
    private _utilityService: UtilityService,
    public _authenService: AuthenService,
    private _ng4LoadingSpinnerService: Ng4LoadingSpinnerService
  ) {
  }

  ngOnInit() {
    this._ng4LoadingSpinnerService.show();
    this.search();
  }
  //Load data
  public search() {
    this._dataService.get('/areas/paging?page='
      + this.pageIndex + '&pageSize='+ this.pageSize
      + '&filter=' + this.filterAreaCode)
      .subscribe((response: any) => {
        if (response.success == 1 && response.data != []) {
          this.areas = response.data;
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
    this.filterAreaCode = '';
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
    this._dataService.deleteId('/areas/delete', id).subscribe((response: any) => {
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
      this._dataService.post('/areas/add', JSON.stringify(this.entity)).subscribe((response: any) => {
        this._ng4LoadingSpinnerService.hide();
        this.search();
        this.addEditModal.hide();
        form.resetForm();
        this._notificationService.printSuccessMessage(MessageContstants.CREATED_OK_MSG);
      }, error => this._dataService.handleError(error));
    }
    else {
      this._dataService.put('/areas/update/' + this.entity._id, JSON.stringify(this.entity)).subscribe((response: any) => {
        this._ng4LoadingSpinnerService.hide();
        this.search();
        this.addEditModal.hide();
        form.resetForm();
        this._notificationService.printSuccessMessage(MessageContstants.UPDATED_OK_MSG);
      }, error => this._dataService.handleError(error));
    }
  }
  loadDetail(id: any) {
    this._dataService.get('/areas/detail/' + id)
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
}
