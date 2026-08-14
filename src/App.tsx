import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box, ThemeProvider, CssBaseline, Snackbar, Alert, CircularProgress, Button } from '@mui/material';
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
import { SuperAdminDashboard } from './components/auth/SuperAdminDashboard';

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

function BlockedSalonScreen() {
  const { salon, signOut } = useAuth();
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F8F4EE', display: 'grid', placeItems: 'center', p: 3 }}>
      <Box sx={{ width: '100%', maxWidth: 520, bgcolor: '#fff', border: '1px solid #E8DFD5', borderRadius: '24px', p: { xs: 3, md: 5 }, textAlign: 'center', boxShadow: '0 16px 40px rgba(45,31,36,0.08)' }}>
        <Box sx={{ width: 64, height: 64, borderRadius: '50%', bgcolor: '#FDECEC', color: '#B3261E', display: 'grid', placeItems: 'center', mx: 'auto', mb: 2, fontSize: 30, fontWeight: 900 }}>!</Box>
        <Box component="h1" sx={{ m: 0, color: '#2D1F24', fontSize: { xs: 24, md: 30 }, fontWeight: 900 }}>Salon Account Inactive</Box>
        <Box sx={{ mt: 1, color: '#6E5C63', lineHeight: 1.7 }}>
          {salon?.status === 'Pending'
            ? 'This salon account is still pending activation. Please contact the Salon POS administrator.'
            : 'This salon account has been deactivated. Please contact the Salon POS administrator to reactivate access.'}
        </Box>
        {salon?.name && <Box sx={{ mt: 2, fontWeight: 800, color: '#6A3F4D' }}>{salon.name}</Box>}
        <Button variant="contained" onClick={() => void signOut()} sx={{ mt: 3, bgcolor: '#6A3F4D', '&:hover': { bgcolor: '#5A3541' }, borderRadius: '12px', textTransform: 'none', fontWeight: 900 }}>
          Sign Out
        </Button>
      </Box>
    </Box>
  );
}

function SignedInOrLogin() {
  const { session, profile, salon, loading } = useAuth();
  const superAdminEmail = (import.meta.env.VITE_SUPER_ADMIN_EMAIL || '').trim().toLowerCase();
  const isSuperAdmin = Boolean(session?.user?.email) && session!.user.email!.toLowerCase() === superAdminEmail;

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress sx={{ color: '#6A3F4D' }} />
      </Box>
    );
  }

  if (isSuperAdmin) {
    return <SuperAdminDashboard />;
  }

  if (!session || !profile) {
    // Public route — customers only ever see Sign In here, never signup.
    return <AuthScreen />;
  }

  if (salon && salon.status !== 'Active') {
    return <BlockedSalonScreen />;
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
        <Routes>
          <Route path="/super-admin" element={<SignedInOrLogin />} />
          <Route path="*" element={<SignedInOrLogin />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

