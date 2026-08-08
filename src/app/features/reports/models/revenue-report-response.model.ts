import { RevenueReportModel } from './revenue-report.model';
import { RevenueSummaryModel } from './revenue-summary.model';

export interface RevenueReportResponse {
  summary: RevenueSummaryModel;

  invoices: RevenueReportModel[];
}
