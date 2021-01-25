import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../_helpers/auth.guard';
import { DetailEstimateComponent } from './detail-estimate/detail-estimate.component';
import { EstimateComponent } from './estimate.component';
import { MyEstimateComponent } from './my-estimate/my-estimate.component';

const routes: Routes = [{
  path: 'estimate', component: EstimateComponent, canActivate: [AuthGuard],
  children: [
    {
      path: 'detail-estimate/:id',
      component: DetailEstimateComponent,
    },
    {
      path: 'my-estimate',
      component: MyEstimateComponent,
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EstimateRoutingModule { }
