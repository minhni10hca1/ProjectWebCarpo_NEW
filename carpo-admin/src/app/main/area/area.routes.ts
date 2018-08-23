import { AreaComponent } from './area.component';
import { Routes, RouterModule } from '@angular/router';
const routes: Routes = [
  { path: '', redirectTo: 'index', pathMatch: 'full' },
  { path: 'index', component: AreaComponent }
];
export const AreaRouter = RouterModule.forChild(routes);
