import { NgModule } from '@angular/core';
import {CoreModule} from "../core/core.module";
import { EstimateComponent } from './estimate.component';
import { MyEstimateComponent } from './my-estimate/my-estimate.component';
import { DetailEstimateComponent } from './detail-estimate/detail-estimate.component';
import { EstimateRoutingModule } from './estimate-routing.module';

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
