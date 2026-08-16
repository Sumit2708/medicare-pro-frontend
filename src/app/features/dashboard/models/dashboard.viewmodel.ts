import { Appointment } from '../../../shared/models/appointment.model';
import { Invoice } from '../../billing/models/invoice.model';
import { RecentAppointmentViewModel } from '../components/recent-appointments/model/recent-appointment.viewmodel';
import { AppointmentChartModel } from './appointment-chart.model';
import { PaymentChartModel } from './payment-summary.model';
import { PendingPaymentViewModel } from './pending-payment.viewmodel';
import { RevenueChartModel } from './revenue-chart.model';

export interface DashboardViewModel {
  // Summary

  totalPatients?: number;

  totalDoctors?: number;

  todayAppointments?: number;

  todayCollectedRevenue?: number;

  // Charts

  monthlyRevenue?: RevenueChartModel[];

  monthlyAppointments?: AppointmentChartModel[];

  paymentSummary?: PaymentChartModel[];

  // Tables

  recentAppointments?: RecentAppointmentViewModel[];

  pendingInvoices: PendingPaymentViewModel[];
  
}
