import { ContractComponent } from './contract.component';
import { Routes, RouterModule } from '@angular/router';
import { ContractCarAddComponent } from './contract-car-add/contract-car-add.component';
import { ContractCarListComponent } from './contract-car-list/contract-car-list.component';
import { DualListBoxComponent } from './dual-list-box/dual-list-box.component';
const routes: Routes = [
  { path: '', redirectTo: 'index', pathMatch: 'full' },
  { path: 'index', component: ContractComponent },
  { path: 'duallist/:id', component: DualListBoxComponent },
  { path: 'carlist/:id', component: ContractCarListComponent }
];
export const ContractRouter = RouterModule.forChild(routes);
