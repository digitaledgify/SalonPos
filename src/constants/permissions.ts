import { UserRole } from '../types';

/**
 * Single source of truth for what each role can see and do.
 *
 * NAV_ACCESS controls which Sidebar items (and therefore which top-level
 * modules) a role can navigate to at all. CAN_EDIT_* flags control finer
 * grained write access *within* a module a role does have access to (e.g.
 * Reception can see Inventory but not add/restock products).
 */

export const NAV_ACCESS: Record<UserRole, string[]> = {
  Admin: [
    'Dashboard',
    'Appointments',
    'Billing',
    'Customers',
    'Inventory',
    'Services',
    'Employees',
    'Expenses',
    'Reports',
    'Settings',
  ],
  Reception: ['Dashboard', 'Appointments', 'Billing', 'Customers', 'Inventory', 'Services'],
  // Stylists get a stripped-down "Employees" view limited to their own
  // commission/earnings — see EmployeesModule.tsx.
  Stylist: ['Dashboard', 'Appointments', 'Customers', 'Services', 'Employees'],
};

export const canAccessNavItem = (role: UserRole, navItem: string): boolean =>
  NAV_ACCESS[role]?.includes(navItem) ?? false;

// Only Admin can add/edit/delete/restock inventory. Reception can view
// stock levels ("stock check") but not modify them. Stylists don't get
// the Inventory module at all (see NAV_ACCESS above).
export const canEditInventory = (role: UserRole): boolean => role === 'Admin';

// Only Admin manages the service catalog (pricing, add/edit/delete).
// Reception and Stylist can view it to quote clients or check duration.
export const canEditServices = (role: UserRole): boolean => role === 'Admin';

// Only Admin sees salon-wide financial/staff data: full payroll, other
// staff's commission, expense ledger, reports, and salon settings.
export const canViewFinancials = (role: UserRole): boolean => role === 'Admin';
