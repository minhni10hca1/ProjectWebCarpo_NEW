import { FeedbackComponent } from './feedback.component';
import { Routes, RouterModule } from '@angular/router';
const routes: Routes = [
  { path: '', redirectTo: 'index', pathMatch: 'full' },
  { path: 'index', component: FeedbackComponent }
];
export const FeedbackRouter = RouterModule.forChild(routes);
