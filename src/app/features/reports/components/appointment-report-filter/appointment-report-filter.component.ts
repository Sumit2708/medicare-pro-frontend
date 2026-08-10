import { Component, EventEmitter, Input, Output } from '@angular/core';

import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { AppointmentReportFilter } from '../../models/appointment-report-filter.model';
import { Doctor } from '../../../../shared/models/doctor.model';

@Component({
  selector: 'app-appointment-report-filter',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
  ],
  templateUrl: './appointment-report-filter.component.html',
  styleUrl: './appointment-report-filter.component.scss',
})
export class AppointmentReportFilterComponent {
  @Input()
  doctors: Doctor[] = [];

  @Output()
  generate = new EventEmitter<AppointmentReportFilter>();

  form: FormGroup;

  today = new Date();
  maxFromDate = new Date();
  minToDate: Date | null = null;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      fromDate: [null as string | null],
      toDate: [null as string | null],
      doctorId: [null as number | null],
      status: ['ALL'],
    });
  }

  generateReport(): void {
    const value = this.form.getRawValue();

    this.generate.emit({
      fromDate: value.fromDate,
      toDate: value.toDate,
      doctorId: value.doctorId,
      status: value.status ?? 'ALL',
    });
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
