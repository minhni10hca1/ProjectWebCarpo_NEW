import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DataService } from '../../core/services/data.service';
import { NotificationService } from '../../core/services/notification.service';
import { UtilityService } from '../../core/services/utility.service';
import { MessageContstants } from '../../core/common/message.constants';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

import * as _ from 'lodash';

declare var google: any;
@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.css']
})
export class TrackingComponent implements OnInit {
  driverFilter: any = { license_plate: '' };
  iconObj = {
    runing: "/assets/images/marker-runing.png",
    pause: "/assets/images/marker-pause.png",
    stop: "/assets/images/marker-stop.png"
  }
  public DEFAULT_ZOOM_LEVEL: number = 13;
  public DRIVER_ZOOM_LEVEL: number = 11;
  lat: number = 10.776666;
  lng: number = 106.680387;
  public map;
  public markers = [];
  private drivers: any[];
  private vietMapDrivers: any[];
  public listDriversConvert: any[];
  public listDriversScroll: any[];
  public checkUndefined: boolean = false;
  private locations = [];
  entityDriver: any;
  constructor(
    private _dataService: DataService,
    private _notificationService: NotificationService,
    private _utilityService: UtilityService,
    private _ng4LoadingSpinnerService: Ng4LoadingSpinnerService
  ) {
  }

  ngOnInit() {
    this.initMap();
    this.loadListCarByCustomerID();
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

  //load combo tài xế
  public loadListCarByCustomerID() {
    // this._ng4LoadingSpinnerService.show();
    this._dataService.get('/campaigns/getListCarByCustomerID')
      .subscribe((response: any[]) => {
        this.drivers = response;
        if (this.drivers.length > 0) {
          this.getTracking(this.drivers); //tọa độ cuối cùng vietmap
        } else {
          // this._ng4LoadingSpinnerService.hide();
        }
      }, error => this._dataService.handleError(error));
  }

  //load tọa độ cuối cùng của tất cả tài xế vietmap
  getTracking(cus_drivers: any[]) {
    this._dataService.get('/trackings/getvehiclestatuses')
      .subscribe((response: any) => {
        if (response.success == 1 && response.data.length > 0) {
          if (response.data.length > 0) {
            var listDriversResponse = response.data;
            this.listDriversConvert = _.map(cus_drivers, function (item) {
              return _.merge(item, _.find(listDriversResponse, { 'Id': item.Id }));
            });
          } else {
            this.listDriversConvert = [];
          }
          if (this.listDriversConvert[0] == undefined) {
            this.checkUndefined = true;
          } else {
            this.listDriversConvert.forEach(i => {
              if (i != undefined) {
                var imgStatus = this.iconObj.stop;
                var state = '<p style="color:#f56954;">đang tắt máy</p>';
                if (i.Status == 1) {
                  imgStatus = (i.Speed > 0 && i.Speed > 0) ? this.iconObj.runing : this.iconObj.pause;
                  state = i.Speed > 0 ? ('<p style="color:#00a65a;">đang chạy</p>') : ('<p style="color:#f39c12;">đang dừng</p>');
                }
                if (i.X != undefined)
                  this.locations.push({
                    title: i.name,
                    phone: i.phone,
                    license_plate: i.license_plate,
                    state: state,
                    icon: imgStatus,
                    location: {
                      lat: i.Y,
                      lng: i.X
                    }
                  });
              }
              // console.log('this.locations', this.locations.length);
              // console.log('this.locations.data', this.locations);
            });
            this.map = new google.maps.Map(document.getElementById('map'), {
              zoom: this.DRIVER_ZOOM_LEVEL,
              center: this.locations[0].location,
              mapTypeId: google.maps.MapTypeId.ROADMAP
            });
            var infowindow = new google.maps.InfoWindow();
            for (var i = 0; i < this.locations.length; i++) {
              var position = this.locations[i].location;
              var title = this.locations[i].title;
              var phone = this.locations[i].phone;
              var license_plate = this.locations[i].license_plate;
              var state = this.locations[i].state;
              var marker = new google.maps.Marker({
                position: position,
                title: title,
                state:state,
                license_plate:license_plate,
                animation: google.maps.Animation.DROP,
                id: i,
                icon: this.locations[i].icon,
                draggable: false,
                map: this.map,
              });
              // var infoWindowContent = '<div class="info_content">' +
              //   '<h4>' + 'Tài xế - ' + title + ' | ' + license_plate + '</h4>' +
              //   '<p style="color:#f56954;">đang tắt máy</p>' +
              //   '</div>';
              // var infoWindowContent = '<div class="info_content">' +
              // '<h4>' + 'Tài xế - ' + marker.title + ' | ' + license_plate + '</h4>' +
              // '<p style="color:#f56954;">đang tắt máy</p>' +
              // '</div>';
              google.maps.event.addListener(marker, 'click', (function (marker, i) {
                return function () {
                        var infoWindowContent = '<div class="info_content">' +
              '<h4>' + 'Tài xế - ' + marker.title + ' | ' + marker.license_plate + '</h4>' +
              '<p style="color:#f56954;">'+ marker.state  + '</p>' +
              '</div>';
                  infowindow.setContent(infoWindowContent);
                  infowindow.open(this.map, marker);
                  // console.log('infoWindowContent', infoWindowContent);
                  // console.log('this.map', marker);
                }
              })(marker, i));
            }
          }
          // this._ng4LoadingSpinnerService.hide();
        } else {
          this.initMap();
        }
      }, error => this._dataService.handleError(error));
  }

  //click xem vị trí 1 tài xế
  public showMapOneDriver(Id: string) {
    this.entityDriver = this.listDriversConvert.find(x => x.Id == Id);
    //console.log('entityDriver', this.entityDriver);
    this.oneDriverMap(this.entityDriver);
  }

  //vẽ thông tin 1 tài xế
  public oneDriverMap(entity: any) {
    var driverLatLng = { lat: entity.Y, lng: entity.X }; //lat, lng
    //console.log('driverLatLng', driverLatLng);
    this.map = new google.maps.Map(document.getElementById('map'), {
      zoom: this.DEFAULT_ZOOM_LEVEL,
      center: driverLatLng,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    var image = {
      url: 'https://cdn2.iconfinder.com/data/icons/flat-style-svg-icons-part-1/512/engineer_plot_design_architect-512.png', // image is 512 x 512
      scaledSize: new google.maps.Size(22, 32),
    };
    // Create our info window content
    var infoWindowContent = '<div class="info_content">' +
      '<h3>' + entity.name + ' | ' + entity.license_plate + '</h3>' +
      '<p>' + entity.Address + '</p>' +
      '</div>';

    // Initialise the inforWindow
    var infoWindow = new google.maps.InfoWindow({
      content: infoWindowContent
    });
    var marker = new google.maps.Marker({
      position: driverLatLng,
      map: this.map,
      icon: image,
      title: entity.name
    });
    // Add circle overlay and bind to marker
    var circle = new google.maps.Circle({
      map: this.map,
      radius: 1000,          // IN METERS.
      fillColor: '#FF6600',
      fillOpacity: 0.3,
      strokeColor: "#FFF",
      strokeWeight: 0         // DON'T SHOW CIRCLE BORDER.
    });
    circle.bindTo('center', marker, 'position');
    infoWindow.open(this.map, marker);
  }
}
