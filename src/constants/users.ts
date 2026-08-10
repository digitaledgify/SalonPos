import { UserAccount, UserRole } from '../types';

export const DEMO_USERS: UserAccount[] = [
  {
    id: 'usr-admin',
    name: 'Admin User',
    email: 'admin@mysalon.com',
    role: 'Admin',
    designation: 'Salon Owner / Admin',
    avatarUrl: '',
    pin: '1234',
    phone: '',
    permissions: [
      'Dashboard Analytics',
      'POS & Billing',
      'Appointment Management',
      'Customer CRM',
      'Inventory & Stock',
      'Services & Pricing',
      'Employee & Payroll',
      'Expense Ledger',
      'Reports & Insights',
      'Salon Settings',
    ],
  },
  {
    id: 'usr-reception',
    name: 'Reception User',
    email: 'reception@mysalon.com',
    role: 'Reception',
    designation: 'Front Desk & POS Manager',
    avatarUrl: '',
    pin: '4321',
    phone: '',
    permissions: [
      'Appointments & Calendar',
      'POS Checkout & Invoicing',
      'Customer Check-In & CRM',
      'Cash Drawer Management',
      'Services Catalog View',
      'Inventory Stock Check',
    ],
  },
  {
    id: 'usr-stylist',
    name: 'Stylist User',
    email: 'stylist@mysalon.com',
    role: 'Stylist',
    designation: 'Senior Master Stylist',
    avatarUrl: '',
    pin: '5678',
    phone: '',
    permissions: [
      'My Daily Schedule',
      'Chair Status & Check-In',
      'Customer Notes & Photos',
      'Services & Add-Ons',
      'Daily Commission Tracker',
    ],
  },
];

export interface RoleMeta {
  role: UserRole;
  title: string;
  badge: string;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
  defaultPin: string;
}

export const ROLE_DETAILS: Record<UserRole, RoleMeta> = {
  Admin: {
    role: 'Admin',
    title: 'Admin / Salon Owner',
    badge: 'Full Platform Access',
    color: '#6A3F4D',
    bgColor: '#F8F4EE',
    borderColor: '#EBD9DF',
    description: 'Unrestricted control over financial reports, staff payroll, inventory restocking, expenses, and settings.',
    defaultPin: '1234',
  },
  Reception: {
    role: 'Reception',
    title: 'Receptionist / Front Desk',
    badge: 'POS & Billing Focus',
    color: '#0288D1',
    bgColor: '#E1F5FE',
    borderColor: '#B3E5FC',
    description: 'Quick appointment scheduling, invoice generation, cash drawer reconciliation, and client check-in.',
    defaultPin: '4321',
  },
  Stylist: {
    role: 'Stylist',
    title: 'Stylist / Service Staff',
    badge: 'Schedule & Client Focus',
    color: '#2E7D32',
    bgColor: '#E8F5E9',
    borderColor: '#C8E6C9',
    description: 'Personal appointment list, chair utilization status, service lookup, and daily commission tracking.',
    defaultPin: '5678',
  },
};
