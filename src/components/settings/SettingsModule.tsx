import React from 'react';
import { Box } from '@mui/material';
import { SettingsProvider, useSettings } from './SettingsContext';
import { SettingsPageHeader } from './SettingsPageHeader';
import { SalonProfileTab } from './SalonProfileTab';
import { BusinessHoursTab } from './BusinessHoursTab';
import { BillingTaxTab } from './BillingTaxTab';
import { NotificationsTab } from './NotificationsTab';
import { BackupResetTab } from './BackupResetTab';
import { StaffAccessTab } from './StaffAccessTab';

const SettingsContent: React.FC = () => {
  const { activeTab } = useSettings();

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 1400, mx: 'auto' }}>
      <SettingsPageHeader />

      {activeTab === 0 && <SalonProfileTab />}
      {activeTab === 1 && <BusinessHoursTab />}
      {activeTab === 2 && <BillingTaxTab />}
      {activeTab === 3 && <NotificationsTab />}
      {activeTab === 4 && <StaffAccessTab />}
      {activeTab === 5 && <BackupResetTab />}
    </Box>
  );
};

export const SettingsModule: React.FC = () => {
  return (
    <SettingsProvider>
      <SettingsContent />
    </SettingsProvider>
  );
};

export default SettingsModule;
