export type EmployeeStatus = 'Active' | 'On Shift' | 'On Leave' | 'Off Duty' | 'Inactive';

export type ShiftType = 'Morning' | 'Evening' | 'Full Day' | 'Night' | 'Off';

export type DepartmentType =
  | 'Hair Care'
  | 'Skin & Aesthetics'
  | 'Grooming & Barber'
  | 'Front Desk'
  | 'Management';

export interface ShiftSchedule {
  day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';
  shiftType: ShiftType;
  startTime: string;
  endTime: string;
}

export interface CommissionCategoryRate {
  categoryName: string;
  ratePercentage: number;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface Employee {
  id: string;
  name: string;
  roleTitle: string;
  department: DepartmentType;
  avatarUrl: string;
  email: string;
  phone: string;
  startDate: string;
  status: EmployeeStatus;

  // Financials & Commission
  baseSalary: number; // Monthly base salary in ₹
  commissionRate: number; // Base commission rate %
  commissionTiers?: CommissionCategoryRate[];
  todaySales: number;
  monthlySales: number;
  commissionEarnedToday: number;
  commissionEarnedMonth: number;
  tipsToday: number;

  // Rating & Stats
  rating: number;
  completedAppointmentsCount: number;

  // Schedules & Details
  shifts: ShiftSchedule[];
  emergencyContact: EmergencyContact;
  specialties: string[];
  bio?: string;
  payoutStatus?: 'Paid' | 'Pending';
}

export interface RoleDefinition {
  id: string;
  title: string;
  department: DepartmentType;
  description: string;
  defaultCommissionRate: number;
  permissions: string[];
  color: string;
}
