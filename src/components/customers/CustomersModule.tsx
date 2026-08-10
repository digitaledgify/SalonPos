import React from 'react';
import { Box, Grid, Snackbar, Alert } from '@mui/material';
import { CustomerProvider, useCustomers } from '../../context/CustomerContext';
import { PageHeader } from './PageHeader';
import { TopSummaryCards } from './TopSummaryCards';
import { SearchBar } from './SearchBar';
import { Filters } from './Filters';
import { CustomerTable } from './CustomerTable';
import { CustomerForm } from './CustomerForm';
import { CustomerProfile } from './CustomerProfile';
import { BirthdayWidget } from './BirthdayWidget';
import { QuickBookingModal } from './QuickBookingModal';
import { QuickBillingModal } from './QuickBillingModal';

const CustomersContent: React.FC = () => {
  const { toast, hideCustomerToast } = useCustomers();

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 1600, mx: 'auto' }}>
      {/* Header */}
      <PageHeader />

      {/* KPI Cards */}
      <TopSummaryCards />

      {/* Main Grid Layout: Left Table + Right Widgets */}
      <Grid container spacing={3}>
        {/* Left Column: Search, Filters, Table */}
        <Grid size={{ xs: 12, lg: 8.8, xl: 9 }}>
          <SearchBar />
          <Filters />
          <CustomerTable />
        </Grid>

        {/* Right Column: Birthday Widget & Quick Shortcuts */}
        <Grid size={{ xs: 12, lg: 3.2, xl: 3 }}>
          <Box sx={{ position: { lg: 'sticky' }, top: 24, display: 'flex', flexDirection: 'column', gap: 3 }}>
            <BirthdayWidget />
          </Box>
        </Grid>
      </Grid>

      {/* Right Drawer Form */}
      <CustomerForm />

      {/* Profile Detail Drawer */}
      <CustomerProfile />

      {/* Action Modals */}
      <QuickBookingModal />
      <QuickBillingModal />

      {/* Toast Notification */}
      <Snackbar
        open={Boolean(toast)}
        autoHideDuration={4000}
        onClose={hideCustomerToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={hideCustomerToast} severity={toast?.type || 'success'} variant="filled" sx={{ width: '100%', fontWeight: 700 }}>
          {toast?.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export const CustomersModule: React.FC = () => {
  return (
    <CustomerProvider>
      <CustomersContent />
    </CustomerProvider>
  );
};
