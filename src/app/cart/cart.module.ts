import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CartRoutingModule } from './cart-routing.module';
import {CartComponent} from './cart.component';
import { CartDetailComponent } from './cart-detail/cart-detail.component';
import {MatButtonModule} from "@angular/material/button";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {FormsModule} from "@angular/forms";


@NgModule({
  declarations: [CartComponent, CartDetailComponent],
  imports: [
    CommonModule,
    CartRoutingModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    FormsModule,

  ],
   exports: [
       CartComponent, CartDetailComponent
   ]
})
export class CartModule { }
