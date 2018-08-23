import { CustomerComponent } from './customer.component';
import { Routes, RouterModule } from '@angular/router';
const routes: Routes = [
  { path: '', redirectTo: 'index', pathMatch: 'full' },
  { path: 'index', component: CustomerComponent }
];
export const CustomerRouter = RouterModule.forChild(routes);
