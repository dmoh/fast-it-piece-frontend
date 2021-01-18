import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {HomeComponent} from './home/home.component';
// import {AuthGuard} from '@app/_helpers/auth.guard';
// import {AdminComponent} from '@app/admin/admin.component';
// import { SidenavResponsiveComponent } from './sidenav-responsive/sidenav-responsive.component';
import { LoginComponent } from './login/login.component';
import { Page404Component } from './page404/page404.component';
import { PasswordComponent } from './password/password.component';
import { SidenavResponsiveComponent } from './sidenav-responsive/sidenav-responsive.component';


const routes: Routes = [
    {path: 'home', component: HomeComponent},
    {path: 'login', component: LoginComponent},
    {path: 'professional', component: Page404Component},
    {path: 'customer', component: Page404Component},
    {path: 'password', component: PasswordComponent},
    // {path: 'sideNav', component: SidenavResponsiveComponent},
    // { path: 'admin', component: AdminComponent, canActivate: [AuthGuard]  },
    // { path: 'show-order/:orderId/:token', component: ShowOrderComponent },
    {path: '', redirectTo: '/login', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
