import { InfoComponent } from './info.component';
import { Routes, RouterModule } from '@angular/router';
import { DetailComponent } from './detail/detail.component';
const routes: Routes = [
  { path: '', redirectTo: 'index', pathMatch: 'full' },
  { path: 'index', component: InfoComponent },
  { path: 'detail/:id', component: DetailComponent }
];
export const InfoRouter = RouterModule.forChild(routes);
