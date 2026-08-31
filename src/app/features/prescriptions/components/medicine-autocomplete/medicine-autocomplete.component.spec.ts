import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicineAutocompleteComponent } from './medicine-autocomplete.component';

describe('MedicineAutocompleteComponent', () => {
  let component: MedicineAutocompleteComponent;
  let fixture: ComponentFixture<MedicineAutocompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicineAutocompleteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicineAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
