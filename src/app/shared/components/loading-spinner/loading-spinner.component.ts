import { Component } from '@angular/core';
import { LoadingService } from '../../../core/services/loading/loading.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  imports: [MatProgressSpinnerModule,AsyncPipe],
  templateUrl: './loading-spinner.component.html',
  styleUrl: './loading-spinner.component.scss'
})
export class LoadingSpinnerComponent {
  
  loading$:any
  constructor(
    private loadingService: LoadingService
  ) { }

  ngOnInit() {
      this.loading$ = this.loadingService.loading$

  }
  

}
