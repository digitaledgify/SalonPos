import React, { createContext, useContext, useState } from 'react';
import {
  INITIAL_APPOINTMENTS,
  INITIAL_BIRTHDAYS,
  INITIAL_DAILY_SALES,
  INITIAL_INVENTORY,
  INITIAL_NOTIFICATIONS,
  INITIAL_PAYMENT_BREAKDOWN,
  INITIAL_STYLISTS,
  INITIAL_TOP_SERVICES,
  INITIAL_TRANSACTIONS,
} from '../services/data';
import { INITIAL_SALON_OUTLETS } from '../services/outlets';
import {
  Appointment,
  AppointmentStatus,
  CustomerBirthday,
  DailySalesData,
  ExpenseItem,
  InventoryItem,
  NotificationItem,
  PaymentBreakdownData,
  SalonOutlet,
  ServiceData,
  Stylist,
  Transaction,
  UserAccount,
  UserRole,
} from '../types';
import { DEMO_USERS } from '../constants/users';
import { useAuth } from './AuthContext';

interface DashboardContextType {
  // Multi-Tenant / Multi-Salon Outlets
  outlets: SalonOutlet[];
  activeOutlet: SalonOutlet;
  switchOutlet: (outletId: string) => void;
  addOutlet: (outlet: Omit<SalonOutlet, 'id' | 'status'>) => void;
  isNewOutletModalOpen: boolean;
  setIsNewOutletModalOpen: (open: boolean) => void;

  // Auth State & Actions
  currentUser: UserAccount;
  isAuthenticated: boolean;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  loginWithPin: (role: UserRole, pin: string) => boolean;
  directLogin: (user: UserAccount) => void;
  logout: () => void;

  role: UserRole;
  setRole: (role: UserRole) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Data State
  transactions: Transaction[];
  appointments: Appointment[];
  inventory: InventoryItem[];
  notifications: NotificationItem[];
  stylists: Stylist[];
  birthdays: CustomerBirthday[];
  dailySales: DailySalesData[];
  paymentBreakdown: PaymentBreakdownData[];
  topServices: ServiceData[];
  expenses: ExpenseItem[];

