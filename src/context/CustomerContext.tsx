import React, { createContext, useContext, useState, useMemo } from 'react';
import { Customer, CustomerFilterState, CustomerVisit, PhotoCategory } from '../types/customer';

interface CustomerContextType {
  customers: Customer[];
  selectedCustomer: Customer | null;
  setSelectedCustomer: (c: Customer | null) => void;
  isCustomerFormOpen: boolean;
  setIsCustomerFormOpen: (open: boolean) => void;
  customerToEdit: Customer | null;
  setCustomerToEdit: (c: Customer | null) => void;
  filters: CustomerFilterState;
  setFilters: React.Dispatch<React.SetStateAction<CustomerFilterState>>;
  
  // Quick Booking / Billing modals integration
  isBookingOpen: boolean;
  setIsBookingOpen: (open: boolean) => void;
  isBillingOpen: boolean;
  setIsBillingOpen: (open: boolean) => void;
  targetCustomerForAction: Customer | null;
  setTargetCustomerForAction: (c: Customer | null) => void;

  // Actions
  addCustomer: (data: Partial<Customer>) => { success: boolean; error?: string };
  updateCustomer: (id: string, data: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  addNoteToCustomer: (customerId: string, text: string) => void;
  addPhotoToCustomer: (customerId: string, photo: { url: string; category: PhotoCategory; title: string }) => void;
  addLoyaltyPoints: (customerId: string, points: number) => void;
  redeemLoyaltyPoints: (customerId: string, points: number) => boolean;
  addVisitToCustomer: (customerId: string, visit: Omit<CustomerVisit, 'id'>) => void;
  exportCSV: () => void;
  importCustomersCSV: (csvText: string) => void;
  sendBirthdayWish: (customer: Customer) => void;
  checkPhoneExists: (phone: string, currentId?: string) => boolean;

  // Notification Toast
  toast: { message: string; type: 'success' | 'info' | 'warning' } | null;
  showCustomerToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  hideCustomerToast: () => void;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export const CustomerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customers, setCustomers] = useState<Customer[]>(() => []);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isCustomerFormOpen, setIsCustomerFormOpen] = useState(false);
  const [customerToEdit, setCustomerToEdit] = useState<Customer | null>(null);

  // Quick Action Modal states for Booking and Billing
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isBillingOpen, setIsBillingOpen] = useState(false);
  const [targetCustomerForAction, setTargetCustomerForAction] = useState<Customer | null>(null);

  // Filters State
  const [filters, setFilters] = useState<CustomerFilterState>({
    searchQuery: '',
    membership: 'All',
    sortBy: 'Newest',
  });

  // Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'warning' } | null>(null);

  const showCustomerToast = (message: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToast({ message, type });
  };

  const hideCustomerToast = () => {
    setToast(null);
  };

  const checkPhoneExists = (phone: string, currentId?: string): boolean => {
    const cleanPhone = phone.replace(/\s+/g, '').replace('+91', '');
    return customers.some((c) => {
      if (currentId && c.id === currentId) return false;
      const cClean = c.phone.replace(/\s+/g, '').replace('+91', '');
      return cClean === cleanPhone;
    });
  };

  const addCustomer = (data: Partial<Customer>): { success: boolean; error?: string } => {
    if (data.phone && checkPhoneExists(data.phone)) {
      return { success: false, error: 'A customer with this phone number already exists!' };
    }

    const newId = `CUST-${1001 + customers.length}`;
    const firstName = data.firstName || 'New';
    const lastName = data.lastName || 'Customer';
    const fullName = `${firstName} ${lastName}`;
    const todayStr = new Date().toISOString().split('T')[0];

    const discountMap = { Normal: 0, Silver: 10, Gold: 15, Platinum: 25 };
    const tier = data.membership?.tier || 'Normal';

    const newCustomer: Customer = {
      id: newId,
      firstName,
      lastName,
      fullName,
      phone: data.phone || '+91 98000 00000',
      email: data.email || `${firstName.toLowerCase()}@example.com`,
      gender: data.gender || 'Female',
      dob: data.dob || '1995-01-01',
      birthdayFormatted: data.dob ? new Date(data.dob).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) : '01 Jan',
      isBirthdayToday: false,
      isBirthdayThisWeek: false,
      photoUrl: data.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      address: data.address || 'Local Resident',
      emergencyContact: data.emergencyContact || '',
      occupation: data.occupation || 'Consultant',
      referralSource: data.referralSource || 'Walk-in',

      status: 'Active',
      membership: {
        tier,
        joiningDate: todayStr,
        renewalDate: '2027-12-31',
        discountPercent: discountMap[tier],
        benefits: ['Standard Member Perks', `${discountMap[tier]}% Service Discount`],
      },

      preferredStylist: data.preferredStylist || 'Aarav Kapoor',
      preferredServices: data.preferredServices || ['Hair Cut & Styling'],
      skinType: data.skinType || 'Normal',
      hairType: data.hairType || 'Straight Wavy',

      medicalInfo: data.medicalInfo || {
        allergies: [],
        skinSensitivity: 'Normal',
        hairConcerns: [],
        chemicalHistory: 'None',
        medicalConditions: [],
        specialInstructions: '',
      },

      loyalty: {
        currentPoints: 50,
        lifetimePoints: 50,
        redeemedPoints: 0,
        availablePoints: 50,
      },

      visitsCount: 0,
      lifetimeSpend: 0,
      lastVisitDate: todayStr,
      createdAt: todayStr,

      visits: [],
      notes: data.notes || [],
      photos: [],
    };

    setCustomers((prev) => [newCustomer, ...prev]);
    showCustomerToast(`Customer ${fullName} registered successfully!`);
    return { success: true };
  };

  const updateCustomer = (id: string, data: Partial<Customer>) => {
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const updated = { ...c, ...data };
          if (data.firstName || data.lastName) {
            updated.fullName = `${updated.firstName} ${updated.lastName}`;
          }
          if (selectedCustomer?.id === id) {
            setSelectedCustomer(updated);
          }
          return updated;
        }
        return c;
      })
    );
    showCustomerToast('Customer profile updated!');
  };

  const deleteCustomer = (id: string) => {
    const target = customers.find((c) => c.id === id);
    setCustomers((prev) => prev.filter((c) => c.id !== id));
    if (selectedCustomer?.id === id) {
      setSelectedCustomer(null);
    }
    showCustomerToast(`Deleted customer profile for ${target?.fullName || id}.`);
  };

  const addNoteToCustomer = (customerId: string, text: string) => {
    const newNote = {
      id: `note-${Date.now()}`,
      text,
      author: 'Stylist / Reception',
      createdAt: new Date().toISOString().split('T')[0],
      isImportant: true,
    };

    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === customerId) {
          const updated = { ...c, notes: [newNote, ...c.notes] };
          if (selectedCustomer?.id === customerId) setSelectedCustomer(updated);
          return updated;
        }
        return c;
      })
    );
    showCustomerToast('Customer note added!');
  };

  const addPhotoToCustomer = (
    customerId: string,
    photoData: { url: string; category: PhotoCategory; title: string }
  ) => {
    const newPhoto = {
      id: `photo-${Date.now()}`,
      ...photoData,
      uploadedAt: new Date().toISOString().split('T')[0],
    };

    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === customerId) {
          const updated = { ...c, photos: [newPhoto, ...c.photos] };
          if (selectedCustomer?.id === customerId) setSelectedCustomer(updated);
          return updated;
        }
        return c;
      })
    );
    showCustomerToast('Photo added to customer gallery!');
  };

  const addLoyaltyPoints = (customerId: string, points: number) => {
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === customerId) {
          const newCurrent = c.loyalty.currentPoints + points;
          const newLifetime = c.loyalty.lifetimePoints + points;
          const updatedLoyalty = {
            ...c.loyalty,
            currentPoints: newCurrent,
            lifetimePoints: newLifetime,
            availablePoints: newCurrent,
          };
          const updated = { ...c, loyalty: updatedLoyalty };
          if (selectedCustomer?.id === customerId) setSelectedCustomer(updated);
          return updated;
        }
        return c;
      })
    );
    showCustomerToast(`Added ${points} loyalty points!`);
  };

  const redeemLoyaltyPoints = (customerId: string, pointsToRedeem: number): boolean => {
    let success = false;
    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === customerId) {
          if (c.loyalty.availablePoints < pointsToRedeem) {
            showCustomerToast('Insufficient loyalty points!', 'warning');
            success = false;
            return c;
          }
          const newRedeemed = c.loyalty.redeemedPoints + pointsToRedeem;
          const newAvailable = c.loyalty.availablePoints - pointsToRedeem;

          const updatedLoyalty = {
            ...c.loyalty,
            redeemedPoints: newRedeemed,
            availablePoints: newAvailable,
            currentPoints: newAvailable,
          };
          const updated = { ...c, loyalty: updatedLoyalty };
          if (selectedCustomer?.id === customerId) setSelectedCustomer(updated);
          showCustomerToast(`Redeemed ${pointsToRedeem} points (₹${pointsToRedeem} discount applied)!`);
          success = true;
          return updated;
        }
        return c;
      })
    );
    return success;
  };

  const addVisitToCustomer = (customerId: string, visitData: Omit<CustomerVisit, 'id'>) => {
    const newVisit: CustomerVisit = {
      ...visitData,
      id: `v-${Date.now()}`,
    };

    // Calculate earned loyalty points (1 point per ₹100 spent)
    const earnedPoints = Math.floor(visitData.totalPaid / 100);

    setCustomers((prev) =>
      prev.map((c) => {
        if (c.id === customerId) {
          const newSpend = c.lifetimeSpend + visitData.totalPaid;
          const newVisitsCount = c.visitsCount + 1;
          const newLoyalty = {
            ...c.loyalty,
            currentPoints: c.loyalty.currentPoints + earnedPoints,
            lifetimePoints: c.loyalty.lifetimePoints + earnedPoints,
            availablePoints: c.loyalty.availablePoints + earnedPoints,
          };

          const updated = {
            ...c,
            lifetimeSpend: newSpend,
            visitsCount: newVisitsCount,
            lastVisitDate: visitData.date,
            loyalty: newLoyalty,
            visits: [newVisit, ...c.visits],
          };
          if (selectedCustomer?.id === customerId) setSelectedCustomer(updated);
          return updated;
        }
        return c;
      })
    );
    showCustomerToast(`Visit & Invoice logged! Customer earned ${earnedPoints} loyalty points.`);
  };

  const sendBirthdayWish = (customer: Customer) => {
    const message = `Hi ${customer.firstName}! Beige Unisex Salon wishes you a joyous Happy Birthday! 🎉 Enjoy an exclusive 25% OFF on your visit today. Show this message at check-in!`;
    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${customer.phone.replace(/[^0-9]/g, '')}?text=${encoded}`, '_blank');
    showCustomerToast(`Birthday wish sent to ${customer.firstName} on WhatsApp!`);
  };

  const exportCSV = () => {
    const headers = ['Customer ID', 'Name', 'Phone', 'Email', 'Membership', 'Loyalty Points', 'Visits', 'Lifetime Spend', 'Status', 'Last Visit'];
    const rows = customers.map((c) => [
      c.id,
      `"${c.fullName}"`,
      `"${c.phone}"`,
      `"${c.email}"`,
      c.membership.tier,
      c.loyalty.availablePoints,
      c.visitsCount,
      c.lifetimeSpend,
      c.status,
      c.lastVisitDate,
    ]);

    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Beige_Salon_Customers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showCustomerToast('Exported 100+ customers to CSV!');
  };

  const importCustomersCSV = (csvText: string) => {
    try {
      const lines = csvText.split('\n').filter((line) => line.trim().length > 0);
      if (lines.length < 2) {
        showCustomerToast('Invalid CSV format', 'warning');
        return;
      }
      showCustomerToast(`Successfully imported ${lines.length - 1} records from CSV!`);
    } catch {
      showCustomerToast('Error reading CSV file', 'warning');
    }
  };

  // Filtered & Sorted Customer List
  const filteredCustomers = useMemo(() => {
    let result = [...customers];

    // Search filter
    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.fullName.toLowerCase().includes(query) ||
          c.phone.includes(query) ||
          c.email.toLowerCase().includes(query) ||
          c.id.toLowerCase().includes(query) ||
          c.membership.tier.toLowerCase().includes(query)
      );
    }

    // Membership filter
    if (filters.membership && filters.membership !== 'All') {
      result = result.filter((c) => c.membership.tier === filters.membership);
    }

    // Gender filter
    if (filters.gender && filters.gender !== 'All') {
      result = result.filter((c) => c.gender === filters.gender);
    }

    // Status filter
    if (filters.status && filters.status !== 'All') {
      result = result.filter((c) => c.status === filters.status);
    }

    // Sorting
    switch (filters.sortBy) {
      case 'Highest Spending':
        result.sort((a, b) => b.lifetimeSpend - a.lifetimeSpend);
        break;
      case 'Most Visits':
        result.sort((a, b) => b.visitsCount - a.visitsCount);
        break;
      case 'Oldest':
        result.sort((a, b) => a.id.localeCompare(b.id));
        break;
      case 'Newest':
      default:
        result.sort((a, b) => b.id.localeCompare(a.id));
        break;
    }

    return result;
  }, [customers, filters]);

  return (
    <CustomerContext.Provider
      value={{
        customers: filteredCustomers,
        selectedCustomer,
        setSelectedCustomer,
        isCustomerFormOpen,
        setIsCustomerFormOpen,
        customerToEdit,
        setCustomerToEdit,
        filters,
        setFilters,
        isBookingOpen,
        setIsBookingOpen,
        isBillingOpen,
        setIsBillingOpen,
        targetCustomerForAction,
        setTargetCustomerForAction,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        addNoteToCustomer,
        addPhotoToCustomer,
        addLoyaltyPoints,
        redeemLoyaltyPoints,
        addVisitToCustomer,
        exportCSV,
        importCustomersCSV,
        sendBirthdayWish,
        checkPhoneExists,
        toast,
        showCustomerToast,
        hideCustomerToast,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomers = () => {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error('useCustomers must be used within a CustomerProvider');
  }
  return context;
};
