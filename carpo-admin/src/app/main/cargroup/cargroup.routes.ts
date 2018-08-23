import { CargroupComponent } from './cargroup.component';
import { Routes, RouterModule } from '@angular/router';
const routes: Routes = [
  { path: '', redirectTo: 'index', pathMatch: 'full' },
  { path: 'index', component: CargroupComponent }
];
export const CargroupRouter = RouterModule.forChild(routes);
