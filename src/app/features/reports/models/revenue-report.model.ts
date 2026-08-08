export interface RevenueReportModel {

  invoiceId?: number;

  invoiceNumber?: string;

  patientName?: string;

  doctorName?: string;

  invoiceDate?: string;

  paymentStatus?: string;

  consultationFee?: number;

  discount?: number;

  gst?: number;

  total?: number;

  amount?: number;

}