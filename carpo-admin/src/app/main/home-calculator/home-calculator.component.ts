import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { DataService } from '../../core/services/data.service';
import { NotificationService } from '../../core/services/notification.service';
import { MessageContstants } from '../../core/common/message.constants';
@Component({
  selector: 'app-home-calculator',
  templateUrl: './home-calculator.component.html',
  styleUrls: ['./home-calculator.component.css']
})
export class HomeCalculatorComponent implements OnInit {
  //khai bao bien
  public entity: any;
  constructor(
    private _dataService: DataService,
    private _notificationService: NotificationService
  ) { }

  ngOnInit() {
    //lay du lieu
    this.loadDetail('90708');
  }

  //lay du lieu
  loadDetail(id: any) {
    this._dataService.get('/homeCalculators/detail/' + id)
      .subscribe((response: any) => {
        if (response.success == 1 && response.data != []) {
          this.entity = response.data;
        }
      }, error => this._dataService.handleError(error));
  }

  //Save change for modal popup
  public saveChanges() {
    console.log('saveChanges');
    this.saveData();
  }
  private saveData() {
    if (this.entity._id == undefined) {
      console.log('add');
      console.log(JSON.stringify(this.entity));
      
      // this._dataService.post('/areas/add', JSON.stringify(this.entity)).subscribe((response: any) => {
      //   form.resetForm();
      //   this._notificationService.printSuccessMessage(MessageContstants.CREATED_OK_MSG);
      // }, error => this._dataService.handleError(error));
    }
    else {
      console.log('update');
      console.log(JSON.stringify(this.entity));
      let newEntity = {        
        device_id: this.entity.device_id,
        total_km_yesterday: this.entity.total_km_yesterday,
      }
      console.log(JSON.stringify(newEntity))
      this._dataService.put('/homeCalculators/update', JSON.stringify(this.entity)).subscribe((response: any) => {
        //form.resetForm();
        console.log('respon:' + response);
        this._notificationService.printSuccessMessage(MessageContstants.UPDATED_OK_MSG);
      }, error => this._dataService.handleError(error));
    }
  }
}
