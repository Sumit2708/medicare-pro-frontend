import { PaymentMethod, PaymentStatus } from "../../../core/enums/payment-status.enum";

export interface Invoice {
   id?: number;

  invoiceNumber: string;

  appointmentId: number;

  patientId: number;

  doctorId: number;

  consultationFee: number;

  discount: number;

  gst: number;

  total: number;

  paymentMethod: PaymentMethod;

  paymentStatus: PaymentStatus;

  createdDate: string;

}
