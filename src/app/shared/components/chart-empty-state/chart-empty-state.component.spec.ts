import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartEmptyStateComponent } from './chart-empty-state.component';

describe('ChartEmptyStateComponent', () => {
  let component: ChartEmptyStateComponent;
  let fixture: ComponentFixture<ChartEmptyStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartEmptyStateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartEmptyStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
