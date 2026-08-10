import { AppointmentStatus, StockStatus, TransactionStatus } from '../types';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const getTransactionStatusColor = (status: TransactionStatus): {
  bg: string;
  text: string;
  border: string;
} => {
  switch (status) {
    case 'Paid':
      return { bg: '#EBF7EE', text: '#1E7E34', border: '#C3E6CB' };
    case 'Pending':
      return { bg: '#FFF8E6', text: '#B7791F', border: '#FFE8B6' };
    case 'Refunded':
      return { bg: '#FDE8E8', text: '#9B1C1C', border: '#F8B4B4' };
    default:
      return { bg: '#F3F4F6', text: '#374151', border: '#E5E7EB' };
  }
};

export const getAppointmentStatusColor = (status: AppointmentStatus): {
  bg: string;
  text: string;
  border: string;
} => {
  switch (status) {
    case 'Booked':
      return { bg: '#EBF5FF', text: '#1E429F', border: '#C3DDFD' };
    case 'Checked In':
      return { bg: '#FEF3C7', text: '#92400E', border: '#FDE68A' };
    case 'Completed':
      return { bg: '#E1F8EB', text: '#0E623B', border: '#A7F3D0' };
    case 'Cancelled':
      return { bg: '#FEE2E2', text: '#991B1B', border: '#FECACA' };
    default:
      return { bg: '#F3F4F6', text: '#374151', border: '#E5E7EB' };
  }
};

export const getStockStatusColor = (status: StockStatus): {
  bg: string;
  text: string;
  border: string;
} => {
  switch (status) {
    case 'Optimal':
      return { bg: '#EBF7EE', text: '#1E7E34', border: '#C3E6CB' };
    case 'Low':
      return { bg: '#FFF3C4', text: '#8C5200', border: '#FFE082' };
    case 'Critical':
      return { bg: '#FDE8E8', text: '#9B1C1C', border: '#F8B4B4' };
    default:
      return { bg: '#F3F4F6', text: '#374151', border: '#E5E7EB' };
  }
};

export const getCurrentFormattedDate = (): string => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  return new Date().toLocaleDateString('en-US', options);
};
