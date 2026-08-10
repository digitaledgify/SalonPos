export interface DaySchedule {
  day: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

export interface SalonProfileSettings {
  name: string;
  tagline: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  city: string;
  gstin: string;
  logoUrl: string;
}

export interface BillingTaxSettings {
  gstRatePercent: number;
  serviceChargePercent: number;
  invoicePrefix: string;
  enableAutoPrintInvoice: boolean;
  enableWhatsAppReceipts: boolean;
  currencySymbol: string;
}

export interface NotificationSettings {
  clientAppointmentRemindersSMS: boolean;
  clientAppointmentWhatsApp: boolean;
  staffShiftAlerts: boolean;
  lowStockInventoryAlerts: boolean;
  dailyManagerSummaryEmail: boolean;
  reminderLeadHours: number;
}
