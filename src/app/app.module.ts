import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { DocCliComponent } from './doc-cli/doc-cli.component';
import { HomeComponent } from './home/home.component';
import { HomeFeaturesComponent } from './home/home-features/home-features.component';
import { CardComponent } from './home/home-features/card/card.component';
import { LoginComponent } from './login/login.component';
import { Page404Component } from './page404/page404.component';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NavbarComponent } from './navbar/navbar.component';
import { PasswordComponent } from './password/password.component';
import { SidenavResponsiveComponent } from './sidenav-responsive/sidenav-responsive.component';
import { SidenavService } from './sidenav-responsive/sidenav.service';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    AppComponent,
    DocCliComponent,
    HomeComponent,
    NavbarComponent,
    HomeFeaturesComponent,
    CardComponent,
    LoginComponent,
    Page404Component,
    PasswordComponent,
    SidenavResponsiveComponent,
    // ConfirmationCodePaymentModalComponent,
    // CheckoutComponent,
    // InfoModalComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    NgbModule,
    BrowserAnimationsModule,
    MatIconModule,
    // CustomerModule,
    // AdminModule
  ],
  providers: [SidenavService],
  bootstrap: [AppComponent],
  exports: [
    CoreModule,
    HomeComponent,
    Page404Component,
]
})
export class AppModule { }
