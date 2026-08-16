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
        fontFamily: 'Inter, sans-serif',
        toolbar: { show: false },
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
                color: '#5B6B72',
              },
              value: {
                show: true,
                fontSize: '24px',
                fontWeight: 700,
                color: '#12232E',
                fontFamily: 'Lexend, sans-serif',
              },
              total: {
                show: true,
                label: 'Total',
                fontSize: '13px',
                color: '#5B6B72',
                fontFamily: 'Inter, sans-serif',
              },
            },
          },
        },
      },

      dataLabels: { enabled: false },

      legend: {
        position: 'bottom',
        horizontalAlign: 'center',
        fontSize: '13px',
        fontFamily: 'Inter, sans-serif',
        labels: { colors: '#12232E' },
        markers: { size: 7 } as any,
        itemMargin: { horizontal: 10, vertical: 6 },
      },

      // Paid, Pending, Overdue, Partial — confirm this order matches your data
      colors: ['#2F9E68', '#E8A33D', '#D64545', '#2F6FA6'],

      stroke: {
        width: 2,
        colors: ['#FFFFFF'], // clean white gap between donut segments
      },

      responsive: [
        {
          breakpoint: 768,
          options: {
            chart: { height: 280 },
            legend: { position: 'bottom' },
          },
        },
      ],
    };
  }
}
