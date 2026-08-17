import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertBanerComponent } from './alert-baner.component';

describe('AlertBanerComponent', () => {
  let component: AlertBanerComponent;
  let fixture: ComponentFixture<AlertBanerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertBanerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlertBanerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
