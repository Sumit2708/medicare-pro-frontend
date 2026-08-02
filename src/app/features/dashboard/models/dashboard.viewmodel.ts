import { Appointment } from "../../../shared/models/appointment.model";
import { Invoice } from "../../billing/models/invoice.model";
import { AppointmentChartModel } from "./appointment-chart.model";
import { PaymentChartModel } from "./payment-summary.model";
import { RevenueChartModel } from "./revenue-chart.model";

export interface DashboardViewModel {

    // Summary

    totalPatients?: number;

    totalDoctors?: number;

    todayAppointments?: number;

    todayRevenue?: number;

    // Charts

    monthlyRevenue?: RevenueChartModel[];

    monthlyAppointments?: AppointmentChartModel[];

    paymentSummary?: PaymentChartModel[];

    // Tables

    recentAppointments?: Appointment[];

    pendingInvoices?: Invoice[];

}