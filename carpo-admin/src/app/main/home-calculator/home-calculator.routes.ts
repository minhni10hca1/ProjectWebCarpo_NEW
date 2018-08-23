import { HomeCalculatorComponent } from './home-calculator.component';
import { Routes, RouterModule } from '@angular/router';
const routes: Routes = [
  { path: '', redirectTo: 'index', pathMatch: 'full' },
  { path: 'index', component: HomeCalculatorComponent }
];
export const HomeCalculatorRouter = RouterModule.forChild(routes);
