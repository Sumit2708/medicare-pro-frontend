import {
  Component,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';

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
  NgApexchartsModule
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
  imports: [  CommonModule,
    NgApexchartsModule
  ],
  templateUrl: './appointments-chart.component.html',
  styleUrl: './appointments-chart.component.scss'
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
      toolbar: {
        show: false,
      },
    },

    colors: ['#1976D2'],

    plotOptions: {
      bar: {
        borderRadius: 6,
        columnWidth: '45%',
      },
    },

    dataLabels: {
      enabled: false,
    },

    xaxis: {
      categories: this.data.map((item) => item.month),

      axisBorder: {
        show: false,
      },

      axisTicks: {
        show: false,
      },
    },

    yaxis: {
      min: 0,
      forceNiceScale: true,

      labels: {
        formatter: (value) => Math.round(value).toString(),
      },

      title: {
        text: undefined,
      },
    },

    tooltip: {
      y: {
        formatter: (value) => `${value} appointments`,
      },
    },

    legend: {
      show: false,
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
  };
}
}
