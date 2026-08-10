import React, { createContext, useContext, useState } from 'react';
import {
  SalonProfileSettings,
  BillingTaxSettings,
  NotificationSettings,
  DaySchedule,
} from '../../types/settings';
import { useDashboard } from '../../context/DashboardContext';

interface SettingsContextType {
  activeTab: number;
  setActiveTab: (tab: number) => void;

  profile: SalonProfileSettings;
  setProfile: React.Dispatch<React.SetStateAction<SalonProfileSettings>>;

  hours: DaySchedule[];
  setHours: React.Dispatch<React.SetStateAction<DaySchedule[]>>;

  billing: BillingTaxSettings;
  setBilling: React.Dispatch<React.SetStateAction<BillingTaxSettings>>;

  notifications: NotificationSettings;
  setNotifications: React.Dispatch<React.SetStateAction<NotificationSettings>>;

  saveAllSettings: () => void;
  resetToDefaults: () => void;
}

const DEFAULT_PROFILE: SalonProfileSettings = {
  name: 'Glamour Hair & Beauty Lounge',
  tagline: 'Generic Multi-Salon POS & Business Management Studio',
  phone: '+91 98200 12345',
  email: 'contact@salonpos.com',
  website: 'https://salonpos.com',
  address: '302 Link Plaza, Waterfield Road, Bandra West',
  city: 'Mumbai, Maharashtra - 400050',
  gstin: '27AAAAA0000A1Z5',
  logoUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=250',
};

const DEFAULT_HOURS: DaySchedule[] = [
  { day: 'Monday', isOpen: true, openTime: '09:00 AM', closeTime: '09:00 PM' },
  { day: 'Tuesday', isOpen: true, openTime: '09:00 AM', closeTime: '09:00 PM' },
  { day: 'Wednesday', isOpen: true, openTime: '09:00 AM', closeTime: '09:00 PM' },
  { day: 'Thursday', isOpen: true, openTime: '09:00 AM', closeTime: '09:00 PM' },
  { day: 'Friday', isOpen: true, openTime: '09:00 AM', closeTime: '09:30 PM' },
  { day: 'Saturday', isOpen: true, openTime: '08:30 AM', closeTime: '10:00 PM' },
  { day: 'Sunday', isOpen: true, openTime: '08:30 AM', closeTime: '10:00 PM' },
];

const DEFAULT_BILLING: BillingTaxSettings = {
  gstRatePercent: 18,
  serviceChargePercent: 0,
  invoicePrefix: 'POS-INV-',
  enableAutoPrintInvoice: true,
  enableWhatsAppReceipts: true,
  currencySymbol: '₹',
};

const DEFAULT_NOTIFICATIONS: NotificationSettings = {
  clientAppointmentRemindersSMS: true,
  clientAppointmentWhatsApp: true,
  staffShiftAlerts: true,
  lowStockInventoryAlerts: true,
  dailyManagerSummaryEmail: true,
  reminderLeadHours: 2,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useDashboard();
  const [activeTab, setActiveTab] = useState(0);

  const [profile, setProfile] = useState<SalonProfileSettings>(DEFAULT_PROFILE);
  const [hours, setHours] = useState<DaySchedule[]>(DEFAULT_HOURS);
  const [billing, setBilling] = useState<BillingTaxSettings>(DEFAULT_BILLING);
  const [notifications, setNotifications] = useState<NotificationSettings>(DEFAULT_NOTIFICATIONS);

  const saveAllSettings = () => {
    showToast('Salon configuration & system preferences saved successfully!');
  };

  const resetToDefaults = () => {
    setProfile(DEFAULT_PROFILE);
    setHours(DEFAULT_HOURS);
    setBilling(DEFAULT_BILLING);
    setNotifications(DEFAULT_NOTIFICATIONS);
    showToast('Reset all salon settings to factory defaults.');
  };

  return (
    <SettingsContext.Provider
      value={{
        activeTab,
        setActiveTab,
        profile,
        setProfile,
        hours,
        setHours,
        billing,
        setBilling,
        notifications,
        setNotifications,
        saveAllSettings,
        resetToDefaults,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
