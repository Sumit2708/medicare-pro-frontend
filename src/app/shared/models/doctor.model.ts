import { doctorStatus } from "../../core/enums/doctor-status.enum";

export interface Doctor {
  id: number;
  name: string;
  specialization: string;
  fee: number;
  status: doctorStatus;
}
