import {
  MonthlyFinancialSummary,
  DepartmentRevenueShare,
  TopServicePerformance,
  StaffPerformanceSummary,
  PaymentModeDistribution,
} from '../types/report';

export const MONTHLY_FINANCIALS: MonthlyFinancialSummary[] = [
  { month: 'Mar', revenue: 420000, expenses: 185000, profit: 235000 },
  { month: 'Apr', revenue: 465000, expenses: 192000, profit: 273000 },
  { month: 'May', revenue: 510000, expenses: 205000, profit: 305000 },
  { month: 'Jun', revenue: 480000, expenses: 198000, profit: 282000 },
  { month: 'Jul', revenue: 545000, expenses: 212000, profit: 333000 },
  { month: 'Aug (YTD)', revenue: 592000, expenses: 224000, profit: 368000 },
];

export const DEPARTMENT_REVENUE_SHARES: DepartmentRevenueShare[] = [
  { department: 'Hair Care & Hair Spa', revenue: 284160, percentage: 48, color: '#6A3F4D' },
  { department: 'Skin & Aesthetics Facials', revenue: 165760, percentage: 28, color: '#A8828F' },
  { department: 'Grooming & Barbering', revenue: 82880, percentage: 14, color: '#6E5C63' },
  { department: 'Retail Products & Aftercare', revenue: 59200, percentage: 10, color: '#2D1F24' },
];

export const TOP_SERVICES_PERFORMANCE: TopServicePerformance[] = [
  { id: '1', name: 'Brazilian Keratin Hair Smoothing', category: 'Hair Care', bookingsCount: 68, totalRevenue: 183600, avgDurationMinutes: 120 },
  { id: '2', name: 'HydraFacial MD Glowing Skin Treatment', category: 'Skin & Aesthetics', bookingsCount: 52, totalRevenue: 130000, avgDurationMinutes: 60 },
  { id: '3', name: 'Signature Balayage & Hair Coloring', category: 'Hair Care', bookingsCount: 44, totalRevenue: 110000, avgDurationMinutes: 150 },
  { id: '4', name: 'Precision Haircut & Beard Sculpting', category: 'Grooming & Barber', bookingsCount: 112, totalRevenue: 89600, avgDurationMinutes: 45 },
  { id: '5', name: 'O3+ Bridal Glow & D-Tan Facial', category: 'Skin & Aesthetics', bookingsCount: 38, totalRevenue: 68400, avgDurationMinutes: 75 },
];

export const STAFF_PERFORMANCE_REPORTS: StaffPerformanceSummary[] = [
  { id: 'EMP-01', name: 'Aarav Kapoor', role: 'Master Senior Stylist', completedAppts: 86, revenueGenerated: 184500, commissionEarned: 27675, rating: 4.9 },
  { id: 'EMP-02', name: 'Priya Sharma', role: 'Aesthetician Lead', completedAppts: 72, revenueGenerated: 152000, commissionEarned: 22800, rating: 4.95 },
  { id: 'EMP-03', name: 'Rohan Mehta', role: 'Beard & Haircut Specialist', completedAppts: 94, revenueGenerated: 118200, commissionEarned: 14184, rating: 4.85 },
  { id: 'EMP-04', name: 'Ananya Verma', role: 'Colorist & Hair Artist', completedAppts: 61, revenueGenerated: 98000, commissionEarned: 13720, rating: 4.8 },
];

export const PAYMENT_MODES_DISTRIBUTION: PaymentModeDistribution[] = [
  { mode: 'UPI / GPay / PhonePe', amount: 343360, count: 248, percentage: 58 },
  { mode: 'Credit / Debit Cards', amount: 142080, count: 82, percentage: 24 },
  { mode: 'Cash', amount: 106560, count: 95, percentage: 18 },
];
