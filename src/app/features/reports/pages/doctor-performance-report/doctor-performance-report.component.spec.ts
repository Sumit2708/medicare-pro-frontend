import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorPerformanceReportComponent } from './doctor-performance-report.component';

describe('DoctorPerformanceReportComponent', () => {
  let component: DoctorPerformanceReportComponent;
  let fixture: ComponentFixture<DoctorPerformanceReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorPerformanceReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorPerformanceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
