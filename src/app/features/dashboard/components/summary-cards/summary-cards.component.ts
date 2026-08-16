import { Component, Input } from '@angular/core';
import { DashboardViewModel } from '../../models/dashboard.viewmodel';
import { CurrencyPipe } from '@angular/common';
import { MatCard, MatCardContent } from "@angular/material/card";
import { MatIcon } from "@angular/material/icon";
import { NgApexchartsModule, ApexChart, ApexStroke, ApexFill, ApexTooltip } from 'ng-apexcharts';

export type SparklineOptions = {
  series: { data: number[] }[];
  chart: ApexChart;
  stroke: ApexStroke;
  fill: ApexFill;
  tooltip: ApexTooltip;
  colors: string[];
};

@Component({
  selector: 'app-summary-cards',
  imports: [CurrencyPipe, MatCard, MatCardContent, MatIcon],
  templateUrl: './summary-cards.component.html',
  styleUrl: './summary-cards.component.scss'
})
export class SummaryCardsComponent {

   @Input({ required: true })
  dashboard!: DashboardViewModel;

  constructor(

  ) { }


  
}
