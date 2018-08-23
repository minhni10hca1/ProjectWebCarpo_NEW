import { CarComponent } from './car.component';
import { Routes, RouterModule } from '@angular/router';
const routes: Routes = [
  { path: '', redirectTo: 'index', pathMatch: 'full' },
  { path: 'index', component: CarComponent }
];
export const CarRouter = RouterModule.forChild(routes);
