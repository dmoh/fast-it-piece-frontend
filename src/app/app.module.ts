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
import { CustomerComponent } from './customer/customer.component';
import { ProfessionalComponent } from './professional/professional.component';
import { InfoModalComponent } from './info-modal/info-modal.component';
import { EstimateModule } from './estimate/estimate.module';
import { DeliveryModule } from './delivery/delivery.module';
import { GeneralTermsModalComponent } from './general-terms-modal/general-terms-modal.component';

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
    CustomerComponent,
    ProfessionalComponent,
    GeneralTermsModalComponent,
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
    DeliveryModule,
    EstimateModule,
    // CustomerModule,
    // AdminModule
  ],
  providers: [SidenavService],
  bootstrap: [AppComponent],
  exports: [
    CoreModule,
    HomeComponent,
    Page404Component,
    GeneralTermsModalComponent,
]
})
export class AppModule { }
