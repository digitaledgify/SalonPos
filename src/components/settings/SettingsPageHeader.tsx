import React from 'react';
import { Box, Typography, Button, Tabs, Tab } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { useSettings } from './SettingsContext';

export const SettingsPageHeader: React.FC = () => {
  const { activeTab, setActiveTab, saveAllSettings } = useSettings();

  return (
    <Box sx={{ mb: 3 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: '#2D1F24',
              fontFamily: '"Inter", sans-serif',
              fontSize: { xs: '1.5rem', sm: '1.85rem' },
            }}
          >
            Salon & POS Settings
          </Typography>
          <Typography variant="body2" sx={{ color: '#6E5C63', mt: 0.5 }}>
            Configure venue profile, working hours, GST tax parameters, automated alerts, and system backups.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={saveAllSettings}
          sx={{
            bgcolor: '#6A3F4D',
            color: '#F8F4EE',
            fontWeight: 700,
            borderRadius: '10px',
            textTransform: 'none',
            px: 3,
            py: 1,
            boxShadow: '0 4px 12px rgba(107, 79, 58, 0.2)',
            '&:hover': { bgcolor: '#4A2B35' },
          }}
        >
          Save All Changes
        </Button>
      </Box>

      {/* Settings Navigation Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: '#E8DFD5' }}>
        <Tabs
          value={activeTab}
          onChange={(_, newTab) => setActiveTab(newTab)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '0.92rem',
              color: '#6E5C63',
              mr: 2,
              '&.Mui-selected': {
                color: '#6A3F4D',
                fontWeight: 800,
              },
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#6A3F4D',
              height: 3,
              borderRadius: '3px 3px 0 0',
            },
          }}
        >
          <Tab label="Salon Profile & Branding" />
          <Tab label="Business Hours & Slots" />
          <Tab label="Billing, GST & POS" />
          <Tab label="Notifications & SMS" />
          <Tab label="Staff Access" />
          <Tab label="Backup & Data Management" />
        </Tabs>
      </Box>
    </Box>
  );
};
