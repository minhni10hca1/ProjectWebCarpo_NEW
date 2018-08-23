import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { mainRoutes } from './main.routes';
import { RouterModule, Routes } from '@angular/router';
import { HomeModule } from './home/home.module';
import { UserModule } from './user/user.module'; //user module quản lý user component nên chỉ cần import module
import { RoleModule } from './role/role.module';
import { HistorymapModule } from './historymap/historymap.module';
import { CustomerModule } from './customer/customer.module';
import { ContractModule } from './contract/contract.module';
import { CargroupModule } from './cargroup/cargroup.module';
import { CarModule } from './car/car.module';
import { AreaModule } from './area/area.module';
import { ActivityModule } from './activity/activity.module';
import { InfoModule } from './info/info.module';
import { TrackingModule } from './tracking/tracking.module';
import { EvidenceModule } from './evidence/evidence.module';
import { FeedbackModule } from './feedback/feedback.module';
import { HeatmapModule } from './heatmap/heatmap.module';
import { HomeCalculatorModule } from './home-calculator/home-calculator.module';

import { UtilityService } from '../core/services/utility.service';
import { AuthenService } from '../core/services/authen.service';
import { SidebarMenuComponent } from '../shared/sidebar-menu/sidebar-menu.component';
import { TopMenuComponent } from '../shared/top-menu/top-menu.component';



@NgModule({
  imports: [
    CommonModule,
    HomeModule,
    UserModule,
    RoleModule,
    HistorymapModule,
    CustomerModule,
    ContractModule,
    CargroupModule,
    CarModule,
    AreaModule,
    ActivityModule,
    InfoModule,
    TrackingModule,
    EvidenceModule,
    FeedbackModule,
    HeatmapModule,
    HomeCalculatorModule,

    RouterModule.forChild(mainRoutes), //đk những module của main tại đây
  ],
  declarations: [MainComponent, SidebarMenuComponent,TopMenuComponent],
  providers: [UtilityService, AuthenService],
})
export class MainModule { }
