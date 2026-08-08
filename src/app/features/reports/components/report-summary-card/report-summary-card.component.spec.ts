import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportSummaryCardComponent } from './report-summary-card.component';

describe('ReportSummaryCardComponent', () => {
  let component: ReportSummaryCardComponent;
  let fixture: ComponentFixture<ReportSummaryCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportSummaryCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportSummaryCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
