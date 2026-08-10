export type UserRole = 'Admin' | 'Reception' | 'Stylist';

export interface SalonOutlet {
  id: string;
  name: string;
  type: 'Hair & Beauty' | 'Barber Shop' | 'Luxury Spa' | 'Nail Bar' | 'MedSpa' | 'Unisex Studio';
  tagline: string;
  code: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  gstin: string;
  currencySymbol: string;
  taxRatePercent: number;
  invoicePrefix: string;
  logoUrl: string;
  primaryColor: string;
  isMainBranch?: boolean;
  status: 'Active' | 'Trial' | 'Subscription Active';
  totalDailyRevenue?: number;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  designation: string;
  avatarUrl: string;
  pin: string;
  phone: string;
  permissions: string[];
}

export type TransactionStatus = 'Paid' | 'Pending' | 'Refunded';

export type PaymentMethod = 'Cash' | 'UPI' | 'Card' | 'Split';

export interface Transaction {
  id: string;
  invoiceNo: string;
  customerName: string;
  customerPhone: string;
  stylistName: string;
  services: string[];
  amount: number;
  paymentMethod: PaymentMethod;
  status: TransactionStatus;
  time: string;
  date: string;
}

export type AppointmentStatus = 'Booked' | 'Checked In' | 'Completed' | 'Cancelled';

export interface Appointment {
  id: string;
  time: string;
  customerName: string;
  customerPhone: string;
  stylistName: string;
  service: string;
  amount: number;
  status: AppointmentStatus;
  notes?: string;
}

export type StockStatus = 'Optimal' | 'Low' | 'Critical';

export interface InventoryItem {
  id: string;
  itemName: string;
  category: string;
  remainingQty: number;
  minQty: number;
  unit: string;
  status: StockStatus;
  supplier: string;
  unitPrice: number;
}

export interface Stylist {
  id: string;
  name: string;
  roleTitle: string;
  avatarUrl: string;
  todayRevenue: number;
  appointmentsCount: number;
  commissionRate: number; // percentage
  commissionAmount: number;
  rating: number;
}

export interface CustomerBirthday {
  id: string;
  name: string;
  phone: string;
  age: number;
  birthDate: string; // e.g., 'Today' or 'Aug 10'
  isToday: boolean;
  preferredServices: string[];
}

export type NotificationCategory = 'appointment' | 'inventory' | 'sales' | 'customer' | 'system';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  category: NotificationCategory;
  priority: 'low' | 'medium' | 'high';
}

export interface KPIMetric {
  id: string;
  title: string;
  value: string | number;
  comparison: string;
  isPositive: boolean;
  description: string;
  iconName: string;
}

export interface DailySalesData {
  day: string;
  sales: number;
  appointments: number;
  target: number;
}

export interface PaymentBreakdownData {
  name: PaymentMethod;
  value: number;
  percentage: number;
  color: string;
}

export interface ServiceData {
  serviceName: string;
  bookings: number;
  revenue: number;
}

export interface ExpenseItem {
  id: string;
  title: string;
  category: string;
  amount: number;
  date: string;
  paidTo: string;
  paymentMethod: PaymentMethod;
}
