export type ServiceCategory =
  | 'Hair Care & Cut'
  | 'Skin & Facials'
  | 'Nails & Beauty'
  | 'Spa & Relaxation'
  | 'Beard & Grooming'
  | 'Makeup & Bridal'
  | 'Combo Packages';

export type ServiceGender = 'Unisex' | 'Female' | 'Male';

export type ServiceStatus = 'Active' | 'Inactive' | 'Seasonal';

export interface ServiceConsumable {
  itemId?: string;
  itemName: string;
  qtyPerSession: string;
}

export interface SalonService {
  id: string;
  code: string;
  name: string;
  category: ServiceCategory;
  genderTarget: ServiceGender;
  basePrice: number;
  durationMinutes: number;
  memberDiscountPercent: number; // e.g. 15 for 15% off
  description: string;
  requiredConsumables: ServiceConsumable[];
  recommendedStylistRole: string;
  status: ServiceStatus;
  isPopular: boolean;
  totalBookings: number;
  totalRevenue: number;
  rating: number;
  imageUrl?: string;
}

export interface ServiceFilterState {
  searchQuery: string;
  category: string; // 'All' or ServiceCategory
  gender: 'All' | ServiceGender;
  status: 'All' | ServiceStatus;
  sortBy: 'Popularity' | 'Price: Low to High' | 'Price: High to Low' | 'Duration' | 'Name';
  viewMode: 'grid' | 'table';
}

export interface ServiceCategorySummary {
  category: ServiceCategory;
  count: number;
  iconName: string;
  avgPrice: number;
}
