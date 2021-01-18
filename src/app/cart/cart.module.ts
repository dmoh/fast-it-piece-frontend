import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CartRoutingModule } from './cart-routing.module';
import {CartComponent} from './cart.component';
import { CartDetailComponent } from './cart-detail/cart-detail.component';
import {MatButtonModule} from "@angular/material/button";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";


@NgModule({
  declarations: [CartComponent, CartDetailComponent],
    imports: [
        CommonModule,
        CartRoutingModule,
        MatButtonModule,
        MatProgressSpinnerModule,

    ],
   exports: [
       CartComponent, CartDetailComponent
   ]
})
export class CartModule { }
