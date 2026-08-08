import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportExportActionsComponent } from './report-export-actions.component';

describe('ReportExportActionsComponent', () => {
  let component: ReportExportActionsComponent;
  let fixture: ComponentFixture<ReportExportActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportExportActionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportExportActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
