import { TestBed } from '@angular/core/testing';

import { BillingPdfService } from './billing-pdf.service';

describe('BillingPdfService', () => {
  let service: BillingPdfService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BillingPdfService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
