export interface Medicine {
  id: string;
  name: string;
  dosageForm?: string; // Tablet, Syrup, Injection, Capsule, Cream
  strength?: string;   // e.g. 500mg
}

export interface PrescriptionItem {
  medicineId: string;
  medicineName: string;   // denormalized for display + print
  dosageForm?: string;
  strength?: string;
  dosage: string;          // e.g. "1-0-1"
  frequency: string;       // e.g. "After food"
  duration: string;        // e.g. "5 days"
  notes?: string;
}

export type PrescriptionStatus = 'active' | 'completed' | 'cancelled';

export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  appointmentId?: string | number;
  doctorId?: string | number;
  doctorName: string;
  date: string;             // ISO date
  diagnosis?: string;
  items: PrescriptionItem[];
  advice?: string;
  followUpDate?: string;
  status: PrescriptionStatus;
}