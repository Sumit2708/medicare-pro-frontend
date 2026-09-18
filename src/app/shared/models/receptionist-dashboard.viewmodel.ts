export interface CheckInItem {
  appointmentId: string;
  patientName: string;
  doctorName: string;
  paymentStatus?: string;
  total?: number;
  time: string;
  date: string;
  status: string;
  checkedInAt?: string;
}

export interface DoctorAvailabilityItem {
  id: number;
  name: string;
  specialization: string;
  photoUrl?: string;
  status: string; // doctor.status e.g. 'Active' / 'Inactive'
  todayAppointmentsCount: number;
}

export interface WaitingQueueItem {
  appointmentId: string;
  patientName: string;
  doctorName: string;
  checkedInAt: Date;
}

export interface ReceptionistDashboardViewModel {
  todayAppointmentsCount: number;
  checkedInCount: number;
  waitingCount: number;
  todayCollectedRevenue: number;
  todayPendingAmount: number;
  pendingInvoicesCount: number;
  todayCheckIns: CheckInItem[];
  doctorsAvailability: DoctorAvailabilityItem[];
}