import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  constructor() {}

  private loadingsubject = new BehaviorSubject<boolean>(false);
  private totalRequest = 0;

  loading$ = this.loadingsubject.asObservable();

  show() {
    this.totalRequest++;
    this.loadingsubject.next(true);
  }

  hide() {
    if (this.totalRequest > 0) {
      this.totalRequest--;
    }
    if (this.totalRequest == 0) {
      this.loadingsubject.next(false);
    }
  }
}
