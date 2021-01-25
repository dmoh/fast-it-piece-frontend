import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerComponent } from './customer/customer.component';
import { EstimateComponent } from './estimate/estimate.component';
import {HomeComponent} from './home/home.component';
// import {AdminComponent} from '@app/admin/admin.component';
// import { SidenavResponsiveComponent } from './sidenav-responsive/sidenav-responsive.component';
import { LoginComponent } from './login/login.component';
import { Page404Component } from './page404/page404.component';
import { PasswordComponent } from './password/password.component';
import { ProfessionalComponent } from './professional/professional.component';
import { SidenavResponsiveComponent } from './sidenav-responsive/sidenav-responsive.component';
import { AuthGuard } from './_helpers/auth.guard';


const routes: Routes = [
    {path: 'home', component: HomeComponent, canActivate: [AuthGuard]  },
    {path: 'login', component: LoginComponent},
    {path: 'professional', component: ProfessionalComponent},
    {path: 'customer', component: CustomerComponent},
    {path: 'password', component: PasswordComponent},
    { path: 'show-devis', component: EstimateComponent },
    // { path: 'admin', component: AdminComponent, canActivate: [AuthGuard]  },
    // {path: '', redirectTo: '/login', pathMatch: 'full'},
    {path: '**', component: Page404Component }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
