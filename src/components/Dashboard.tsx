import React from 'react';
import { Box, Typography, Container, Alert, Snackbar, Chip } from '@mui/material';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import { useDashboard } from '../context/DashboardContext';
import { KPICard, KPICardProps } from './KPICard';
import { QuickActions } from './QuickActions';
import { SalesChart } from './SalesChart';
import { PaymentChart } from './PaymentChart';
import { TopServicesChart } from './TopServicesChart';
import { RecentTransactions } from './RecentTransactions';
import { AppointmentCard } from './AppointmentCard';
import { LowStockCard } from './LowStockCard';
import { TopStylists } from './TopStylists';
import { BirthdayWidget } from './BirthdayWidget';
import { Notifications } from './Notifications';
import { NewAppointmentModal } from './NewAppointmentModal';
import { NewBillModal } from './NewBillModal';
import { NewCustomerModal } from './NewCustomerModal';
import { AddExpenseModal } from './AddExpenseModal';
import { InvoiceDetailModal } from './InvoiceDetailModal';
import { NewOutletModal } from './NewOutletModal';
import { formatCurrency } from '../utils/formatters';

export const Dashboard: React.FC = () => {
  const {
    role,
    dailySales,
    appointments,
    inventory,
    toastMessage,
    hideToast,
    activeOutlet,
  } = useDashboard();

  // Compute KPI metrics dynamically from real data (no fake fallbacks)
  const todaySalesAmount = dailySales[dailySales.length - 1]?.sales || 0;
  const todayAppointmentsCount = appointments.length;
  const walkInsCount = 0;
  const completedCount = appointments.filter((a) => a.status === 'Completed').length;
  const pendingCount = appointments.filter((a) => a.status === 'Booked' || a.status === 'Checked In').length;
  const lowStockCount = inventory.filter((i) => i.status !== 'Optimal').length;

  const kpis: KPICardProps[] = [
    {
      id: 'kpi-1',
      title: "Today's Sales",
      value: formatCurrency(todaySalesAmount),
      comparison: '',
      isPositive: true,
      description: '',
      type: 'sales',
    },
    {
      id: 'kpi-2',
      title: "Today's Appointments",
      value: todayAppointmentsCount,
      comparison: '',
      isPositive: true,
      description: '',
      type: 'appointments',
    },
    {
      id: 'kpi-3',
      title: 'Walk-ins',
      value: walkInsCount,
      comparison: '',
      isPositive: true,
      description: '',
      type: 'walkins',
    },
    {
      id: 'kpi-4',
      title: 'Completed Services',
      value: completedCount,
      comparison: '',
      isPositive: true,
      description: '',
      type: 'completed',
    },
    {
      id: 'kpi-5',
      title: 'Pending Appointments',
      value: pendingCount,
      comparison: '',
      isPositive: false,
      description: '',
      type: 'pending',
    },
    {
      id: 'kpi-6',
      title: 'Low Stock Items',
      value: lowStockCount,
      comparison: '',
      isPositive: false,
      description: '',
      type: 'stock',
    },
  ];

  // Role based filtering of KPI cards
  const visibleKPIs = kpis.filter((kpi) => {
    if (role === 'Admin') return true;
    if (role === 'Reception') return kpi.type !== 'sales' || true;
    if (role === 'Stylist') return kpi.type === 'appointments' || kpi.type === 'completed' || kpi.type === 'pending';
    return true;
  });

  return (
    <Box sx={{ pb: 6, pt: 2, bgcolor: '#F8F4EE', minHeight: '100vh' }}>
      <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        {/* Banner Header for Current Role View */}
        <Box
          sx={{
            mb: 3,
            p: 2.5,
            borderRadius: '16px',
            bgcolor: '#FFFFFF',
            border: '1px solid #E8DFD5',
            boxShadow: '0 4px 20px rgba(106, 63, 77, 0.04)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
              <Typography variant="h5" sx={{ fontFamily: '"Playfair Display", serif', fontWeight: 700, color: '#2D1F24', fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
                Salon POS • {activeOutlet.name}
              </Typography>
              <Chip
                icon={<SupervisorAccountIcon sx={{ fontSize: '16px !important' }} />}
                label={`${role} Mode`}
                color="primary"
                sx={{ fontWeight: 700, fontSize: '0.78rem' }}
              />
            </Box>
            <Typography variant="body2" sx={{ fontFamily: '"Lato", "Inter", sans-serif', color: '#6E5C63' }}>
              Real-time operational metrics for {activeOutlet.name} ({activeOutlet.type} Outlet • Code {activeOutlet.code})
            </Typography>
          </Box>
        </Box>

        {/* Row 1: KPI Cards Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(6, 1fr)',
            },
            gap: 2.5,
            mb: 3,
          }}
        >
          {visibleKPIs.map((kpi) => (
            <KPICard key={kpi.id} {...kpi} />
          ))}
        </Box>

        {/* Row 2: Quick Touch Actions */}
        <Box sx={{ mb: 3 }}>
          <QuickActions />
        </Box>

        {/* Row 3: Sales Chart & Payment Breakdown (Visible for Admin and Reception) */}
        {(role === 'Admin' || role === 'Reception') && (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
              gap: 2.5,
              mb: 3,
            }}
          >
            <SalesChart />
            <PaymentChart />
          </Box>
        )}

        {/* Row 4: Today's Appointments & Low Stock Alert */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: '7fr 5fr' },
            gap: 2.5,
            mb: 3,
          }}
        >
          <AppointmentCard />
          <LowStockCard />
        </Box>

        {/* Row 5: Top Requested Services & Top Stylists Leaderboard */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 2.5,
            mb: 3,
          }}
        >
          <TopServicesChart />
          <TopStylists />
        </Box>

        {/* Row 6: Recent Transactions Table */}
        <Box sx={{ mb: 3 }}>
          <RecentTransactions />
        </Box>

        {/* Row 7: Customer Birthdays & System Notifications */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 2.5,
          }}
        >
          <BirthdayWidget />
          <Notifications />
        </Box>
      </Container>

      {/* Quick Actions & Invoice Modals */}
      <NewAppointmentModal />
      <NewBillModal />
      <NewCustomerModal />
      <AddExpenseModal />
      <InvoiceDetailModal />
      <NewOutletModal />

      {/* Global Toast Notification Snackbar */}
      <Snackbar
        open={Boolean(toastMessage)}
        autoHideDuration={3500}
        onClose={hideToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={hideToast} severity="success" variant="filled" sx={{ borderRadius: '12px', fontWeight: 600 }}>
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};
