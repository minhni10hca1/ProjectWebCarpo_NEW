import { HeatmapComponent } from './heatmap.component';
import { Routes, RouterModule } from '@angular/router';
const routes: Routes = [
  { path: '', redirectTo: 'index', pathMatch: 'full' },
  { path: 'index', component: HeatmapComponent }
];
export const HeatmapRouter = RouterModule.forChild(routes);
