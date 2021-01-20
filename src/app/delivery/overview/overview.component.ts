import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { Deliverer } from 'src/app/_models/deliverer';
import { DeliveryService } from '../services/delivery.service';
@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  chart = [];
  orders: any[];
  opinions: any[];
  deliverer: Deliverer;
  countOrderCurrentMonth: string;
  amountOrderCurrentMonth: string;
  date: Date;
  dateDisplay: string;
  constructor(private  deliveryService: DeliveryService) { }

  ngOnInit(): void {
    this.orders = [];
    this.date = new Date();
    this.dateDisplay  = this.date.toLocaleString();
    this.deliveryService.getOrderAnalize(1)
      .subscribe((response) => {
        console.log(response);
        this.amountOrderCurrentMonth = ((response.delivery_cost).toFixed(2)).replace('.', ',');
        this.countOrderCurrentMonth = response.count;
        const ctx = document.getElementById('myChart');
        this.chart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: [response.month],
            datasets: [{
              label: 'Livraisons par mois',
              data: [response.delivery_cost],
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
              ],
              borderWidth: 1
            }]
          },
          options: {
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true
                }
              }]
            }
          }
        });
      });

    
    // this.restaurantService.getOrdersDatas(1).subscribe((res) => {
    //   console.warn('res', res);
    //   this.orders = RestaurantDashboardComponent.extractRestaurantData('order', res);
    //   console.warn('analyze', this.orders);

    // });
    
    this.deliveryService.getInfosDeliverer().subscribe((res) => {
      this.deliverer = res;
      if (this.deliverer) {
        if (this.deliverer.orders) {
          // ajouter param dans le back end pour filtrer les commandes livré
          this.orders = this.deliverer.orders
            .filter( order => {
              let dateDeliv :any = (order.date_delivered);

              const isCurrentMonth = (dateDeliv != null) ? new Date(dateDeliv.date).getMonth() == new Date().getMonth() : false;
              const isCurrentYear = (dateDeliv != null) ? new Date(dateDeliv.date).getFullYear() == new Date().getFullYear() : false;
              return (isCurrentMonth && isCurrentYear);
            })
            .sort(function(a, b) {
              return b.id - a.id;
            });
        }
      }

      console.warn('res', res);
      console.warn('analyze', this.orders);

    });

  }
}
