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
            year: 2020,
            count: 40 
          },
          { 
            year: 2021,
            count: 169 
          },
          { 
            year: 2022,
            count: 82
          },{ 
            year: 2023,
            count: 150
          }
          ,{ 
            year: 2024,
            count: 220
          }
          ,{ 
            year: 2025,
            count: 400
          }
        ];
      
        new Chart(
           document.getElementById('myChart1') as HTMLCanvasElement,
          {
            type: 'line',
            data: {
              labels: data.map(row => row.year),
              datasets: [
                {
                  label: 'Part consumption by Year',
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
             labels: data.map(row => row.year),
             datasets: [
               {
                 label: 'Procurement by year',
                 data: data.map(row => row.count)
               }
             ]
           }
         }
       );
      })();
    }

}
