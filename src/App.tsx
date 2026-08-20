import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import {
  Box,
  ThemeProvider,
  CssBaseline,
  Snackbar,
  Alert,
  CircularProgress,
  Button,
} from '@mui/material';

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
import {
  SuperAdminSalons,
  SuperAdminManageSalon,
} from './components/auth/SuperAdminSalons';

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

      <Snackbar
        open={Boolean(toastMessage)}
        autoHideDuration={4000}
        onClose={hideToast}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
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
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        bgcolor: '#F8F4EE',
      }}
    >
      <Sidebar />

      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
        }}
      >
        <Topbar />
        <MainAppContent />
      </Box>
    </Box>
  );
}

function BlockedSalonScreen() {
  const { salon, signOut } = useAuth();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#F8F4EE',
        display: 'grid',
        placeItems: 'center',
        p: 3,
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 520,
          bgcolor: '#fff',
          border: '1px solid #E8DFD5',
          borderRadius: '24px',
          p: { xs: 3, md: 5 },
          textAlign: 'center',
          boxShadow: '0 16px 40px rgba(45,31,36,0.08)',
        }}
      >
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            bgcolor: '#FDECEC',
            color: '#B3261E',
            display: 'grid',
            placeItems: 'center',
            mx: 'auto',
            mb: 2,
            fontSize: 30,
            fontWeight: 900,
          }}
        >
          !
        </Box>

        <Box
          component="h1"
          sx={{
            m: 0,
            color: '#2D1F24',
            fontSize: { xs: 24, md: 30 },
            fontWeight: 900,
          }}
        >
          Salon Account Inactive
        </Box>

        <Box
          sx={{
            mt: 1,
            color: '#6E5C63',
            lineHeight: 1.7,
          }}
        >
          {salon?.status === 'Pending'
            ? 'This salon account is still pending activation. Please contact the Salon POS administrator.'
            : 'This salon account has been deactivated. Please contact the Salon POS administrator to reactivate access.'}
        </Box>

        {salon?.name && (
          <Box
            sx={{
              mt: 2,
              fontWeight: 800,
              color: '#6A3F4D',
            }}
          >
            {salon.name}
          </Box>
        )}

        <Button
          variant="contained"
          onClick={() => void signOut()}
          sx={{
            mt: 3,
            bgcolor: '#6A3F4D',
            '&:hover': {
              bgcolor: '#5A3541',
            },
            borderRadius: '12px',
            textTransform: 'none',
            fontWeight: 900,
          }}
        >
          Sign Out
        </Button>
      </Box>
    </Box>
  );
}

/*
 * Super Admin route guard.
 *
 * This handles all routes under:
 * /super-admin/*
 */
function SuperAdminRoutes() {
  const { session, loading } = useAuth();
  const location = useLocation();

  const superAdminEmail = (
    import.meta.env.VITE_SUPER_ADMIN_EMAIL || ''
  )
    .trim()
    .toLowerCase();

  const isSuperAdmin =
    Boolean(session?.user?.email) &&
    session!.user.email!.toLowerCase() === superAdminEmail;

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress sx={{ color: '#6A3F4D' }} />
      </Box>
    );
  }

  if (!session) {
    return <AuthScreen />;
  }

  if (!isSuperAdmin) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          bgcolor: '#F8F4EE',
          p: 3,
        }}
      >
        <Alert severity="error">
          This page is restricted to the Super Admin account.
        </Alert>
      </Box>
    );
  }

  return (
    <Routes>
      <Route index element={<SuperAdminDashboard />} />

      <Route
        path="salons"
        element={
          <SuperAdminSalons
            onBack={() => {
              window.history.back();
            }}
            onManage={(salonId) => {
              window.location.href = `/super-admin/salons/${salonId}`;
            }}
          />
        }
      />

      <Route
        path="salons/:salonId"
        element={<SuperAdminManageSalonRoute />}
      />

      <Route
        path="*"
        element={
          <Navigate
            to="/super-admin"
            replace
            state={{ from: location.pathname }}
          />
        }
      />
    </Routes>
  );
}

/*
 * Reads salonId from the URL and passes it to the existing
 * SuperAdminManageSalon component.
 */
function SuperAdminManageSalonRoute() {
  const location = useLocation();

  const salonId = location.pathname.split('/').filter(Boolean).pop();

  if (!salonId) {
    return <Navigate to="/super-admin/salons" replace />;
  }

  return (
    <SuperAdminManageSalon
      salonId={salonId}
      onBack={() => {
        window.location.href = '/super-admin/salons';
      }}
      onSaved={() => undefined}
    />
  );
}

function SignedInOrLogin() {
  const { session, profile, salon, loading } = useAuth();

  const superAdminEmail = (
    import.meta.env.VITE_SUPER_ADMIN_EMAIL || ''
  )
    .trim()
    .toLowerCase();

  const isSuperAdmin =
    Boolean(session?.user?.email) &&
    session!.user.email!.toLowerCase() === superAdminEmail;

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress sx={{ color: '#6A3F4D' }} />
      </Box>
    );
  }

  /*
   * Super Admin is handled separately by /super-admin/*
   */
  if (isSuperAdmin) {
    return <Navigate to="/super-admin" replace />;
  }

  if (!session || !profile) {
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
          {/* Super Admin section */}
          <Route
            path="/super-admin/*"
            element={<SuperAdminRoutes />}
          />

          {/* Normal Salon POS application */}
          <Route
            path="*"
            element={<SignedInOrLogin />}
          />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}
