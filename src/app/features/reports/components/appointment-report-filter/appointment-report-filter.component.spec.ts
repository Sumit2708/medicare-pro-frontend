import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentReportFilterComponent } from './appointment-report-filter.component';

describe('AppointmentReportFilterComponent', () => {
  let component: AppointmentReportFilterComponent;
  let fixture: ComponentFixture<AppointmentReportFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentReportFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentReportFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
