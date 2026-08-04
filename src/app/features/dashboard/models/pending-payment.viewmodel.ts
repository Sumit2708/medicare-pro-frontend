import { PaymentStatus } from '../../../core/enums/payment-status.enum';

export interface PendingPaymentViewModel {

  invoiceNumber: string;

  patientName: string;

  amount: number;

  paymentStatus: PaymentStatus;

}