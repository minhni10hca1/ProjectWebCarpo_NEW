import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { NotfoundComponent } from './notfound/notfound.component';
import { ForbiddenComponent } from './forbidden/forbidden.component';
export const appRoutes: Routes = [
  //mặc định vào trang login
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  //nếu gõ trang login thì sẽ trỏ đường dẫn tới login và tên module là loginmodule(phải có dấu #)
  //http://localhost:4200/login
  { path: 'login', loadChildren: './login/login.module#LoginModule' },
  { path: 'error', loadChildren: './error/error.module#ErrorModule' },
  { path: 'forbidden', component: ForbiddenComponent },
  //http://localhost:4200/main
  { path: 'main', loadChildren: './main/main.module#MainModule', canActivate: [AuthGuard] },
  {
    path: '**',
    component: NotfoundComponent
  }
]


