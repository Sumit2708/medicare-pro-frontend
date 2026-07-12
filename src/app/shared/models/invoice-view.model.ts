import { Appointment } from './appointment.model';
import { Doctor } from './doctor.model';
import { Patient } from './patient.model';

export interface InvoiceViewModel {
  appointment: Appointment;
  doctor: Doctor;
  patient: Patient;
}
