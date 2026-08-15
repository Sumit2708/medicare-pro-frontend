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

      chart: {
        type: 'area',
        height: 320,
        toolbar: {
          show: false,
        },
        zoom: {
          enabled: false,
        },
        parentHeightOffset: 0,
      },

      stroke: {
        curve: 'smooth',
        width: 2,
      },

      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.25,
          opacityTo: 0.02,
          stops: [0, 100],
        },
      },

      dataLabels: {
        enabled: false,
      },

      markers: {
        size: 0,
        hover: {
          size: 5,
        },
      },

      xaxis: {
        categories: this.data.map((item) => item.month),
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          trim: true,
        },
      },

      yaxis: {
        labels: {
          formatter: (value) => {
            return `₹${this.formatRevenue(value)}`;
          },
        },
      },

      tooltip: {
        shared: true,
        intersect: false,
        y: {
          formatter: (value) => {
            return `₹${value.toLocaleString('en-IN')}`;
          },
        },
      },

      grid: {
        borderColor: '#E9EDF2',
        strokeDashArray: 4,
        xaxis: {
          lines: {
            show: false,
          },
        },
      },

      legend: {
        show: false,
      },
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
