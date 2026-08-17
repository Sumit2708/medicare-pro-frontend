export interface Patient {
  id: number;
  name: string;
  age: number;
  gender: string;
  mobile: string;
  status: string;
  address?: String;

  bloodGroup?: string;
  alternateMobile?: string;
  medicalHistory?: string;
}
