import React, { createContext, useContext, useState } from 'react';
import { ReportTimeRange } from '../../types/report';
import { useDashboard } from '../../context/DashboardContext';

interface ReportsContextType {
  timeRange: ReportTimeRange;
  setTimeRange: (range: ReportTimeRange) => void;
  activeTab: number;
  setActiveTab: (tab: number) => void;
  exportReportPDF: () => void;
  exportReportExcel: () => void;
}

const ReportsContext = createContext<ReportsContextType | undefined>(undefined);

export const ReportsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useDashboard();
  const [timeRange, setTimeRange] = useState<ReportTimeRange>('This Month');
  const [activeTab, setActiveTab] = useState(0);

  const exportReportPDF = () => {
    showToast(`Exporting comprehensive salon financial & analytics report (PDF format) for ${timeRange}...`);
  };

  const exportReportExcel = () => {
    showToast(`Exporting detailed raw data audit workbook (Excel format) for ${timeRange}...`);
  };

  return (
    <ReportsContext.Provider
      value={{
        timeRange,
        setTimeRange,
        activeTab,
        setActiveTab,
        exportReportPDF,
        exportReportExcel,
      }}
    >
      {children}
    </ReportsContext.Provider>
  );
};

export const useReports = () => {
  const context = useContext(ReportsContext);
  if (!context) {
    throw new Error('useReports must be used within a ReportsProvider');
  }
  return context;
};
