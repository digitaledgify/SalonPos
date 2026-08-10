import React, { useState } from 'react';
import { Box, Container } from '@mui/material';
import { useDashboard } from '../../context/DashboardContext';
import { AppointmentPageHeader } from './AppointmentPageHeader';
import { AppointmentSummaryCards } from './AppointmentSummaryCards';
import { AppointmentFilterBar } from './AppointmentFilterBar';
import { AppointmentTimelineGrid } from './AppointmentTimelineGrid';
import { AppointmentTable } from './AppointmentTable';
import { AppointmentDetailDrawer } from './AppointmentDetailDrawer';
import { QuickWalkInModal } from './QuickWalkInModal';
import { NewAppointmentModal } from '../NewAppointmentModal';
import { Appointment } from '../../types';

export const AppointmentsModule: React.FC = () => {
  const { appointments } = useDashboard();

  // Local View States
  const [selectedDate, setSelectedDate] = useState('Today');
  const [viewMode, setViewMode] = useState<'timeline' | 'table'>('timeline');
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedStylist, setSelectedStylist] = useState('All');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('All Slots');

  // Interactive Drawers & Modals
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isWalkInOpen, setIsWalkInOpen] = useState(false);

  // Clear Filter Handler
  const handleClearFilters = () => {
    setSearch('');
    setSelectedStatus('All');
    setSelectedStylist('All');
    setSelectedTimeSlot('All Slots');
  };

  // Filter Logic
  const filteredAppointments = appointments.filter((apt) => {
    // 1. Search Query Filter (Name, Phone, Service)
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = apt.customerName.toLowerCase().includes(q);
      const matchPhone = apt.customerPhone.includes(q);
      const matchService = apt.service.toLowerCase().includes(q);
      if (!matchName && !matchPhone && !matchService) return false;
    }

    // 2. Status Filter
    if (selectedStatus !== 'All' && apt.status !== selectedStatus) {
      return false;
    }

    // 3. Stylist Filter
    if (selectedStylist !== 'All' && apt.stylistName !== selectedStylist) {
      return false;
    }

    // 4. Time Slot Filter
    if (selectedTimeSlot !== 'All Slots') {
      if (selectedTimeSlot === '10:00 AM - 12:00 PM') {
        if (!apt.time.includes('10:') && !apt.time.includes('11:')) return false;
      } else if (selectedTimeSlot === '12:00 PM - 03:00 PM') {
        if (!apt.time.includes('12:') && !apt.time.includes('01:') && !apt.time.includes('02:'))
          return false;
      } else if (selectedTimeSlot === '03:00 PM - 06:00 PM') {
        if (
          !apt.time.includes('03:') &&
          !apt.time.includes('04:') &&
          !apt.time.includes('05:')
        )
          return false;
      } else if (selectedTimeSlot === '06:00 PM - 09:00 PM') {
        if (
          !apt.time.includes('06:') &&
          !apt.time.includes('07:') &&
          !apt.time.includes('08:')
        )
          return false;
      }
    }

    return true;
  });

  return (
    <Container maxWidth="xl" sx={{ py: 3, px: { xs: 2, sm: 3 } }}>
      {/* 1. Header with Date Switcher & Layout Toggle */}
      <AppointmentPageHeader
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onOpenWalkIn={() => setIsWalkInOpen(true)}
      />

      {/* 2. Key Metrics Summary Cards */}
      <AppointmentSummaryCards />

      {/* 3. Search & Multi-Criteria Filter Bar */}
      <AppointmentFilterBar
        search={search}
        setSearch={setSearch}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        selectedStylist={selectedStylist}
        setSelectedStylist={setSelectedStylist}
        selectedTimeSlot={selectedTimeSlot}
        setSelectedTimeSlot={setSelectedTimeSlot}
        onClearFilters={handleClearFilters}
      />

      {/* 4. Active Schedule View (Timeline Matrix OR Table List) */}
      {viewMode === 'timeline' ? (
        <AppointmentTimelineGrid
          appointments={filteredAppointments}
          onSelectAppointment={(apt) => setSelectedAppointment(apt)}
        />
      ) : (
        <AppointmentTable
          appointments={filteredAppointments}
          onSelectAppointment={(apt) => setSelectedAppointment(apt)}
        />
      )}

      {/* 5. Appointment Detail Slide-Over Drawer */}
      <AppointmentDetailDrawer
        appointment={selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
      />

      {/* 6. Quick Walk-In Check-In Modal */}
      <QuickWalkInModal open={isWalkInOpen} onClose={() => setIsWalkInOpen(false)} />

      {/* 7. New Appointment Booking Modal */}
      <NewAppointmentModal />
    </Container>
  );
};
