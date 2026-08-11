import React from 'react';
import { Box, ThemeProvider, CssBaseline, Snackbar, Alert, CircularProgress } from '@mui/material';
import { salonTheme } from './theme/salonTheme';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DashboardProvider, useDashboard } from './context/DashboardContext';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { Dashboard } from './components/Dashboard';
import { CustomersModule } from './components/customers/CustomersModule';
import { ServicesModule } from './components/services/ServicesModule';
import { AppointmentsModule } from './components/appointments/AppointmentsModule';
import { BillingModule } from './components/billing/BillingModule';
import { InventoryModule } from './components/inventory/InventoryModule';
import { EmployeesModule } from './components/employees/EmployeesModule';
import { ExpensesModule } from './components/expenses/ExpensesModule';
import { ReportsModule } from './components/reports/ReportsModule';
import { SettingsModule } from './components/settings/SettingsModule';
import { AuthScreen } from './components/auth/AuthScreen';

function MainAppContent() {
  const { activeNavItem, toastMessage, hideToast } = useDashboard();

  let content = <Dashboard />;

  if (activeNavItem === 'Expenses') {
    content = <ExpensesModule />;
  } else if (activeNavItem === 'Reports') {
    content = <ReportsModule />;
  } else if (activeNavItem === 'Settings') {
    content = <SettingsModule />;
  } else if (activeNavItem === 'Employees') {
    content = <EmployeesModule />;
  } else if (activeNavItem === 'Inventory') {
    content = <InventoryModule />;
  } else if (activeNavItem === 'Billing') {
    content = <BillingModule />;
  } else if (activeNavItem === 'Appointments') {
    content = <AppointmentsModule />;
  } else if (activeNavItem === 'Services') {
    content = <ServicesModule />;
  } else if (activeNavItem === 'Customers') {
    content = <CustomersModule />;
  }

  return (
    <Box component="main" sx={{ flexGrow: 1, overflowX: 'hidden' }}>
      {content}

      {/* Global Toast Notification */}
      <Snackbar
        open={Boolean(toastMessage)}
        autoHideDuration={4000}
        onClose={hideToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={hideToast}
          severity="info"
          variant="filled"
          sx={{
            bgcolor: '#6A3F4D',
            color: '#FFFFFF',
            fontWeight: 700,
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(106, 63, 77, 0.25)',
          }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

function AppShell() {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F8F4EE' }}>
      {/* Left Navigation Sidebar */}
      <Sidebar />

      {/* Main App Content Area */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Bar with Search, Role, and Profile */}
        <Topbar />

        {/* Main Module Container */}
        <MainAppContent />
      </Box>
    </Box>
  );
}

function AuthGate() {
  const { session, profile, loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress sx={{ color: '#6A3F4D' }} />
      </Box>
    );
  }

  if (!session || !profile) {
    return <AuthScreen />;
  }

  return (
    <DashboardProvider>
      <AppShell />
    </DashboardProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={salonTheme}>
      <CssBaseline />
      <AuthProvider>
        <AuthGate />
      </AuthProvider>
    </ThemeProvider>
  );
}

