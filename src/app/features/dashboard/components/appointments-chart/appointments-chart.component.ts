import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexGrid,
  ApexLegend,
  ApexPlotOptions,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { AppointmentChartModel } from '../../models/appointment-chart.model';

export type AppointmentChartOptions = {
  series: ApexAxisChartSeries;

  chart: ApexChart;

  xaxis: ApexXAxis;

  yaxis: ApexYAxis;

  plotOptions: ApexPlotOptions;

  dataLabels: ApexDataLabels;

  tooltip: ApexTooltip;

  grid: ApexGrid;

  legend: ApexLegend;

  colors: string[];
};

@Component({
  selector: 'app-appointments-chart',
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './appointments-chart.component.html',
  styleUrl: './appointments-chart.component.scss',
})
export class AppointmentsChartComponent {
  @Input({ required: true })
  data: AppointmentChartModel[] = [];

  chartOptions: Partial<AppointmentChartOptions> = {};

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.initializeChart();
    }
  }

  private initializeChart(): void {
    this.chartOptions = {
      series: [
        {
          name: 'Appointments',
          data: this.data.map((item) => item.appointments),
        },
      ],

      chart: {
        type: 'bar',
        height: 320,
        fontFamily: 'Inter, sans-serif',
        toolbar: { show: false },
      },

      colors: ['#2F6FA6'], // matches the appointment stat card accent

      plotOptions: {
        bar: {
          borderRadius: 6,
          columnWidth: '45%',
          borderRadiusApplication: 'end',
        },
      },

      dataLabels: { enabled: false },

      xaxis: {
        categories: this.data.map((item) => item.month),
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: {
          style: { colors: '#5B6B72', fontSize: '12px' },
        },
      },

      yaxis: {
        min: 0,
        forceNiceScale: true,
        labels: {
          formatter: (value) => Math.round(value).toString(),
          style: { colors: '#5B6B72', fontSize: '12px' },
        },
        title: { text: undefined },
      },

      tooltip: {
        theme: 'light',
        y: {
          formatter: (value) => `${value} appointments`,
        },
      },

      legend: { show: false },

      grid: {
        borderColor: '#DCE3E1',
        strokeDashArray: 4,
        xaxis: { lines: { show: false } },
      },
    };
  }
}
