import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-report-filter',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
  ],
  templateUrl: './report-filter.component.html',
  styleUrl: './report-filter.component.scss',
})
export class ReportFilterComponent {
  @Input()
  type: 'revenue' | 'appointment' = 'revenue';

  @Output()
  generate = new EventEmitter<any>();
  form: FormGroup;

  today = new Date();
  maxFromDate = new Date();
  minToDate: Date | null = null;

  
  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      fromDate: [null],

      toDate: [null],

      paymentStatus: ['ALL'],
    });
  }

  generateReport() {
    this.generate.emit(this.form.getRawValue());
  }

  reset(): void {
    this.form.reset({
      fromDate: null,
      toDate: null,
      doctorId: null,
      status: 'ALL',
    });

    this.generateReport();
  }
}
