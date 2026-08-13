import React from 'react';
import { Box, CircularProgress } from '@mui/material';
import { EmployeesProvider, useEmployees } from './EmployeesContext';
import { EmployeesPageHeader } from './EmployeesPageHeader';
import { EmployeesSummaryCards } from './EmployeesSummaryCards';
import { EmployeesFilterBar } from './EmployeesFilterBar';
import { StaffDirectoryTab } from './StaffDirectoryTab';
import { ShiftScheduleTab } from './ShiftScheduleTab';
import { RolesManagementTab } from './RolesManagementTab';
import { CommissionPayrollTab } from './CommissionPayrollTab';
import { EmployeeDetailDrawer } from './EmployeeDetailDrawer';
import { AddEditEmployeeModal } from './AddEditEmployeeModal';
import { AssignShiftModal } from './AssignShiftModal';
import { AdjustCommissionModal } from './AdjustCommissionModal';

const EmployeesContent: React.FC = () => {
  const { activeTab, loadingEmployees } = useEmployees();

  if (loadingEmployees) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress sx={{ color: '#6A3F4D' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 1600, mx: 'auto' }}>
      {/* Top Header */}
      <EmployeesPageHeader />

      {/* KPI Cards */}
      <EmployeesSummaryCards />

      {/* Tabs & Search Filter Bar */}
      <EmployeesFilterBar />

      {/* Dynamic Tab Body Content */}
      {activeTab === 0 && <StaffDirectoryTab />}
      {activeTab === 1 && <ShiftScheduleTab />}
      {activeTab === 2 && <RolesManagementTab />}
      {activeTab === 3 && <CommissionPayrollTab />}

      {/* Slide-over Profile Drawer & Action Modals */}
      <EmployeeDetailDrawer />
      <AddEditEmployeeModal />
      <AssignShiftModal />
      <AdjustCommissionModal />
    </Box>
  );
};

export const EmployeesModule: React.FC = () => {
  return (
    <EmployeesProvider>
      <EmployeesContent />
    </EmployeesProvider>
  );
};

export default EmployeesModule;
