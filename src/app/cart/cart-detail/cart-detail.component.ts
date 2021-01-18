import {AfterViewInit, Component, HostListener, OnInit} from '@angular/core';
import {CartService} from '../service/cart.service';
import { Router} from '@angular/router';
import {Cart} from '../model/cart';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
// import {ErrorInterceptor} from '@app/_helpers/error.interceptor';
// import {UserService} from '@app/_services/user.service';
import {environment} from '../../../environments/environment';
import { InfoModalComponent } from 'src/app/info-modal/info-modal.component';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { ToastService } from 'src/app/_services/toast.service';
import { TipModalComponent } from 'src/app/tip-modal/tip-modal.component';
import { ConfirmationCodePaymentModalComponent } from 'src/app/confirmation-code-payment-modal/confirmation-code-payment-modal.component';

@Component({
  selector: 'app-cart-detail',
  templateUrl: './cart-detail.component.html',
  styleUrls: ['./cart-detail.component.scss']
})
export class CartDetailComponent implements OnInit, AfterViewInit {
  stripe: any;
  elementStripe: any;
  cardNumber: any;
  card: any;
  cartCurrent: Cart;
  userAddresses: any[] = [];
  clientSecret: string;
  // todo declare constante frais de service
  paymentValidated: boolean;
  canBeDeliver: boolean = false;
  hasAddressSelected: boolean = false;
  showLoader: boolean;
  addressChose: any;
  phoneCustomer: string;
  paymentValidation: boolean;
  responseDistanceGoogle: any;
  stripeKey = environment.stripeKey;

  constructor(
    private cartService: CartService,
    // private userService: UserService,
    private route: Router,
    private codeConfirmationModal: NgbModal,
    private infoModal: NgbModal,
    private addressConfirmationModal: NgbModal,
    private authenticationService: AuthenticationService,
    private router: Router,
    private toastService: ToastService,
  ) {
    this.paymentValidation = false;
    this.showLoader = true;
    this.paymentValidated = false;
  }

  ngOnInit(): void {
    this.paymentValidation = false;
    // Choix de l'adresse
    this.cartService.cartUpdated.subscribe((cartUpdated: Cart) => {
      this.cartCurrent = cartUpdated;
      if (this.cartCurrent.products.length < 1) {
        this.route.navigate(['home']);
      }
    });
    // check if restau not closed
    // this.userService.getUserAddresses().subscribe((result) => {
    //   this.showLoader = false;
    //   this.phoneCustomer = result.data[0].phone;
    //   this.userAddresses = result.data[0].addresses;
    //   const modalRef = this.addressConfirmationModal.open(AddressModalComponent, {
    //     backdrop: 'static',
    //     keyboard: false,
    //   });

    //   if (typeof this.userAddresses[0] === 'undefined') {
    //     modalRef.componentInstance.address = null;
    //   } else {
    //     modalRef.componentInstance.address = this.userAddresses[0];
    //     modalRef.componentInstance.firstname = this.userAddresses[0].firstname;
    //   }
    //   modalRef.componentInstance.phoneCustomer = this.phoneCustomer;
    //   modalRef.result.then((res) => {
    //     const origin = `${this.cartCurrent.restaurant.street},
    //      ${this.cartCurrent.restaurant.city},
    //      ${this.cartCurrent.restaurant.zipcode}`
    //     ;
    //     // save phone user number
    //     // this.userService.savePhoneNumber(res.phone)
    //     //   .subscribe((responseServer) => {
    //     //   });
    //     this.addressChose = res;
    //     const addressChoosen = `${res.street}, ${res.city}, ${res.zipcode}`;
    //     // send result google for calculate backend side
    //     const directionsService = new google.maps.DistanceMatrixService();
    //     directionsService.getDistanceMatrix({
    //       origins: [origin],
    //       destinations: [addressChoosen],
    //       travelMode: google.maps.TravelMode.DRIVING,
    //     }, (response, status) => {
    //       if (response.rows === null) {
    //         this.showModalErrorAddress();
    //       }
    //       if (response.rows[0].elements[0].status === 'OK') {
    //         const responseDistance = response.rows[0].elements[0];
    //         this.responseDistanceGoogle = responseDistance;
    //         this.cartService.getCostDelivery(responseDistance)
    //           .subscribe((resp) => {
    //             setTimeout(() => {
    //               this.showLoader = false;
    //             }, 1000);
    //             const pro = new Promise(() => {
    //               this.cartService.setDeliveryCost(resp.deliveryInfos);
    //               this.hasAddressSelected = true;
    //             });
    //             pro.then((respPro) => {
    //               this.cartService.generateTotalCart(true);
    //               this.cartService.cartUpdated.subscribe((cartUpdated: Cart) => {
    //                 this.cartCurrent = cartUpdated;
    //               });
    //             });
    //           });
    //       } else {
    //         this.showModalErrorAddress();
    //       }
    //     });
    //   });
    // });
  }

  ngAfterViewInit() {
    this.loadStripe();
  }

  private loadStripe(): void {
    this.loadStripeElements();
  }

  private showModalErrorAddress() {
    const modalError = this.infoModal.open(InfoModalComponent, {
      backdrop: 'static',
      keyboard: false
    });
    modalError.componentInstance.title = 'Erreur';
    modalError.componentInstance.message = 'Cette adresse est introuvable.';
    modalError.componentInstance.isCartError = true;
  }


