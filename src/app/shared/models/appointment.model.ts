import { AppointmentStatus } from "../../core/enums/appointment-status.enum";

export interface Appointment {
  time?: any;
  date?: any;
  id: number;
  patientId: number;
  doctorId: number;
  appointmentDate: string;
  appointmentTime: string;
  notes: string;
  status: AppointmentStatus;
}