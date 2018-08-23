import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { DataService } from '../../core/services/data.service';
import { NotificationService } from '../../core/services/notification.service';
import { UtilityService } from '../../core/services/utility.service';
import { MessageContstants } from '../../core/common/message.constants';
import { AuthenService } from '../../core/services/authen.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { DataTableDirective } from 'angular-datatables'; //dùng datatable

import * as $ from 'jquery';
import 'datatables.net';
import 'datatables.net-buttons';
@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {
  @ViewChild('ViewModal') public ViewModal: ModalDirective;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  private feedbackTable: any;
  private tableWidget: any;
  @Input() feedbackDatas: any[];
  public filterStatus: string = '';
  public entityView: any;
  constructor(
    private _dataService: DataService,
    private _notificationService: NotificationService,
    private _utilityService: UtilityService,
    public _authenService: AuthenService,
    private _ng4LoadingSpinnerService: Ng4LoadingSpinnerService,
    private el: ElementRef
  ) { }

  ngOnInit() {
    this.filterStatus = "0";
    this.search();
  }
  //Load data
  public search() {
    this.feedbackDatas = [];
    this._ng4LoadingSpinnerService.show(); //khi search mới loading còn lúc init ko cần
    this._dataService.get('/feedbacks/paging?filter=' + this.filterStatus)
      .subscribe((response: any) => {
        if (response.success == 1 && response.data.length > 0) {
          this.feedbackDatas = response.data;
        } else {
          this.feedbackDatas = [];
        }
        //init table
        if (this.tableWidget) {
          this.tableWidget.destroy();
        }
        let tableOptions: any = {
          dom: 'Bfrtip',
          buttons: [{
            text: 'Xuất Excel',
            extend: 'excel',
            title: "Báo cáo phản hồi khách hàng",
            exportOptions: {
              columns: [0, 1, 2, 4, 5],
              orthogonal: 'export',
            },
          }],
          data: this.feedbackDatas,
          pagingType: 'full_numbers',
          pageLength: 50,
          autoWidth: false,
          processing: true,
          stateSave: true,
          columns: [
            { title: 'Tài xế', data: 'user_id.fullname' },
            { title: 'Điện thoại', data: 'user_id.phone' },
            {
              title: 'Nội dung', data: 'message',
              render: function (data, type, row) {
                return data.length > 100 ?
                  data.substr(0, 100) + '…' :
                  data;
              }
            },
            {
              title: 'Hình ảnh',
              data: 'image',
              render: function (data, type, row) {
                if (!data) return '<i class="text-muted">not found</i>';
                var html = `<a style="background-image: url(${data}); background-size: cover; background-position: center center; overflow: hidden; display:block; width: 150px; height: 80px"><a/>`
                return html;
              },
              orderable: false,
              searchable: false,
              width: '100px',
            },
            { title: 'Ngày', data: 'created_date' },
            { title: 'Giờ', data: 'created_time' }
          ],
          rowCallback: (row: Node, data: any[] | Object, index: number) => {
            const self = this;
            $('td', row).unbind('click');
            $('td', row).bind('click', () => {
              self.showView(data);
            });
            return row;
          }
        }
        //end init table
        this.feedbackTable = $(this.el.nativeElement.querySelector('table'));
        this.tableWidget = this.feedbackTable.DataTable(tableOptions);
        this._ng4LoadingSpinnerService.hide();
      }, error => this._dataService.handleError(error));
  }
  public reset() {
    this.filterStatus = '';
    this.search();
  }
  public showView(info: any) {
    this.entityView = this.feedbackDatas.find(x => x._id == info._id);
    this.ViewModal.show();
    //update trạng thái đã xem
    this.changeStatus(info._id);
  }
  private changeStatus(id: any) {
    if (this.filterStatus == "0") {
      this._dataService.put('/feedbacks/update/' + id).subscribe((response: any) => {
      });
    }
  }
}
