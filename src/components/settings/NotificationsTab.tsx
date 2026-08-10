import React from 'react';
import {
  Paper,
  Box,
  Typography,
  Switch,
  FormControlLabel,
  TextField,
  Grid,
} from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { useSettings } from './SettingsContext';

export const NotificationsTab: React.FC = () => {
  const { notifications, setNotifications } = useSettings();

  const handleToggle = (field: keyof typeof notifications, checked: boolean) => {
    setNotifications((prev) => ({ ...prev, [field]: checked }));
  };

  const handleLeadHoursChange = (val: number) => {
    setNotifications((prev) => ({ ...prev, reminderLeadHours: val }));
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
        <NotificationsActiveIcon sx={{ color: '#6A3F4D', fontSize: 28 }} />
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#2D1F24', fontSize: '1.1rem' }}>
            Automated Client Reminders & Staff Alerts
          </Typography>
          <Typography variant="body2" sx={{ color: '#6E5C63' }}>
            Manage automated SMS, WhatsApp messages, and low stock inventory alerts.
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Reminder Lead Time (Hours)"
              type="number"
              fullWidth
              value={notifications.reminderLeadHours}
              onChange={(e) => handleLeadHoursChange(Number(e.target.value))}
              helperText="How many hours prior to appointment time to send reminder SMS/WhatsApp"
            />
          </Grid>
        </Grid>

        <Box sx={{ p: 2, bgcolor: '#F8F4EE', borderRadius: '12px', border: '1px solid #E8DFD5', display: 'flex', flexDirection: 'column', gap: 2 }}>
          <FormControlLabel
            control={
              <Switch
                checked={notifications.clientAppointmentWhatsApp}
                onChange={(e) => handleToggle('clientAppointmentWhatsApp', e.target.checked)}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': { color: '#6A3F4D' },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#6A3F4D' },
                }}
              />
            }
            label={
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#2D1F24' }}>
                  WhatsApp Appointment Confirmations & Reminders
                </Typography>
                <Typography variant="caption" sx={{ color: '#6E5C63' }}>
                  Sends instant WhatsApp message with appointment date, stylist name, and venue location map.
                </Typography>
              </Box>
            }
          />

          <FormControlLabel
            control={
              <Switch
                checked={notifications.clientAppointmentRemindersSMS}
                onChange={(e) => handleToggle('clientAppointmentRemindersSMS', e.target.checked)}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': { color: '#6A3F4D' },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#6A3F4D' },
                }}
              />
            }
            label={
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#2D1F24' }}>
                  Fallback DLT Transactional SMS
                </Typography>
                <Typography variant="caption" sx={{ color: '#6E5C63' }}>
                  Sends SMS confirmation via Indian DLT approved SMS gateway if WhatsApp is unavailable.
                </Typography>
              </Box>
            }
          />

          <FormControlLabel
            control={
              <Switch
                checked={notifications.staffShiftAlerts}
                onChange={(e) => handleToggle('staffShiftAlerts', e.target.checked)}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': { color: '#6A3F4D' },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#6A3F4D' },
                }}
              />
            }
            label={
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#2D1F24' }}>
                  Staff Shift Roster & Commission Notifications
                </Typography>
                <Typography variant="caption" sx={{ color: '#6E5C63' }}>
                  Notifies stylists when their weekly shift schedule is updated or daily commission is credited.
                </Typography>
              </Box>
            }
          />

          <FormControlLabel
            control={
              <Switch
                checked={notifications.lowStockInventoryAlerts}
                onChange={(e) => handleToggle('lowStockInventoryAlerts', e.target.checked)}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': { color: '#6A3F4D' },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#6A3F4D' },
                }}
              />
            }
            label={
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#2D1F24' }}>
                  Low Stock Product Alerts for Store Manager
                </Typography>
                <Typography variant="caption" sx={{ color: '#6E5C63' }}>
                  Alerts salon manager when shampoo, color tubes, or retail product units drop below reorder threshold.
                </Typography>
              </Box>
            }
          />
        </Box>
      </Box>
    </Paper>
  );
};
