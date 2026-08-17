export interface DoctorScheduleItem {
  patientName: string;
  date: string;
  time: string;
  status: string;
}

export interface DoctorPatientItem {
  name: string;
  lastVisit: string;
  visitCount: number;
}

export interface DoctorDashboardViewModel {
  doctorName: string;
  specialization: string;
  photoUrl?: string;
  todayAppointmentsCount: number;
  totalPatients: number;
  monthlyAppointmentsCount: number;
  todaySchedule: DoctorScheduleItem[];
  upcomingAppointments: DoctorScheduleItem[];
  recentPatients: DoctorPatientItem[];
  monthlyTrend: { month: string; appointments: number }[];
}