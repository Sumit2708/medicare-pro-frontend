export interface Invoice {
  id: number;
  invoiceNumber: string;
  appointmentId: number;
  patientId: number;
  doctorId: number;
  consultationFee: number;
  discount: number;
  gstPercentage: number;
  gstAmount: number;
  totalAmount: number;
  paymentMethod: 'Cash' | 'UPI' | 'Card' | 'Insurance';
  paymentStatus: 'Pending' | 'Paid' | 'Cancelled';
  createdDate: string;
}
