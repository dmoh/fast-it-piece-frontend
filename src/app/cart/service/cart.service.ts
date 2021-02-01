import { Injectable } from '@angular/core';
import {Cart} from '../model/cart';
import {BehaviorSubject, Observable} from 'rxjs/index';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {environment} from '../../../environments/environment';
import {isNumeric} from "tslint";
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { Estimate } from 'src/app/_models/estimate';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartCurrent: Cart = new Cart();
  cartSubject = new BehaviorSubject<Cart>(this.cartCurrent);
  cartUpdated = this.cartSubject.asObservable();
  protected tokenUserCurrent: string;
  headers: any;
  urlApi: string = environment.apiUrl;


  constructor(private http: HttpClient, private authenticate: AuthenticationService, private router: Router) {
    this.headers = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});
    if (localStorage.getItem('cart_fast_eat_piece')) {
      this.setCart(JSON.parse(localStorage.getItem('cart_fast_eat_piece')));
    }
    if (this.authenticate.tokenUserCurrent == null) {
      // this.router.navigate(['/login']);
    }
    if (this.authenticate.tokenUserCurrent) {
     this.headers.append(`Authorization: Bearer ${this.authenticate.tokenUserCurrent}`) ;
    }
  }


  UpdateCart(type: string, restaurant?: any): void { // todo enlever majuscule de cette méthode
    if (type === 'add') {
        if (!this.cartCurrent) {
            this.cartCurrent = new Cart();
        }
        // if (this.cartCurrent.products.length === 0) {
        //   product.indexProduct = 1;
        // } else {
        //   product.indexProduct = this.cartCurrent.products.length++;
        // }
        // let indexProd = 0;
        if (this.cartCurrent.products.length > 0) {
          this.cartCurrent.products = this.cartCurrent.products.filter((prod) => {
            return typeof prod !== 'undefined' && prod !== null ? prod : '';
          });
        }

        // this.cartCurrent.products = [...this.cartCurrent.products, product];
        // console.warn('products', this.cartCurrent.products);

        // this.cartCurrent.restaurant = restaurant;
        this.generateTotalCart();
        this.emitCartSubject();
    } else if (type === 'update') {
        const arrayProductsCurrent = this.cartCurrent.products;
        // const index = arrayProductsCurrent.findIndex(prod => prod.id === product.id);
        // this.cartCurrent.products[index] = product;
        this.generateTotalCart();
        this.emitCartSubject();
    } else if (type === 'remove') {
        // this.cartCurrent.products = this.cartCurrent.products.filter((prod: Product) => product.id !== prod.id);
        this.generateTotalCart();
        this.emitCartSubject();
    }else if (type === 'empty-cart') {
      this.cartCurrent = new Cart();
      this.emitCartSubject('empty');
    }
  }

  setHasServiceCharge() {
    this.cartCurrent.hasServiceCharge = true;
  }
  setDeliveryCost(deliveryCost: number) {
    this.cartCurrent.deliveryCost = deliveryCost;
    this.generateTotalCart();
    this.emitCartSubject();
  }

  setCart(cart: Cart): void {
    this.cartCurrent = cart;
    this.emitCartSubject();
  }

  emitCartSubject(empty?: string){
    if (empty === 'empty') {
      localStorage.removeItem('cart_fast_eat_piece');
      this.cartCurrent = new Cart();
    } else {
      localStorage.setItem('cart_fast_eat_piece', JSON.stringify(this.cartCurrent));
    }
    // todo voir si autre solution avec Elhad save on DB temporairement ??? le panier

    this.cartSubject.next(this.cartCurrent);
  }

  public generateTotalCart(estimate?, isCheckout?: boolean): void {
    this.cartCurrent.total = estimate;
    this.cartCurrent.totalAmountProduct = 0;
    this.cartCurrent.amountWithoutSpecialOffer = 0;
    // this.cartCurrent.products.forEach((prod: Product) => {
    //   if (typeof prod !== 'undefined' && prod !== null) {
    //     if (typeof prod.supplementProducts !== 'undefined' && prod.supplementProducts.length > 0) {
    //       /* prod.supplementProducts.forEach((elem) => {
    //          if (elem.amount && +(elem.amount) > 0) {
    //            console.warn('elem', elem.name);
    //            console.warn('price', elem.amount);
    //            this.cartCurrent.total += +(elem.amount) / 100;
    //            // todo voir pour la quantité des suppléments
    //          }
    //        });*/
    //     }
    //     this.cartCurrent.total += +(prod.quantity * prod.amount) / 100;
    //     this.cartCurrent.totalAmountProduct += +(prod.quantity * prod.amount) / 100;
    //     this.cartCurrent.amountWithoutSpecialOffer += +(prod.quantity * prod.amount) / 100;
    //   }
    // });
    // if (typeof this.cartCurrent.restaurant.specialOffer !== 'undefined') {
    //   if (
    //     +(this.cartCurrent.restaurant.specialOffer.minimumAmountForOffer) <=
    //     +(this.cartCurrent.total)
    //   ){
    //     this.cartCurrent.total = 150;
    //   }
    // }
    // if (typeof this.cartCurrent.tipDelivererAmount !== 'undefined'
    //   && +this.cartCurrent.tipDelivererAmount > 0
    // ) {
    //   this.cartCurrent.total += +this.cartCurrent.tipDelivererAmount;
    //   this.cartCurrent.amountWithoutSpecialOffer += +this.cartCurrent.tipDelivererAmount;
    // }
    // this.cartCurrent.amountWithoutSpecialOffer += 0.80;
    // this.cartCurrent.amountWithoutSpecialOffer += +(this.cartCurrent.deliveryCost);
    this.cartCurrent.total += 0.80;
    this.cartCurrent.total += +(this.cartCurrent.deliveryCost);
    this.emitCartSubject();
  }

  getTokenPaymentIntent(amountCart: number, delivery: number, currencyCart: string = 'EUR'): Observable<any> {
    return this.http.post<any>(`${this.urlApi}/payment/token-payment`,
      {
        amount: amountCart,
        currency: currencyCart,
        deliveryCost: delivery
      }, this.headers);
  }


  emptyCart() {
    this.cartCurrent = new Cart();
    this.emitCartSubject('empty');
  }

  // saveOrder()
  saveOrder(cartOrder: {}): Observable<any> {
    return this.http.post<any>(`${ this.urlApi}/order/save`,
      JSON.stringify(cartOrder), this.headers);
  }

  getCostDelivery(dataDistance: any): Observable<any> {
    return this.http.post<any>(`${ this.urlApi }/delivery/cost`,
      JSON.stringify(dataDistance), this.headers);
  }
  saveCodeCustomerToDeliver(responseCustomer): Observable<any> {
    return this.http.post<any>(`${this.urlApi}/order/save/delivery-code`,
      responseCustomer, this.headers);
  }

  // getBusinessCurrent() {
  //   return this.cartCurrent.restaurant;
  // }

  // setTipDelivererAmount(tipAmount: number) {
  //   this.cartCurrent.tipDelivererAmount = tipAmount;
  //   this.generateTotalCart();
  //   this.emitCartSubject();
  // }
}
