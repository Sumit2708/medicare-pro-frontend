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
  ApexFill,
  ApexMarkers,
} from 'ng-apexcharts';

import { CommonModule } from '@angular/common';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  fill: ApexFill;
  markers: ApexMarkers;
  dataLabels: ApexDataLabels;
  tooltip: ApexTooltip;
  grid: ApexGrid;
  legend: ApexLegend;
  colors: string[];
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
          data: this.data.map((item) => item.revenue),
        },
      ],

      colors: ['#0F5E5A'], // our primary teal — was defaulting to Apex's blue

      chart: {
        type: 'area',
        height: 320,
        fontFamily: 'Inter, sans-serif',
        toolbar: { show: false },
        zoom: { enabled: false },
        parentHeightOffset: 0,
      },

      stroke: {
        curve: 'smooth',
        width: 2.5,
      },

      fill: {
        type: 'gradient',
        colors: ['#0F5E5A'], // add this line — gradient needs its own color reference
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.3,
          opacityTo: 0.02,
          stops: [0, 100],
        },
      },

      dataLabels: { enabled: false },

      markers: {
        size: 0,
        colors: ['#0F5E5A'],
        strokeColors: '#fff',
        strokeWidth: 2,
        hover: { size: 6 },
      },

      xaxis: {
        categories: this.data.map((item) => item.month),
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: {
          trim: true,
          style: { colors: '#5B6B72', fontSize: '12px' },
        },
      },

      yaxis: {
        labels: {
          formatter: (value) => `₹${this.formatRevenue(value)}`,
          style: { colors: '#5B6B72', fontSize: '12px' },
        },
      },

      tooltip: {
        shared: true,
        intersect: false,
        theme: 'light',
        y: {
          formatter: (value) => `₹${value.toLocaleString('en-IN')}`,
        },
      },

      grid: {
        borderColor: '#DCE3E1', // matches --color-border
        strokeDashArray: 4,
        xaxis: { lines: { show: false } },
      },

      legend: { show: false },
    };
  }
  private formatRevenue(value: number): string {
    if (value >= 100000) {
      return `${(value / 100000).toFixed(1)}L`;
    }

    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }

    return value.toString();
  }
}
