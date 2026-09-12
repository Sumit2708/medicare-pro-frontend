import { TestBed } from '@angular/core/testing';

import { GlobalsearchService } from './globalsearch.service';

describe('GlobalsearchService', () => {
  let service: GlobalsearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalsearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
