import { Component } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {

  ngOnInit(){
    this.chartView();
    }

    chartView(){
      (async function() {
        const data = [
          { 
            month: 1,
            count: 40 
          },
          { 
            month: 2,
            count: 169 
          },
          { 
            month: 3,
            count: 82
          },{ 
            month: 4,
            count: 150
          }
          ,{ 
            month: 5,
            count: 220
          }
          ,{ 
            month: 6,
            count: 400
          }
        ];
      
        new Chart(
           document.getElementById('myChart1') as HTMLCanvasElement,
          {
            type: 'line',
            data: {
              labels: data.map(row => row.month),
              datasets: [
                {
                  label: 'Part consumption by month',
                  data: data.map(row => row.count)
                }
              ]
            }
          }
        );

        new Chart(
          document.getElementById('myChart2') as HTMLCanvasElement,
         {
           type: 'bar',
           data: {
             labels: data.map(row => row.month),
             datasets: [
               {
                 label: 'Procurement by month',
                 data: data.map(row => row.count)
               }
             ]
           }
         }
       );
      })();
    }

}
