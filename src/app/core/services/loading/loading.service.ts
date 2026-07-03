import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  constructor() {}

  private loadingsubject = new BehaviorSubject<boolean>(false);

  loading$ = this.loadingsubject.asObservable();

  show() {
    this.loadingsubject.next(true);
  }

  hide() {
    this.loadingsubject.next(false);
  }
}
