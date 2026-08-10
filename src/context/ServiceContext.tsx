import React, { createContext, useContext, useState, useMemo } from 'react';
import { SalonService, ServiceFilterState, ServiceCategory } from '../types/service';
import { INITIAL_SERVICES } from '../services/serviceData';

interface ServiceContextType {
  services: SalonService[];
  filters: ServiceFilterState;
  setFilters: React.Dispatch<React.SetStateAction<ServiceFilterState>>;
  resetFilters: () => void;
  filteredServices: SalonService[];
  
  // Active Modals & Selected items
  selectedService: SalonService | null;
  setSelectedService: (service: SalonService | null) => void;
  
  isServiceFormOpen: boolean;
  setIsServiceFormOpen: (open: boolean) => void;
  serviceToEdit: SalonService | null;
  setServiceToEdit: (service: SalonService | null) => void;

  isCategoryModalOpen: boolean;
  setIsCategoryModalOpen: (open: boolean) => void;

  serviceForBooking: SalonService | null;
  setServiceForBooking: (service: SalonService | null) => void;

  // CRUD Actions
  addService: (data: Omit<SalonService, 'id' | 'totalBookings' | 'totalRevenue' | 'rating'>) => void;
  updateService: (id: string, data: Partial<SalonService>) => void;
  deleteService: (id: string) => void;
  toggleServiceStatus: (id: string) => void;

  // Notifications / Toast
  toast: { message: string; type: 'success' | 'info' | 'warning' | 'error' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  hideToast: () => void;
}

const initialFilterState: ServiceFilterState = {
  searchQuery: '',
  category: 'All',
  gender: 'All',
  status: 'All',
  sortBy: 'Popularity',
  viewMode: 'grid',
};

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

export const ServiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [services, setServices] = useState<SalonService[]>(INITIAL_SERVICES);
  const [filters, setFilters] = useState<ServiceFilterState>(initialFilterState);

  const [selectedService, setSelectedService] = useState<SalonService | null>(null);
  const [isServiceFormOpen, setIsServiceFormOpen] = useState<boolean>(false);
  const [serviceToEdit, setServiceToEdit] = useState<SalonService | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState<boolean>(false);
  const [serviceForBooking, setServiceForBooking] = useState<SalonService | null>(null);

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'warning' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    setToast({ message, type });
  };

  const hideToast = () => {
    setToast(null);
  };

  const resetFilters = () => {
    setFilters(initialFilterState);
  };

  // Filtered & Sorted Services calculation
  const filteredServices = useMemo(() => {
    return services
      .filter((srv) => {
        // Search query filter (matches name, code, category, or description)
        if (filters.searchQuery.trim()) {
          const query = filters.searchQuery.toLowerCase();
          const matchesName = srv.name.toLowerCase().includes(query);
          const matchesCode = srv.code.toLowerCase().includes(query);
          const matchesCategory = srv.category.toLowerCase().includes(query);
          const matchesDesc = srv.description.toLowerCase().includes(query);
          if (!matchesName && !matchesCode && !matchesCategory && !matchesDesc) {
            return false;
          }
        }

        // Category filter
        if (filters.category !== 'All' && srv.category !== filters.category) {
          return false;
        }

        // Gender filter
        if (filters.gender !== 'All' && srv.genderTarget !== filters.gender) {
          return false;
        }

        // Status filter
        if (filters.status !== 'All' && srv.status !== filters.status) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'Popularity') {
          return b.totalBookings - a.totalBookings;
        }
        if (filters.sortBy === 'Price: Low to High') {
          return a.basePrice - b.basePrice;
        }
        if (filters.sortBy === 'Price: High to Low') {
          return b.basePrice - a.basePrice;
        }
        if (filters.sortBy === 'Duration') {
          return a.durationMinutes - b.durationMinutes;
        }
        if (filters.sortBy === 'Name') {
          return a.name.localeCompare(b.name);
        }
        return 0;
      });
  }, [services, filters]);

  // CRUD Implementations
  const addService = (data: Omit<SalonService, 'id' | 'totalBookings' | 'totalRevenue' | 'rating'>) => {
    const newId = `srv-${Date.now().toString().slice(-4)}`;
    const newService: SalonService = {
      ...data,
      id: newId,
      totalBookings: 0,
      totalRevenue: 0,
      rating: 5.0,
      imageUrl:
        data.imageUrl ||
        'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=500',
    };
    setServices((prev) => [newService, ...prev]);
    showToast(`Service "${newService.name}" successfully added to catalog!`, 'success');
  };

  const updateService = (id: string, data: Partial<SalonService>) => {
    setServices((prev) =>
      prev.map((srv) => (srv.id === id ? { ...srv, ...data } : srv))
    );
    if (selectedService?.id === id) {
      setSelectedService((prev) => (prev ? { ...prev, ...data } : null));
    }
    showToast(`Service updated successfully!`, 'success');
  };

  const deleteService = (id: string) => {
    const target = services.find((s) => s.id === id);
    setServices((prev) => prev.filter((s) => s.id !== id));
    if (selectedService?.id === id) {
      setSelectedService(null);
    }
    showToast(`Service "${target?.name || id}" removed from catalog.`, 'warning');
  };

  const toggleServiceStatus = (id: string) => {
    setServices((prev) =>
      prev.map((srv) => {
        if (srv.id === id) {
          const nextStatus = srv.status === 'Active' ? 'Inactive' : 'Active';
          showToast(
            `Service status for "${srv.name}" changed to ${nextStatus}.`,
            nextStatus === 'Active' ? 'success' : 'info'
          );
          return { ...srv, status: nextStatus };
        }
        return srv;
      })
    );
  };

  return (
    <ServiceContext.Provider
      value={{
        services,
        filters,
        setFilters,
        resetFilters,
        filteredServices,
        selectedService,
        setSelectedService,
        isServiceFormOpen,
        setIsServiceFormOpen,
        serviceToEdit,
        setServiceToEdit,
        isCategoryModalOpen,
        setIsCategoryModalOpen,
        serviceForBooking,
        setServiceForBooking,
        addService,
        updateService,
        deleteService,
        toggleServiceStatus,
        toast,
        showToast,
        hideToast,
      }}
    >
      {children}
    </ServiceContext.Provider>
  );
};

export const useServices = () => {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error('useServices must be used within a ServiceProvider');
  }
  return context;
};
