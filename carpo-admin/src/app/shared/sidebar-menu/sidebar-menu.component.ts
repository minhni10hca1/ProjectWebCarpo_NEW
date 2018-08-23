import { Component, OnInit, ElementRef } from '@angular/core';
import { DataService } from './../../core/services/data.service';
import { AuthenService } from './../../core/services/authen.service';
declare var $: any;
@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.css']
})
export class SidebarMenuComponent implements OnInit {

  public functions: any[];
  private datas: any[];


  constructor(
    private dataService: DataService,
    private elementRef: ElementRef,
    public _authenService: AuthenService,
  ) { }
  // ngAfterViewChecked() {
  //   var element = document.getElementById('customJS');
  //   if (typeof (element) != 'undefined' && element != null) {
  //     // exists.
  //     this.elementRef.nativeElement.removeChild(element);
  //   }
  //   var cusScript = document.createElement("script");
  //   cusScript.type = "text/javascript";
  //   cusScript.src = "../assets/js/custom.js";
  //   cusScript.id = "customJS";
  //   this.elementRef.nativeElement.appendChild(cusScript);
  // }
  ngOnInit() {
    this.dataService.get('/functions/menu').subscribe((response: any) => {
      if (response.success === 1) {
        this.functions = response.data.sort((n1, n2) => {
          if (n1.DisplayOrder > n2.DisplayOrder)
            return 1;
          else if (n1.DisplayOrder < n2.DisplayOrder)
            return -1;
          return 0;
        });
      } else {
        this.functions = [];
      }
    }, error => this.dataService.handleError(error));
  }
}
