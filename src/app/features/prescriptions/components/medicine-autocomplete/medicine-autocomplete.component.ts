import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { Observable, of } from 'rxjs';
import { debounceTime, map, startWith, switchMap } from 'rxjs/operators';
import { Medicine } from '../../model/prescription.model';
import { PrescriptionService } from '../../service/prescriptions.service';

@Component({
  selector: 'app-medicine-autocomplete',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatIconModule,
  ],
  templateUrl: './medicine-autocomplete.component.html',
  styleUrls: ['./medicine-autocomplete.component.scss'],
})
export class MedicineAutocompleteComponent implements OnInit {
  @Input() control!: FormControl;
  @Output() medicineSelected = new EventEmitter<Medicine>();
  @Output() addNewMedicine = new EventEmitter<string>();
 
  allMedicines: Medicine[] = [];
  filteredMedicines$!: Observable<Medicine[]>;
 
  constructor(private prescriptionService: PrescriptionService) {}
 
  ngOnInit(): void {
    this.prescriptionService.getAllMedicines().subscribe((meds) => (this.allMedicines = meds));
 
    this.filteredMedicines$ = this.control.valueChanges.pipe(
      startWith(''),
      debounceTime(150),
      switchMap((value) => this.filter(typeof value === 'string' ? value : value?.name ?? ''))
    );
  }
 
  private filter(query: string): Observable<Medicine[]> {
    const q = query.trim().toLowerCase();
    if (!q) return of(this.allMedicines.slice(0, 10));
    return of(this.allMedicines.filter((m) => m.name.toLowerCase().includes(q)));
  }
 
  displayFn = (med: Medicine | string): string => {
    if (!med) return '';
    return typeof med === 'string' ? med : med.name;
  };
 
  onSelect(med: Medicine): void {
    this.medicineSelected.emit(med);
  }
 
  onAddNew(name: string): void {
    this.addNewMedicine.emit(name);
  }
}