import { User } from './user';

export class Order {
  amount: number = 0;
  readonly id: number;
  customer: User;
  address: string = null;
  addressToDeliver: string = null;
  date: string = null;
  deliverCode: string = null;
  payedAt: string = null;
  orderAcceptedByMerchant?: boolean;
  idReference?: string = null; // AAAAMMNUMID EXemple: 20200800000001
  status: number;
  // tslint:disable-next-line:variable-name
  delivery_cost: number;
}