  // Action Functions
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'invoiceNo' | 'date' | 'time'>) => void;
  addExpense: (expense: Omit<ExpenseItem, 'id' | 'date'>) => void;
  restockItem: (id: string, addedQty: number) => void;
  addInventoryItem: (item: Omit<InventoryItem, 'id' | 'status'>) => void;
  updateInventoryItem: (id: string, updated: Partial<InventoryItem>) => void;
  deleteInventoryItem: (id: string) => void;
  adjustInventoryStock: (id: string, deltaQty: number, reason: string) => void;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
  addCustomerBirthday: (customer: Omit<CustomerBirthday, 'id'>) => void;

  // Modals & UI State
  isNewAppointmentOpen: boolean;
  setIsNewAppointmentOpen: (open: boolean) => void;
  isNewBillOpen: boolean;
  setIsNewBillOpen: (open: boolean) => void;
  isNewCustomerOpen: boolean;
  setIsNewCustomerOpen: (open: boolean) => void;
  isAddExpenseOpen: boolean;
  setIsAddExpenseOpen: (open: boolean) => void;
  selectedInvoice: Transaction | null;
  setSelectedInvoice: (tx: Transaction | null) => void;
  
  // Toast Snackbar
  toastMessage: string | null;
  showToast: (msg: string) => void;
  hideToast: () => void;

  // Sidebar Mobile Toggle
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (open: boolean) => void;
  activeNavItem: string;
  setActiveNavItem: (item: string) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile, salon: authSalon, signOut: authSignOut } = useAuth();

  // Build the outlet from the real salon record (falls back to the local
  // placeholder only if something is still loading).
  const derivedOutlet: SalonOutlet = authSalon
    ? {
        id: authSalon.id,
        name: authSalon.name,
        type: 'Hair & Beauty',
        tagline: '',
        code: authSalon.code,
        address: authSalon.address,
        city: authSalon.city,
        phone: authSalon.phone,
        email: authSalon.email,
        gstin: '',
        currencySymbol: authSalon.currencySymbol,
        taxRatePercent: authSalon.taxRatePercent,
        invoicePrefix: 'INV-',
        logoUrl: '',
        primaryColor: '#6A3F4D',
        isMainBranch: true,
        status: 'Active',
        totalDailyRevenue: 0,
      }
    : INITIAL_SALON_OUTLETS[0];

  const [outlets, setOutlets] = useState<SalonOutlet[]>([derivedOutlet]);
  const [activeOutletId, setActiveOutletId] = useState<string>(derivedOutlet.id);
  const [isNewOutletModalOpen, setIsNewOutletModalOpen] = useState(false);

  // Keep the outlet list in sync once the real salon loads in from Supabase
  React.useEffect(() => {
    if (authSalon) {
      setOutlets([derivedOutlet]);
      setActiveOutletId(derivedOutlet.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authSalon?.id]);

  const activeOutlet = outlets.find((o) => o.id === activeOutletId) || outlets[0];

  const switchOutlet = (outletId: string) => {
    setActiveOutletId(outletId);
    const target = outlets.find((o) => o.id === outletId);
    if (target) {
      showToast(`Switched active POS outlet to "${target.name}" (${target.code})`);
    }
  };

  const addOutlet = (newOutletData: Omit<SalonOutlet, 'id' | 'status'>) => {
    const newOutlet: SalonOutlet = {
      ...newOutletData,
      id: `outlet-${Date.now()}`,
      status: 'Subscription Active',
      totalDailyRevenue: 0,
    };
    setOutlets((prev) => [...prev, newOutlet]);
    setActiveOutletId(newOutlet.id);
    showToast(`Registered new Salon Tenant "${newOutlet.name}"!`);
  };

  // currentUser is now driven by the real logged-in Supabase profile.
  // DEMO_USERS is only used as a shape/permissions fallback while the
  // profile is still loading, and for the "quick switch role" demo helper.
  const derivedUser: UserAccount = profile
    ? {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        role: profile.role,
        designation: profile.designation,
        avatarUrl: profile.avatarUrl,
        pin: '',
        phone: profile.phone,
        permissions: DEMO_USERS.find((u) => u.role === profile.role)?.permissions ?? [],
      }
    : DEMO_USERS[0];

  const [currentUser, setCurrentUser] = useState<UserAccount>(derivedUser);

  // Keep currentUser in sync once the real profile loads in from Supabase
  React.useEffect(() => {
    if (profile) {
      setCurrentUser(derivedUser);
      setRoleState(profile.role);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.id, profile?.role]);

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  const [role, setRoleState] = useState<UserRole>('Admin');
  const [searchQuery, setSearchQuery] = useState('');

  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [stylists] = useState<Stylist[]>(INITIAL_STYLISTS);
  const [birthdays, setBirthdays] = useState<CustomerBirthday[]>(INITIAL_BIRTHDAYS);
  const [dailySales, setDailySales] = useState<DailySalesData[]>(INITIAL_DAILY_SALES);
  const [paymentBreakdown] = useState<PaymentBreakdownData[]>(INITIAL_PAYMENT_BREAKDOWN);
  const [topServices] = useState<ServiceData[]>(INITIAL_TOP_SERVICES);
  const [expenses, setExpenses] = useState<ExpenseItem[]>([
    {
      id: 'exp-1',
      title: 'Salon Cleaning Supplies',
      category: 'Maintenance',
      amount: 1450,
      date: 'Today',
      paidTo: 'CleanCare Services',
      paymentMethod: 'UPI',
    },
  ]);

  // Modal Controls
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
  const [isNewBillOpen, setIsNewBillOpen] = useState(false);
  const [isNewCustomerOpen, setIsNewCustomerOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Transaction | null>(null);

  // Mobile Sidebar
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState('Customers');

  // Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  const hideToast = () => {
    setToastMessage(null);
  };

  const loginWithPin = (targetRole: UserRole, enteredPin: string): boolean => {
    const matchUser = DEMO_USERS.find((u) => u.role === targetRole);
    if (matchUser && matchUser.pin === enteredPin) {
      setCurrentUser(matchUser);
      setRoleState(matchUser.role);
      setIsAuthenticated(true);
      setIsLoginModalOpen(false);
      showToast(`Welcome back, ${matchUser.name}! Logged in as ${matchUser.role}.`);
      return true;
    }
    return false;
  };

  const directLogin = (user: UserAccount) => {
    setCurrentUser(user);
    setRoleState(user.role);
    setIsAuthenticated(true);
    setIsLoginModalOpen(false);
    showToast(`Logged in as ${user.name} (${user.role})`);
  };

  const logout = () => {
    authSignOut();
    showToast('Signed out successfully.');
  };

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    const matchingUser = DEMO_USERS.find((u) => u.role === newRole);
    if (matchingUser) {
      setCurrentUser(matchingUser);
    }
    showToast(`Role switched to ${newRole}. View widgets updated.`);
  };

  // Status Handlers
  const updateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, status } : apt))
    );
    showToast(`Appointment status updated to ${status}`);
  };

  const addAppointment = (newAptData: Omit<Appointment, 'id'>) => {
    const newApt: Appointment = {
      ...newAptData,
      id: `apt-${Date.now()}`,
    };
    setAppointments((prev) => [newApt, ...prev]);
    showToast(`New appointment booked for ${newAptData.customerName}!`);
  };

  const addTransaction = (
    txData: Omit<Transaction, 'id' | 'invoiceNo' | 'date' | 'time'>
  ) => {
    const invNumber = `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    const newTx: Transaction = {
      ...txData,
      id: `tx-${Date.now()}`,
      invoiceNo: invNumber,
      date: 'Today',
      time: timeStr,
    };

    setTransactions((prev) => [newTx, ...prev]);
    
    // Dynamically update Today's Sales chart and revenue
    if (newTx.status === 'Paid') {
      setDailySales((prev) =>
        prev.map((item) =>
          item.day === 'Friday' || item.day === 'Today'
            ? { ...item, sales: item.sales + newTx.amount }
            : item
        )
      );
    }

    showToast(`Bill ${invNumber} generated for ${newTx.customerName}!`);
  };

  const addExpense = (expData: Omit<ExpenseItem, 'id' | 'date'>) => {
    const newExp: ExpenseItem = {
      ...expData,
      id: `exp-${Date.now()}`,
      date: 'Today',
    };
    setExpenses((prev) => [newExp, ...prev]);
    showToast(`Expense of ₹${newExp.amount} logged successfully.`);
  };

  const restockItem = (id: string, addedQty: number) => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = item.remainingQty + addedQty;
          const status = newQty > item.minQty ? 'Optimal' : newQty > item.minQty / 2 ? 'Low' : 'Critical';
          return { ...item, remainingQty: newQty, status };
        }
        return item;
      })
    );
    showToast(`Restocked product (+${addedQty} units)!`);
  };

  const addInventoryItem = (newItemData: Omit<InventoryItem, 'id' | 'status'>) => {
    const status =
      newItemData.remainingQty > newItemData.minQty
        ? 'Optimal'
        : newItemData.remainingQty > newItemData.minQty / 2
        ? 'Low'
        : 'Critical';
    const newItem: InventoryItem = {
      ...newItemData,
      id: `inv-${Date.now()}`,
      status,
    };
    setInventory((prev) => [newItem, ...prev]);
    showToast(`Added new product "${newItem.itemName}" to inventory.`);
  };

  const updateInventoryItem = (id: string, updated: Partial<InventoryItem>) => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const merged = { ...item, ...updated };
          const status =
            merged.remainingQty > merged.minQty
              ? 'Optimal'
              : merged.remainingQty > merged.minQty / 2
              ? 'Low'
              : 'Critical';
          return { ...merged, status };
        }
        return item;
      })
    );
    showToast(`Updated item details successfully.`);
  };

  const deleteInventoryItem = (id: string) => {
    setInventory((prev) => prev.filter((item) => item.id !== id));
    showToast(`Item removed from inventory.`);
  };

  const adjustInventoryStock = (id: string, deltaQty: number, reason: string) => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(0, item.remainingQty + deltaQty);
          const status =
            newQty > item.minQty ? 'Optimal' : newQty > item.minQty / 2 ? 'Low' : 'Critical';
          return { ...item, remainingQty: newQty, status };
        }
        return item;
      })
    );
    showToast(`Stock adjusted (${deltaQty > 0 ? '+' : ''}${deltaQty}): ${reason}`);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
    showToast('All notifications cleared');
  };

  const addCustomerBirthday = (customer: Omit<CustomerBirthday, 'id'>) => {
    const newBday: CustomerBirthday = {
      ...customer,
      id: `bday-${Date.now()}`,
    };
    setBirthdays((prev) => [newBday, ...prev]);
    showToast(`Customer ${customer.name} registered!`);
  };

  return (
    <DashboardContext.Provider
      value={{
        outlets,
        activeOutlet,
        switchOutlet,
        addOutlet,
        isNewOutletModalOpen,
        setIsNewOutletModalOpen,
        currentUser,
        isAuthenticated,
        isLoginModalOpen,
        setIsLoginModalOpen,
        loginWithPin,
        directLogin,
        logout,
        role,
        setRole,
        searchQuery,
        setSearchQuery,
        transactions,
        appointments,
        inventory,
        notifications,
        stylists,
        birthdays,
        dailySales,
        paymentBreakdown,
        topServices,
        expenses,
        updateAppointmentStatus,
        addAppointment,
        addTransaction,
        addExpense,
        restockItem,
        addInventoryItem,
        updateInventoryItem,
        deleteInventoryItem,
        adjustInventoryStock,
        markNotificationAsRead,
        clearNotifications,
        addCustomerBirthday,
        isNewAppointmentOpen,
        setIsNewAppointmentOpen,
        isNewBillOpen,
        setIsNewBillOpen,
        isNewCustomerOpen,
        setIsNewCustomerOpen,
        isAddExpenseOpen,
        setIsAddExpenseOpen,
        selectedInvoice,
        setSelectedInvoice,
        toastMessage,
        showToast,
        hideToast,
        isMobileSidebarOpen,
        setIsMobileSidebarOpen,
        activeNavItem,
        setActiveNavItem,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
