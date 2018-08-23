import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { Routes, RouterModule } from '@angular/router';
import { ChartsModule } from 'ng2-charts'; //chart js

const homeRoutes: Routes = [
   //localhost:4200/main/user
  { path: '', redirectTo: 'index', pathMatch: 'full' },
   //localhost:4200/main/home/index
  { path: 'index', component: HomeComponent }
]
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(homeRoutes),
    ChartsModule
  ],
  declarations: [HomeComponent]
})
export class HomeModule { }
