export type ReportTimeRange =
  | 'This Week'
  | 'This Month'
  | 'Last Month'
  | 'This Quarter'
  | 'FY 2025-26';

export interface MonthlyFinancialSummary {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

export interface DepartmentRevenueShare {
  department: string;
  revenue: number;
  percentage: number;
  color: string;
}

export interface TopServicePerformance {
  id: string;
  name: string;
  category: string;
  bookingsCount: number;
  totalRevenue: number;
  avgDurationMinutes: number;
}

export interface StaffPerformanceSummary {
  id: string;
  name: string;
  role: string;
  completedAppts: number;
  revenueGenerated: number;
  commissionEarned: number;
  rating: number;
}

export interface PaymentModeDistribution {
  mode: string;
  amount: number;
  count: number;
  percentage: number;
}
