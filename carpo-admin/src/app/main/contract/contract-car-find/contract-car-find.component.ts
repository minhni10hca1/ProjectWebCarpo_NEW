import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../core/services/data.service';
import { Response } from '@angular/http';
import { Subject } from 'rxjs/Subject';
import { AuthenService } from '../../../core/services/authen.service';
import { NotificationService } from '../../../core/services/notification.service';
import { UtilityService } from '../../../core/services/utility.service';
import { MessageContstants } from '../../../core/common/message.constants';
declare var moment: any;
@Component({
  selector: 'app-contract-car-find',
  templateUrl: './contract-car-find.component.html',
  styleUrls: ['./contract-car-find.component.css']
})
export class ContractCarFindComponent implements OnInit {
  public entity: any[];
  public filter: string = '';
  constructor(
    private _dataService: DataService,
    public _authenService: AuthenService,
    private _notificationService: NotificationService,
    private _utilityService: UtilityService,
  ) { }

  ngOnInit() {
    this.filter = "";
    this.search();
  }
  //Load data
  public search() {
    this._dataService.get('/campaigns/findOneByDeviceId?filter=' + this.filter)
      .subscribe((response: any) => {
        if (response.success == 1 && response.data.length > 0) {
          this.entity = response.data;
        } else {
          this.entity = [];
        }
      }, error => this._dataService.handleError(error));
  }
}
