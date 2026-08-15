import { PaymentChartModel } from '../../models/payment-summary.model';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  ApexChart,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexLegend,
  ApexDataLabels,
  ApexPlotOptions,
  ApexStroke,
  NgApexchartsModule,
} from 'ng-apexcharts';

export type PaymentChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  responsive: ApexResponsive[];
  legend: ApexLegend;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  stroke: ApexStroke;
  colors: string[];
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
      series: this.data.map((item) => item.count),

      labels: this.data.map((item) => item.status),

      chart: {
        type: 'donut',
        height: 320,
        toolbar: {
          show: false,
        },
      },

      plotOptions: {
        pie: {
          donut: {
            size: '72%',
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: '13px',
              },
              value: {
                show: true,
                fontSize: '24px',
                fontWeight: 600,
              },
              total: {
                show: true,
                label: 'Total',
              },
            },
          },
        },
      },

      dataLabels: {
        enabled: false,
      },

      legend: {
        position: 'bottom',
        horizontalAlign: 'center',
        fontSize: '13px',
      },

      colors: ['#2E7D32', '#F9A825', '#C62828', '#1565C0'],

      stroke: {
        width: 2,
      },

      responsive: [
        {
          breakpoint: 768,
          options: {
            chart: {
              height: 280,
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
