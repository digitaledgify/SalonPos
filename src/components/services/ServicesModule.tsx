import React from 'react';
import { Box, Grid, Paper, Typography, Snackbar, Alert } from '@mui/material';
import { ServiceProvider, useServices } from '../../context/ServiceContext';
import { ServicePageHeader } from './ServicePageHeader';
import { ServiceSummaryCards } from './ServiceSummaryCards';
import { ServiceFilterBar } from './ServiceFilterBar';
import { ServiceGridCard } from './ServiceGridCard';
import { ServiceTable } from './ServiceTable';
import { ServiceDetailModal } from './ServiceDetailModal';
import { ServiceFormModal } from './ServiceFormModal';
import { ServiceCategoryModal } from './ServiceCategoryModal';
import { QuickServiceBookingModal } from './QuickServiceBookingModal';

const ServicesContent: React.FC = () => {
  const { filteredServices, filters, toast, hideToast } = useServices();

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 1600, mx: 'auto' }}>
      {/* Page Header */}
      <ServicePageHeader />

      {/* Top Metrics Cards */}
      <ServiceSummaryCards />

      {/* Filter & View Switcher Bar */}
      <ServiceFilterBar />

      {/* Main Content View (Grid or Table) */}
      {filters.viewMode === 'grid' ? (
        filteredServices.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 6,
              borderRadius: '16px',
              bgcolor: '#FFFFFF',
              border: '1px solid #E8DFD5',
              textAlign: 'center',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#2D1F24', mb: 1 }}>
              No Services Found
            </Typography>
            <Typography variant="body2" sx={{ color: '#6E5C63' }}>
              No salon treatments match your selected filters. Try clearing your search query or selecting another category.
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {filteredServices.map((service) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={service.id}>
                <ServiceGridCard service={service} />
              </Grid>
            ))}
          </Grid>
        )
      ) : (
        <ServiceTable />
      )}

      {/* Slide-over & Modal Overlays */}
      <ServiceDetailModal />
      <ServiceFormModal />
      <ServiceCategoryModal />
      <QuickServiceBookingModal />

      {/* Toast Notification */}
      <Snackbar
        open={Boolean(toast)}
        autoHideDuration={4000}
        onClose={hideToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={hideToast} severity={toast?.type || 'success'} variant="filled" sx={{ width: '100%', fontWeight: 700 }}>
          {toast?.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export const ServicesModule: React.FC = () => {
  return (
    <ServiceProvider>
      <ServicesContent />
    </ServiceProvider>
  );
};
