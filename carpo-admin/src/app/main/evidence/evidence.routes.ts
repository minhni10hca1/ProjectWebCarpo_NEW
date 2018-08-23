import { EvidenceComponent } from './evidence.component';
import { Routes, RouterModule } from '@angular/router';
import { DriverComponent } from './driver.component';

const routes: Routes = [
  { path: '', redirectTo: 'index', pathMatch: 'full' },
  { path: 'index', component: EvidenceComponent },  
  { path: 'driver/:id', component: DriverComponent }
];
export const EvidenceRouter = RouterModule.forChild(routes);
