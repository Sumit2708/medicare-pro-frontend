import { TestBed } from '@angular/core/testing';

import { AppointmentAvailabilityService } from './appointment-availability.service';

describe('AppointmentAvailabilityService', () => {
  let service: AppointmentAvailabilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppointmentAvailabilityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
