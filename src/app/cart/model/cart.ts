export class Cart {
    products: any[] = [];
    deliveryCost: number = 0;
    tva: number = 0;
    total: number = 0;
    tipDelivererAmount: number = 0;
    serviceCharge?: number = 0;
    isValidate?: boolean = false;
    hasServiceCharge: boolean = false;
    totalAmountProduct?: number = 0;
    amountWithoutSpecialOffer: number = 0;
}
