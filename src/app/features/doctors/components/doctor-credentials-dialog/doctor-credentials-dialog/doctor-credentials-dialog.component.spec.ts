import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorCredentialsDialogComponent } from './doctor-credentials-dialog.component';

describe('DoctorCredentialsDialogComponent', () => {
  let component: DoctorCredentialsDialogComponent;
  let fixture: ComponentFixture<DoctorCredentialsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoctorCredentialsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoctorCredentialsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
