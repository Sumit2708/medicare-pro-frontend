import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { RevenueChartModel } from '../../models/revenue-chart.model';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexStroke,
  ApexXAxis,
  ApexYAxis,
  ApexTitleSubtitle,
  ApexTooltip,
  ApexGrid,
  ApexLegend,
  NgApexchartsModule,
} from 'ng-apexcharts';

import { CommonModule } from '@angular/common';

export type ChartOptions = {
  series: ApexAxisChartSeries;

  chart: ApexChart;

  xaxis: ApexXAxis;

  yaxis: ApexYAxis;

  stroke: ApexStroke;

  dataLabels: ApexDataLabels;

  title: ApexTitleSubtitle;

  tooltip: ApexTooltip;

  grid: ApexGrid;

  legend: ApexLegend;
};

@Component({
  selector: 'app-revenue-chart',
  imports: [NgApexchartsModule, CommonModule],
  templateUrl: './revenue-chart.component.html',
  styleUrl: './revenue-chart.component.scss',
})
export class RevenueChartComponent {
  @Input({ required: true })
  data: RevenueChartModel[] = [];

  chartOptions!: Partial<ChartOptions>;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.initializeChart();
    }
  }

  private initializeChart(): void {
    this.chartOptions = {
      series: [
        {
          name: 'Revenue',

          data: this.data.map((x) => x.revenue),
        },
      ],

      chart: {
        type: 'line',

        height: 300,

        toolbar: {
          show: false,
        },
      },

      stroke: {
        curve: 'smooth',

        width: 2,
      },

      dataLabels: {
        enabled: false,
      },

      xaxis: {
        categories: this.data.map((x) => x.month),
      },

      yaxis: {
        labels: {
          formatter: (value) => `₹${value}`,
        },
      },

      title: {
        text: '',
      },

      tooltip: {
        y: {
          formatter: (value) => `₹${value}`,
        },
      },

      grid: {
        borderColor: '#ECECEC',
      },

      legend: {
        show: false,
      },
    };
  }
}
