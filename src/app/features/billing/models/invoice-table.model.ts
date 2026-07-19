import { PaymentMethod,PaymentStatus } from "../../../core/enums/payment-status.enum";

export interface InvoiceTable {

  id: number;

  invoiceNumber: string;

  patientName: string;

  doctorName: string;

  total: number;

  paymentMethod: PaymentMethod;

  paymentStatus: PaymentStatus;

  createdDate: string;
}