import {
  Appointment,
  CustomerBirthday,
  DailySalesData,
  InventoryItem,
  NotificationItem,
  PaymentBreakdownData,
  ServiceData,
  Stylist,
  Transaction,
} from '../types';

// All demo/seed data has been cleared for production use. Each salon starts
// with a clean slate — add real inventory, appointments, staff, etc. from
// within the app.

export const INITIAL_DAILY_SALES: DailySalesData[] = [];

export const INITIAL_PAYMENT_BREAKDOWN: PaymentBreakdownData[] = [];

export const INITIAL_TOP_SERVICES: ServiceData[] = [];

export const INITIAL_STYLISTS: Stylist[] = [];

export const INITIAL_TRANSACTIONS: Transaction[] = [];

export const INITIAL_APPOINTMENTS: Appointment[] = [];

export const INITIAL_INVENTORY: InventoryItem[] = [];

export const INITIAL_BIRTHDAYS: CustomerBirthday[] = [];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [];
