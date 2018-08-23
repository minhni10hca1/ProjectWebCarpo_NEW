//khai báo routing cho main
import { Routes } from '@angular/router';
import { MainComponent } from './main.component';
import { AuthGuard } from './../core/guards/auth.guard';
export const mainRoutes: Routes = [
  {
    path: '', component: MainComponent, children: [
      //những module con của main (routing đa cấp)
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', loadChildren: './home/home.module#HomeModule' },
      { path: 'user', loadChildren: './user/user.module#UserModule' },
      { path: 'role', loadChildren: './role/role.module#RoleModule' },
      { path: 'historymap', loadChildren: './historymap/historymap.module#HistorymapModule' },
      { path: 'customer', loadChildren: './customer/customer.module#CustomerModule' },
      { path: 'contract', loadChildren: './contract/contract.module#ContractModule' },
      { path: 'cargroup', loadChildren: './cargroup/cargroup.module#CargroupModule' },
      { path: 'car', loadChildren: './car/car.module#CarModule' },
      { path: 'area', loadChildren: './area/area.module#AreaModule' },
      { path: 'activity', loadChildren: './activity/activity.module#ActivityModule' },
      { path: 'info', loadChildren: './info/info.module#InfoModule' },
      { path: 'tracking', loadChildren: './tracking/tracking.module#TrackingModule' },
      { path: 'evidence', loadChildren: './evidence/evidence.module#EvidenceModule' },
      { path: 'feedback', loadChildren: './feedback/feedback.module#FeedbackModule' },
      { path: 'heatmap', loadChildren: './heatmap/heatmap.module#HeatmapModule' },

      { path: 'homeCalculator', loadChildren: './home-calculator/home-calculator.module#HomeCalculatorModule' },
    ]
  },
]
