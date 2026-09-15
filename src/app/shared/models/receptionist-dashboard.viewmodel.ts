export interface CheckInItem {
  appointmentId?: any;
  patientName: string;
  doctorName: string;
  paymentStatus?: String;
  total?: number;
  time: string;
  date: string;
  status: string;
}

export interface DoctorAvailabilityItem {
  id: number;
  name: string;
  specialization: string;
  photoUrl?: string;
  status: string; // doctor.status e.g. 'Active' / 'Inactive'
  todayAppointmentsCount: number;
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

export interface WaitingQueueItem {
  appointmentId?: any;
  patientName?: any;
  doctorName?: string;
  checkedInAt?: Date;
}

export interface CheckInRow {
  appointmentId?: any;
  patientName?: string;
  doctorName?: string;
  status?: string;
  waitingQueue?: WaitingQueueItem[];
}