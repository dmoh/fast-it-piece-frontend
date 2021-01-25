import {Component, OnInit, Optional} from '@angular/core';
import {Cart} from './model/cart';
import {CartService} from './service/cart.service';
import { Router} from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  qMax: number[];
  cart: Cart;
  // @Optional() products: Product[];
  hasProduct: boolean;
  constructor(private cartService: CartService,
              private route: Router
  ) { }

  ngOnInit(): void {
    this.cartService.cartUpdated.subscribe((cartSub) => this.cart = cartSub);
    // if (!this.products) {
    //   this.hasProduct = false;
    // }

    // this.qMax = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  }

  onUpdateCart(event, product: any): void {
    product.quantity = +(event.target.value);
    this.cartService.UpdateCart('update', product);
  }

  seeCart(): void {
    this.route.navigate(['cart-detail']);
  }

  onEmptyCart() {
    this.cartService.emptyCart();
  }
}
