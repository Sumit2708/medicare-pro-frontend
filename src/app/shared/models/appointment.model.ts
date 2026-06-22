export interface Appointment {
  id: number;
  patientId: number;
  doctorId: number;
  appointmentDate: string;
  appointmentTime: string;
  notes: string;
  status: string;
}