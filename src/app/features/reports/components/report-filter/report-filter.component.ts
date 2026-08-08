import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule
} from '@angular/forms';

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
    MatSelectModule
  ],
  templateUrl: './report-filter.component.html',
  styleUrl: './report-filter.component.scss'
})
export class ReportFilterComponent {

  @Output()
  generate = new EventEmitter<any>();
  form: FormGroup;

  constructor(
    private fb: FormBuilder
  ){

  this.form = this.fb.group({

    fromDate:[null],

    toDate:[null],

    paymentStatus:['ALL']

  });
}

  generateReport(){

    this.generate.emit(

      this.form.getRawValue()

    );

  }

}