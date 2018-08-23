import { Component, ElementRef, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import 'assets/js/custom.js';

declare var $: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isLoad = true;
  constructor(private elementRef: ElementRef,
    private titleService: Title) {

  }

  ngOnInit() {
    this.titleService.setTitle("Hệ thống quảng cáo xe Carpo");
  }
}
