import { PaymentChartModel } from '../../models/payment-summary.model';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  ApexChart,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexLegend,
  ApexDataLabels,
  NgApexchartsModule,
} from 'ng-apexcharts';

export type PaymentChartOptions = {
  series: ApexNonAxisChartSeries;

  chart: ApexChart;

  labels: string[];

  responsive: ApexResponsive[];

  legend: ApexLegend;

  dataLabels: ApexDataLabels;
};

@Component({
  selector: 'app-payment-chart',
  imports: [NgApexchartsModule, CommonModule],
  templateUrl: './payment-chart.component.html',
  styleUrl: './payment-chart.component.scss',
})
export class PaymentChartComponent {
  @Input({ required: true })
  data: PaymentChartModel[] = [];

  chartOptions!: Partial<PaymentChartOptions>;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.initializeChart();
    }
  }

  private initializeChart(): void {
    this.chartOptions = {
      series: this.data.map((x) => x.count),

      labels: this.data.map((x) => x.status),

      chart: {
        type: 'donut',

        height: 350,
      },

      legend: {
        position: 'bottom',
      },

      dataLabels: {
        enabled: true,
      },

      responsive: [
        {
          breakpoint: 768,

          options: {
            chart: {
              width: '100%',
            },

            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    };
  }
}
