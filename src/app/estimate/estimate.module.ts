import { NgModule } from '@angular/core';
import { EstimateRoutingModule } from './estimate-routing.module';
import {CoreModule} from "../core/core.module";
import { DetailEstimateComponent } from './detail-estimate/detail-estimate.component';
import { EstimateComponent } from './estimate.component';
import { MyEstimateComponent } from './my-estimate/my-estimate.component';

@NgModule({
  declarations: [
      EstimateComponent,
      MyEstimateComponent,
      DetailEstimateComponent,
  ],
  imports: [
    CoreModule,
    EstimateRoutingModule,
  ],
    exports: [
      CoreModule,
      EstimateComponent,
      MyEstimateComponent,
      DetailEstimateComponent,
  ]
})
export class EstimateModule { }