  private loadStripeElements(): void {
    this.stripe = window['Stripe'](this.stripeKey);
    this.elementStripe = this.stripe.elements();
    const style = {
      base: {
        color: '#32325d',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4'
        }
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
      }
    };
    // this.cardNumber = this.elementStripe.create('card', {style: style});
    this.card = this.elementStripe.create('card', { style: style });
    this.card.mount('#card-element');
    // Add an instance of the card Element into the `card-element` <div>.
    this.card.mount('#card-element');

    // Handle real-time validation errors from the card Element.
    this.card.on('change', (event) => {
      const  displayError = document.getElementById('card-errors');
      if (event.error) {
        displayError.textContent = event.error.message;
      } else {
        displayError.textContent = '';
      }
    });
  }


  onProceedCheckout(event: Event): void {
    const tipModalRef = this.infoModal.open(TipModalComponent, {
      backdrop: 'static',
      keyboard: false
    });
    tipModalRef.result.then(() => {
      this.showLoader = true;
      this.paymentValidation = true;
      event.preventDefault();
      this.cartService.getTokenPaymentIntent(
        +(this.cartCurrent.total) * 100,
        this.cartCurrent.deliveryCost
      ).subscribe((token: any ) => {
          if (token.errorClosed) {
            this.showLoader = false;
            const modalRef = this.infoModal.open(InfoModalComponent, {
              backdrop: 'static',
              keyboard: false
            });
            modalRef.componentInstance.title = 'Erreur';
            modalRef.componentInstance.message = token.errorClosed;
            modalRef.result.then(() => {
              this.cartService.UpdateCart('empty-cart');
              this.cartService.cartUpdated.subscribe((cartUpdated: Cart) => {
                this.cartCurrent = cartUpdated;
                setTimeout(() => {
                  window.location.href = `${window.location.origin}/home`;
                }, 100);
                // this.router.navigate(['customer/notification']);
              });
            });
          } else if (token.errorDelivery) {
            this.showLoader = false;
            const modalRef = this.infoModal.open(InfoModalComponent, {
              backdrop: 'static',
              keyboard: false
            });
            modalRef.componentInstance.title = 'Erreur';
            modalRef.componentInstance.message = token.errorDelivery;
            modalRef.result.then(() => {
              setTimeout(() => {
                window.location.href = `${window.location.origin}/cart-detail`;
              }, 100);
            });
          } else {
            this.clientSecret = token.client_secret;
            this.stripe.confirmCardPayment(this.clientSecret, {
              payment_method: {
                card: this.card,
                billing_details: {
                  name: 'Customer' // TODO ADD REAL NAME
                }
              }
            }).then((result) => {
              if (result.error) {
                this.showLoader = false;
                const modalRef = this.infoModal.open(InfoModalComponent, {
                  backdrop: 'static',
                  keyboard: false
                });
                modalRef.componentInstance.title = 'Erreur';
                modalRef.componentInstance.message = result.error.message;
                modalRef.result.then(() => this.ngOnInit());
              } else {
                // The payment has been processed!
                const responsePayment = result.paymentIntent;
                if (responsePayment.status === 'succeeded') {
                  this.paymentValidation = false;
                  this.showLoader = false;
                  // save order payment succeeded
                  this.cartService.saveOrder({
                    stripeResponse: responsePayment,
                    cartDetail: this.cartCurrent,
                    distanceInfos: this.responseDistanceGoogle
                  }).subscribe((confCode) => {
                    const codeModal = this.codeConfirmationModal.open(ConfirmationCodePaymentModalComponent,
                      { backdrop: 'static', keyboard: false, size: 'lg' });
                    codeModal.componentInstance.infos = confCode;
                    codeModal.result.then((response) => {
                      this.cartService.emptyCart();
                      if (response) {
                        // send code to db
                        this.cartService.saveCodeCustomerToDeliver({ responseCustomer: response})
                          .subscribe((responseServer) => {
                            if (responseServer.ok) {
                              this.cartService.UpdateCart('empty-cart');
                              this.cartService.cartUpdated.subscribe((cartUpdated: Cart) => {
                                this.cartCurrent = cartUpdated;
                                setTimeout(() => {
                                  window.location.href = `${window.location.origin}/customer/notification`;
                                }, 100);
                                // this.router.navigate(['customer/notification']);
                              });
                            }
                          });
                      }
                    });
                  });
                } else {
                  this.showLoader = false;
                  this.paymentValidation = false;
                  const modalRef = this.infoModal.open(InfoModalComponent, {
                    backdrop: 'static',
                    keyboard: false
                  });
                  modalRef.componentInstance.title = 'Information';
                  modalRef.componentInstance.message = 'Le paiement n\'a pas aboutit :( ';
                }
              }
            });
          }
        }, (error) => {
          if (/Expired JWT/.test(error)) {
            this.route.navigate(['/login']);
          }
        }
      );
    });


  }

  onSubmit(event: Event): void {
  }


  onDeleteProduct(product: any) {
    // tslint:disable-next-line:no-conditional-assignment
    if (this.cartCurrent.products.length <= 1) {
      this.cartService.emitCartSubject('empty');
    } else {
      this.cartService.UpdateCart('remove', product);
    }
  }


  onUpdateCart(type: string, product: any) {
    if (type === 'less') {
      if (product.quantity > 1) {
        product.quantity--;
      }
    } else {
      product.quantity++;
    }
    this.cartService.UpdateCart('update', product);
  }


  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    if (this.addressConfirmationModal.hasOpenModals()) {
      this.addressConfirmationModal.dismissAll();
    }
  }
}
