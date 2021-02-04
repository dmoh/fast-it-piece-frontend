import {AfterViewInit, Component, HostListener, OnInit} from '@angular/core';
import {CartService} from '../service/cart.service';
import { ActivatedRoute, Router} from '@angular/router';
import {Cart} from '../model/cart';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
// import {ErrorInterceptor} from '@app/_helpers/error.interceptor';
// import {UserService} from '@app/_services/user.service';
import {environment} from '../../../environments/environment';
import { InfoModalComponent } from 'src/app/info-modal/info-modal.component';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { ToastService } from 'src/app/_services/toast.service';
// import { TipModalComponent } from 'src/app/tip-modal/tip-modal.component';
import { ConfirmationCodePaymentModalComponent } from 'src/app/confirmation-code-payment-modal/confirmation-code-payment-modal.component';
import { BusinessEstimateService } from 'src/app/estimate/services/business-estimate.service';
import { AddressMatrix } from 'src/app/_models/address-matrix';
import { Estimate } from 'src/app/_models/estimate';

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
  hasAddressSelected: boolean = false;
  showLoader: boolean;
  paymentValidation: boolean;
  stripeKey = environment.stripeKey;
  responseDistanceGoogle: any;
  estimate: Estimate;
  
  addressOriginFormat: any;
  addressDestFormat: any;
  adrOrigin: AddressMatrix;
  adrDest: AddressMatrix;

  readonly frais = 0.80;
  amountTotal: number;

  constructor(
    private cartService: CartService,
    private router: Router,
    private route: ActivatedRoute,
    private codeConfirmationModal: NgbModal,
    private infoModal: NgbModal,
    private addressConfirmationModal: NgbModal,
    private estimateService: BusinessEstimateService
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
    });  

    setTimeout(() => {
      this.showLoader = false;
    }, 1000);
    this.estimate = new Estimate();
    this.estimate.deliveryCost = 0;
    this.estimate.totalAmount = 0;
    this.estimate.serviceCharge = 0;
    // this.estimate.serv = 0;
    // console.log(this.route.snapshot);
    const devis = this.route.snapshot.queryParams.devis;
    const mail = this.route.snapshot.queryParams.mail;
    const phone = this.route.snapshot.queryParams.phone;
    const infoUser = {
      mail: mail,
      phone: phone,
    }
    this.estimateService.getEstimateByUserInfo(devis, infoUser).pipe( ).subscribe( estimate => {
      // console.log("estimateById", estimateById);
      // let order: Estimate = new Order();
      console.info("this.estimate", estimate);
      this.estimate = estimate;
      this.showLoader = false;

      this.cartService.generateTotalCart(true);
    },        
    error => {
      console.error(error);
      if (/Invalid/.test(error)) {
        error = 'Numero de devis ou coordonnées incorrects';
      }
      console.log(error);
    });
  }

  ngAfterViewInit() {
    this.loadStripe();
  }

  private loadStripe(): void {
    this.loadStripeElements();
  }

  private showModalErrorAddress() {
    // const modalError = this.infoModal.open(InfoModalComponent, {
    //   backdrop: 'static',
    //   keyboard: false
    // });
    // modalError.componentInstance.title = 'Erreur';
    // modalError.componentInstance.message = 'Cette adresse est introuvable.';
    // modalError.componentInstance.isCartError = true;
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
    // const tipModalRef = this.infoModal.open(TipModalComponent, {
    //   backdrop: 'static',
    //   keyboard: false
    // });
    // tipModalRef.result.then(() => {
      this.showLoader = true;
      this.paymentValidation = true;
      event.preventDefault();
      this.cartService.getTokenPaymentIntent(
        + Math.round(this.estimate.totalAmount) * 100,
        + this.estimate.deliveryCost * 100
      ).subscribe(
        (token: any ) => {
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
                    estimate: this.estimate,
                    distanceInfos: this.responseDistanceGoogle
                  }).subscribe((order) => {
                    const modalRef = this.infoModal.open(InfoModalComponent, {
                      backdrop: 'static',
                      keyboard: false
                    });
                    modalRef.componentInstance.title = `Devis ${this.estimate.estimateNumber}`;
                    modalRef.componentInstance.message = `Création de la commande`; 
                    // ${order.order_id}`;
                    modalRef.result.then(() => this.ngOnInit());
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
            this.router.navigate(['/login']);
          }
          this.showLoader = false;
        }
      );
    // });


  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    if (this.addressConfirmationModal.hasOpenModals()) {
      this.addressConfirmationModal.dismissAll();
    }
  }
}
