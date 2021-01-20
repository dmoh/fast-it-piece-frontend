import { NgModule } from '@angular/core';
import { DeliveryRoutingModule } from './delivery-routing.module';
import {CoreModule} from "../core/core.module";
import { ParameterComponent } from './parameter/parameter.component';
import { DeliveryComponent } from './delivery.component';
import { MyDeliveryComponent } from './my-delivery/my-delivery.component';
import { AwaitingDeliveryComponent } from './awaiting-delivery/awaiting-delivery.component';
import { DetailDeliveryComponent } from './detail-delivery/detail-delivery.component';
import { OverviewComponent } from './overview/overview.component';

@NgModule({
  declarations: [
      DeliveryComponent,
      ParameterComponent,
      MyDeliveryComponent,
      AwaitingDeliveryComponent,
      OverviewComponent,
      DetailDeliveryComponent,
  ],
  imports: [
    CoreModule,
    DeliveryRoutingModule,
  ],
    exports: [
      CoreModule,
      DeliveryComponent,
      MyDeliveryComponent,
      AwaitingDeliveryComponent,
      DetailDeliveryComponent,
      OverviewComponent,
      ParameterComponent,
  ]
})
export class DeliveryModule { }
