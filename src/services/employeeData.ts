import { RoleDefinition } from '../types/employee';

export const INITIAL_ROLES: RoleDefinition[] = [
  {
    id: 'role-1',
    title: 'Master Senior Stylist',
    department: 'Hair Care',
    description: 'Expert in creative precision cuts, couture styling, and client consultation.',
    defaultCommissionRate: 15,
    permissions: ['POS Billing', 'Appointments Booking', 'Custom Services', 'Reports View'],
    color: '#6A3F4D',
  },
  {
    id: 'role-2',
    title: 'Senior Colorist & Spa Expert',
    department: 'Hair Care',
    description: 'Specialist in balayage, highlight technique, keratin, and scalp spa treatments.',
    defaultCommissionRate: 15,
    permissions: ['POS Billing', 'Appointments Booking', 'Inventory Usage Log'],
    color: '#8E7B82',
  },
  {
    id: 'role-3',
    title: 'Grooming & Barber Lead',
    department: 'Grooming & Barber',
    description: 'Head of men’s beard styling, royal hot-towel shaves, and executive cuts.',
    defaultCommissionRate: 12,
    permissions: ['POS Billing', 'Appointments Booking', 'Walk-in Queue'],
    color: '#6E5C63',
  },
  {
    id: 'role-4',
    title: 'Aesthetician & Makeup Artist',
    department: 'Skin & Aesthetics',
    description: 'Certified hydra-facial practitioner, party makeup, and skincare expert.',
    defaultCommissionRate: 12,
    permissions: ['POS Billing', 'Appointments Booking', 'Skincare Log'],
    color: '#A8828F',
  },
  {
    id: 'role-5',
    title: 'Hair Specialist',
    department: 'Hair Care',
    description: 'General hair care, washes, deep conditioning, and blow-dry styling.',
    defaultCommissionRate: 10,
    permissions: ['Appointments View', 'Inventory Usage Log'],
    color: '#8E7B82',
  },
  {
    id: 'role-6',
    title: 'Salon Manager',
    department: 'Management',
    description: 'Oversees daily salon operations, payroll, inventory, staff shifts, and POS.',
    defaultCommissionRate: 18,
    permissions: ['Full Access', 'Commission Edit', 'Shift Roster Manager', 'Financial Reports'],
    color: '#2D1F24',
  },
  {
    id: 'role-7',
    title: 'Front Desk Executive',
    department: 'Front Desk',
    description: 'Manages client check-ins, appointment scheduling, billing, and phone queries.',
    defaultCommissionRate: 5,
    permissions: ['POS Billing', 'Appointments Booking', 'Customer Database', 'Register Cash'],
    color: '#6E5C63',
  },
];

export const DEFAULT_WEEKLY_SHIFTS = [
  { day: 'Mon' as const, shiftType: 'Morning' as const, startTime: '09:00 AM', endTime: '04:00 PM' },
  { day: 'Tue' as const, shiftType: 'Morning' as const, startTime: '09:00 AM', endTime: '04:00 PM' },
  { day: 'Wed' as const, shiftType: 'Evening' as const, startTime: '01:00 PM', endTime: '08:00 PM' },
  { day: 'Thu' as const, shiftType: 'Full Day' as const, startTime: '09:30 AM', endTime: '07:30 PM' },
  { day: 'Fri' as const, shiftType: 'Full Day' as const, startTime: '09:30 AM', endTime: '07:30 PM' },
  { day: 'Sat' as const, shiftType: 'Full Day' as const, startTime: '09:00 AM', endTime: '08:00 PM' },
  { day: 'Sun' as const, shiftType: 'Off' as const, startTime: '-', endTime: '-' },
];


// Sample/demo employee records have been removed for production use.
// Employees are added per-salon from within the Employees module and
// persisted to Supabase.
