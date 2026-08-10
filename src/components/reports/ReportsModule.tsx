import React from 'react';
import { Box } from '@mui/material';
import { ReportsProvider, useReports } from './ReportsContext';
import { ReportsPageHeader } from './ReportsPageHeader';
import { ReportsSummaryCards } from './ReportsSummaryCards';
import { RevenueExpenseChart } from './RevenueExpenseChart';
import { DepartmentBreakdownChart } from './DepartmentBreakdownChart';
import { TopServicesReportTable } from './TopServicesReportTable';
import { StaffPerformanceReportTable } from './StaffPerformanceReportTable';
import { GSTTaxSummaryCard } from './GSTTaxSummaryCard';

const ReportsContent: React.FC = () => {
  const { activeTab } = useReports();

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 1600, mx: 'auto' }}>
      <ReportsPageHeader />
      <ReportsSummaryCards />

      {activeTab === 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <RevenueExpenseChart />
          <DepartmentBreakdownChart />
        </Box>
      )}

      {activeTab === 1 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <TopServicesReportTable />
          <DepartmentBreakdownChart />
        </Box>
      )}

      {activeTab === 2 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <StaffPerformanceReportTable />
        </Box>
      )}

      {activeTab === 3 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <GSTTaxSummaryCard />
        </Box>
      )}
    </Box>
  );
};

export const ReportsModule: React.FC = () => {
  return (
    <ReportsProvider>
      <ReportsContent />
    </ReportsProvider>
  );
};

export default ReportsModule;
