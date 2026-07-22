import { Invoice } from './invoice.model';
import { Patient } from '../../../shared/models/patient.model';
import { Doctor } from '../../../shared/models/doctor.model';

export interface InvoiceDetails {

  invoice: Invoice;

  patient: Patient;

  doctor: Doctor;

}