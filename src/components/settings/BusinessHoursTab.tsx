import React from 'react';
import {
  Paper,
  Box,
  Typography,
  Switch,
  FormControlLabel,
  TextField,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useSettings } from './SettingsContext';

export const BusinessHoursTab: React.FC = () => {
  const { hours, setHours } = useSettings();

  const handleToggleOpen = (idx: number, isOpen: boolean) => {
    setHours((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, isOpen } : item))
    );
  };

  const handleTimeChange = (idx: number, field: 'openTime' | 'closeTime', val: string) => {
    setHours((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, [field]: val } : item))
    );
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: '16px',
        bgcolor: '#FFFFFF',
        border: '1px solid #E8DFD5',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <AccessTimeIcon sx={{ color: '#6A3F4D', fontSize: 28 }} />
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#2D1F24', fontSize: '1.1rem' }}>
            Weekly Operating Schedule & Time Slots
          </Typography>
          <Typography variant="body2" sx={{ color: '#6E5C63' }}>
            Set store opening and closing times. Appointments cannot be booked outside these working hours.
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {hours.map((item, idx) => (
          <Box
            key={item.day}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 2,
              borderRadius: '12px',
              bgcolor: item.isOpen ? '#FFFFFF' : '#F8F4EE',
              border: '1px solid #E8DFD5',
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <Box sx={{ minWidth: 140 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: item.isOpen ? '#2D1F24' : '#6E5C63' }}>
                {item.day}
              </Typography>
              <Typography variant="caption" sx={{ color: item.isOpen ? '#2E7D32' : '#C62828', fontWeight: 700 }}>
                {item.isOpen ? 'Open for Bookings' : 'Closed Day'}
              </Typography>
            </Box>

            <FormControlLabel
              control={
                <Switch
                  checked={item.isOpen}
                  onChange={(e) => handleToggleOpen(idx, e.target.checked)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': { color: '#6A3F4D' },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#6A3F4D' },
                  }}
                />
              }
              label={<Typography variant="body2" sx={{ fontWeight: 700 }}>Store Open</Typography>}
            />

            {item.isOpen && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <TextField
                  size="small"
                  label="Opening Time"
                  value={item.openTime}
                  onChange={(e) => handleTimeChange(idx, 'openTime', e.target.value)}
                  sx={{ width: 140 }}
                />
                <Typography variant="body2" sx={{ color: '#6E5C63', fontWeight: 700 }}>to</Typography>
                <TextField
                  size="small"
                  label="Closing Time"
                  value={item.closeTime}
                  onChange={(e) => handleTimeChange(idx, 'closeTime', e.target.value)}
                  sx={{ width: 140 }}
                />
              </Box>
            )}
          </Box>
        ))}
      </Box>
    </Paper>
  );
};
