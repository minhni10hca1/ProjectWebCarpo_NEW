import { TrackingComponent } from './tracking.component';
import { Routes, RouterModule } from '@angular/router';
const routes: Routes = [
  { path: '', redirectTo: 'index', pathMatch: 'full' },
  { path: 'index', component: TrackingComponent }
];
export const TrackingRouter = RouterModule.forChild(routes);
