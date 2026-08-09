export interface AppointmentReportFilter {
  fromDate: string | null;

  toDate: string | null;

  status: string;

  doctorId: number | null;
}