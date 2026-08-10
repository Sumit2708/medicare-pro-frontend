import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentReportPrintComponent } from './appointment-report-print.component';

describe('AppointmentReportPrintComponent', () => {
  let component: AppointmentReportPrintComponent;
  let fixture: ComponentFixture<AppointmentReportPrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentReportPrintComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentReportPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
