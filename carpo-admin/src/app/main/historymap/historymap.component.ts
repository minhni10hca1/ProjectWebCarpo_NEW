import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DataService } from '../../core/services/data.service';
import { NotificationService } from '../../core/services/notification.service';
import { UtilityService } from '../../core/services/utility.service';
import { MessageContstants } from '../../core/common/message.constants';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { IOption } from 'ng-select';

declare var google: any;
declare var moment: any;
@Component({
  selector: 'app-historymap',
  templateUrl: './historymap.component.html',
  styleUrls: ['./historymap.component.css']
})
export class HistorymapComponent implements OnInit {
  public DEFAULT_ZOOM_LEVEL: number = 15;
  lat: number = 10.823099;
  lng: number = 106.629664;
  icons = {
    end: new google.maps.MarkerImage('http://maps.google.com/mapfiles/ms/icons/red-dot.png'),
    start: new google.maps.MarkerImage('http://maps.google.com/mapfiles/ms/icons/blue-dot.png')
  };
  public directionsDisplay = new google.maps.DirectionsRenderer({ 'draggable': true });
  public directionsService = new google.maps.DirectionsService();
  private map;
  public carResponse: any[]; //combo tài xế
  public coordinates: any[];
  carOptions: Array<IOption> = [];

  public filterDevice_Id: string = '';
  public filterStartDate: string = '';
  public filterEndDate: string = '';
  public dateOptions: any = {
    locale: { format: 'DD/MM/YYYY' },
    alwaysShowCalendars: false,
    singleDatePicker: true
  };

  itemList = [];
  selectedItems = [];
  settings = {};
  constructor(
    private _dataService: DataService,
    private _notificationService: NotificationService,
    private _utilityService: UtilityService,
    private _ng4LoadingSpinnerService: Ng4LoadingSpinnerService
  ) {
  }

  ngOnInit() {
    this.settings = {
      singleSelection: true, text: "Chọn tài xế",
      enableSearchFilter: true,
      classes: "myclass custom-class-example"
    };
    this.loadComboCar(); //combo tài xế
    this.filterStartDate = moment(new Date(Date.now())).format('DD/MM/YYYY');
    this.filterEndDate = moment(new Date(Date.now())).format('DD/MM/YYYY');
    this.initMap();
  }

  //load combo tài xế
  private loadComboCar() {
    this._dataService.get('/campaigns/getComboCarByCustomerID')
      .subscribe((response: any[]) => {
        this.carResponse = response;
        this.carResponse.forEach(i => {
          this.itemList.push(
            {
              "id": i.value,
              "itemName": i.label
            });
        });
      }, error => this._dataService.handleError(error));
  }
  //Load data
  public search() {
    if (this.filterDevice_Id != "") {
      var start_time = moment(this.filterStartDate, ["DD/MM/YYYY", "YYYY-MM-DD"]);
      var end_time = moment(this.filterEndDate, ["DD/MM/YYYY", "YYYY-MM-DD"]);
      /* using diff */
      var duration = end_time.diff(start_time, 'days') + 1;
      if (duration > 1) {
        this._notificationService.printWarningMessage('Vui lòng chọn mốc thời gian trong 1 ngày!');
        return;
      }
      this.initMap();
      this._ng4LoadingSpinnerService.show();
      this._dataService.get('/trackings/findAllRankDate?'
        + 'startDate=' + this.filterStartDate
        + '&endDate=' + this.filterEndDate + '&device_id=' + this.filterDevice_Id)
        .subscribe((response: any) => {
          //length > 2 điểm thì vẽ
          if (response.success == 1 && response.data.length > 2) {

            var cPoint = Math.floor(response.data.length / 2);
            this.coordinates = response.data;
            // console.log('coordinates' , this.coordinates);
            var mapOptions = {
              zoom: this.DEFAULT_ZOOM_LEVEL,
              center: new google.maps.LatLng(this.coordinates[cPoint].lat, this.coordinates[cPoint].lng),
              mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            this.map = new google.maps.Map(document.getElementById('map'), mapOptions);
            var polyline = new google.maps.Polyline({
              path: this.coordinates,
              strokeColor: '#4a8fe3',
              strokeOpacity: 0.8,
              strokeWeight: 4,
              geodesic: true,
              icons: [{
                icon: {
                  path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                  strokeWeight: 1,
                  strokeColor: '#001a35',
                  fillColor: '#fff',
                  fillOpacity: 1,
                  scale: 2.5,
                },
                offset: '100%',
                repeat: '200px',
              }],
            });

            polyline.setMap(this.map);
            var marker1 = new google.maps.Marker({
              position: this.coordinates[0],
              map: this.map,
              title: "Bắt đầu",
              icon: this.icons.start
            });

            var marker2 = new google.maps.Marker({
              position: this.coordinates[this.coordinates.length - 1],
              map: this.map,
              title: "Kết thúc",
              icon: this.icons.end
            });

            const bounds = new google.maps.LatLngBounds();
            for (let i = 0; i < this.coordinates.length; i++) {
              bounds.extend(this.coordinates[i]);
            }
            this.map.fitBounds(bounds);
            this._notificationService.printSuccessMessage(MessageContstants.FIND_SUCCESS_MSG);
            this._ng4LoadingSpinnerService.hide();
          } else {
            this._notificationService.printWarningMessage(MessageContstants.NOTFIND_WARNING_MSG);
            this._ng4LoadingSpinnerService.hide();
          }
        }, error => this._dataService.handleError(error));
    } else {
      this._notificationService.printWarningMessage(MessageContstants.VALID_WARNING_MSG);
    }
  }
  public initMap() {
    var myLatLng = { lat: this.lat, lng: this.lng };

    this.map = new google.maps.Map(document.getElementById('map'), {
      zoom: this.DEFAULT_ZOOM_LEVEL,
      center: myLatLng,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    var marker = new google.maps.Marker({
      position: myLatLng,
      map: this.map,
      title: 'Carpo!'
    });
  }

  public changeStartDate(value: any) {
    this.filterStartDate = moment(new Date(value.end._d)).format('DD/MM/YYYY');
  }
  public changeEndDate(value: any) {
    this.filterEndDate = moment(new Date(value.end._d)).format('DD/MM/YYYY');
  }

  onItemSelect(item: any) {
    this.filterDevice_Id = item.id;
    console.log('item', this.filterDevice_Id);
  }
  OnItemDeSelect(item: any) {
    this.filterDevice_Id = "";
    console.log('item', this.filterDevice_Id);
  }
}
