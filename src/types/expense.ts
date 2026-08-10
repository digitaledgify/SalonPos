export type ExpenseCategory =
  | 'Utilities & Rent'
  | 'Salon Supplies'
  | 'Staff Welfare & Refreshments'
  | 'Maintenance & Repairs'
  | 'Marketing & Ads'
  | 'Software & Tech'
  | 'Miscellaneous';

export type PaymentMethod = 'UPI / GPay' | 'Cash' | 'Credit Card' | 'Bank Transfer';

export type ExpenseStatus = 'Approved' | 'Pending Approval' | 'Reimbursed';

export interface ExpenseItem {
  id: string;
  title: string;
  category: ExpenseCategory;
  amount: number;
  date: string;
  paymentMethod: PaymentMethod;
  paidTo: string;
  approvedBy: string;
  status: ExpenseStatus;
  receiptUrl?: string;
  notes?: string;
}
