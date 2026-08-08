import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevenueReportPrintComponent } from './revenue-report-print.component';

describe('RevenueReportPrintComponent', () => {
  let component: RevenueReportPrintComponent;
  let fixture: ComponentFixture<RevenueReportPrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RevenueReportPrintComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RevenueReportPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
