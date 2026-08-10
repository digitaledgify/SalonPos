export type MembershipTier = 'Normal' | 'Silver' | 'Gold' | 'Platinum';
export type CustomerStatus = 'Active' | 'Inactive' | 'VIP' | 'Blocked';
export type Gender = 'Female' | 'Male' | 'Non-Binary' | 'Other';
export type PhotoCategory = 'Profile' | 'Hair' | 'Skin' | 'Before' | 'After';

export interface CustomerPhoto {
  id: string;
  url: string;
  category: PhotoCategory;
  title: string;
  uploadedAt: string;
}

export interface CustomerNote {
  id: string;
  text: string;
  author: string;
  createdAt: string;
  isImportant?: boolean;
}

export interface CustomerMedicalHistory {
  allergies: string[];
  skinSensitivity: string;
  hairConcerns: string[];
  chemicalHistory: string;
  medicalConditions: string[];
  specialInstructions: string;
}

export interface CustomerVisit {
  id: string;
  invoiceNo: string;
  date: string;
  stylistName: string;
  services: string[];
  amount: number;
  discount: number;
  gst: number;
  totalPaid: number;
  paymentMethod: 'Cash' | 'UPI' | 'Card' | 'Split';
  status: 'Completed' | 'Refunded' | 'Pending';
  notes?: string;
}

export interface CustomerLoyalty {
  currentPoints: number;
  lifetimePoints: number;
  redeemedPoints: number;
  availablePoints: number;
}

export interface CustomerMembership {
  tier: MembershipTier;
  joiningDate: string;
  renewalDate: string;
  discountPercent: number;
  benefits: string[];
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone: string;
  email: string;
  gender: Gender;
  dob: string; // YYYY-MM-DD
  birthdayFormatted: string; // e.g. "14 Aug"
  isBirthdayToday?: boolean;
  isBirthdayThisWeek?: boolean;
  photoUrl: string;
  address: string;
  emergencyContact: string;
  occupation: string;
  referralSource: string;

  // Membership & Status
  status: CustomerStatus;
  membership: CustomerMembership;

  // Preferences & Health
  preferredStylist: string;
  preferredServices: string[];
  skinType: string;
  hairType: string;
  medicalInfo: CustomerMedicalHistory;

  // Stats
  loyalty: CustomerLoyalty;
  visitsCount: number;
  lifetimeSpend: number;
  lastVisitDate: string;
  createdAt: string;

  // Details
  visits: CustomerVisit[];
  notes: CustomerNote[];
  photos: CustomerPhoto[];
}

export interface CustomerFilterState {
  searchQuery: string;
  membership: 'All' | MembershipTier;
  sortBy: 'Newest' | 'Oldest' | 'Highest Spending' | 'Most Visits';
  gender?: string;
  status?: string;
}
