import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  Button,
  Chip,
  Avatar,
  Paper,
  Stack,
  Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import CancelIcon from '@mui/icons-material/Cancel';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { Appointment, AppointmentStatus } from '../../types';
import { useDashboard } from '../../context/DashboardContext';

interface Props {
  appointment: Appointment | null;
  onClose: () => void;
}

export const AppointmentDetailDrawer: React.FC<Props> = ({ appointment, onClose }) => {
  const { stylists, updateAppointmentStatus, addTransaction, showToast } = useDashboard();

  if (!appointment) return null;

  const stylist = stylists.find((s) => s.name === appointment.stylistName);

  const handleStatusUpdate = (status: AppointmentStatus) => {
    updateAppointmentStatus(appointment.id, status);
  };

  const handleGenerateInvoice = () => {
    addTransaction({
      customerName: appointment.customerName,
      customerPhone: appointment.customerPhone,
      stylistName: appointment.stylistName,
      services: [appointment.service],
      amount: appointment.amount,
      paymentMethod: 'UPI',
      status: 'Paid',
    });
    updateAppointmentStatus(appointment.id, 'Completed');
    showToast(`Invoice generated for ${appointment.customerName}`);
    onClose();
  };

  const handleSendWhatsApp = () => {
    showToast(`Sending WhatsApp reminder to ${appointment.customerName} (${appointment.customerPhone})...`);
  };

  return (
    <Drawer
      anchor="right"
      open={Boolean(appointment)}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: { xs: '100%', sm: 420 },
            bgcolor: '#F8F4EE',
            p: 0,
          },
        },
      }}
    >
      {/* Drawer Header */}
      <Box
        sx={{
          p: 2.5,
          bgcolor: '#6A3F4D',
          color: '#EBD9DF',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <CalendarTodayIcon />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: '"Playfair Display", serif', fontSize: '1.15rem' }}>
              Appointment Details
            </Typography>
            <Typography variant="caption" sx={{ color: '#EBD9DF', opacity: 0.8 }}>
              ID: {appointment.id}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} sx={{ color: '#EBD9DF' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Drawer Content */}
      <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2.5, overflowY: 'auto' }}>
        {/* Status Pipeline Alert Card */}
        <Paper elevation={0} sx={{ p: 2, borderRadius: '12px', bgcolor: '#FFFFFF', border: '1px solid #E8DFD5' }}>
          <Typography variant="caption" sx={{ color: '#6E5C63', fontWeight: 700, textTransform: 'uppercase' }}>
            Current Status
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
            <Chip
              label={appointment.status}
              sx={{
                bgcolor:
                  appointment.status === 'Checked In'
                    ? '#E1F5FE'
                    : appointment.status === 'Completed'
                    ? '#E8F5E9'
                    : appointment.status === 'Cancelled'
                    ? '#FFEBEE'
                    : '#FFF8E1',
                color:
                  appointment.status === 'Checked In'
                    ? '#0288D1'
                    : appointment.status === 'Completed'
                    ? '#2E7D32'
                    : appointment.status === 'Cancelled'
                    ? '#C62828'
                    : '#F57F17',
                fontWeight: 800,
                fontSize: '0.85rem',
                height: 28,
              }}
            />
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#2D1F24', fontFamily: 'monospace' }}>
              Slot: {appointment.time}
            </Typography>
          </Box>

          {/* Quick Status Shift Buttons */}
          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            {appointment.status !== 'Checked In' && appointment.status !== 'Completed' && (
              <Button
                fullWidth
                size="small"
                variant="outlined"
                startIcon={<HowToRegIcon sx={{ fontSize: 16 }} />}
                onClick={() => handleStatusUpdate('Checked In')}
                sx={{
                  borderColor: '#0288D1',
                  color: '#0288D1',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  textTransform: 'none',
                }}
              >
                Check In
              </Button>
            )}

            {appointment.status !== 'Completed' && (
              <Button
                fullWidth
                size="small"
                variant="contained"
                startIcon={<CheckCircleIcon sx={{ fontSize: 16 }} />}
                onClick={() => handleStatusUpdate('Completed')}
                sx={{
                  bgcolor: '#2E7D32',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  textTransform: 'none',
                  '&:hover': { bgcolor: '#1B5E20' },
                }}
              >
                Complete
              </Button>
            )}

            {appointment.status !== 'Cancelled' && (
              <Button
                size="small"
                variant="outlined"
                color="error"
                startIcon={<CancelIcon sx={{ fontSize: 16 }} />}
                onClick={() => handleStatusUpdate('Cancelled')}
                sx={{
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  textTransform: 'none',
                }}
              >
                Cancel
              </Button>
            )}
          </Box>
        </Paper>

        {/* Client Profile Summary */}
        <Paper elevation={0} sx={{ p: 2, borderRadius: '12px', bgcolor: '#FFFFFF', border: '1px solid #E8DFD5' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#6A3F4D', mb: 1.5 }}>
            Client Details
          </Typography>
          <Stack spacing={1.2}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <PersonIcon sx={{ color: '#6E5C63', fontSize: 18 }} />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 800, color: '#2D1F24' }}>
                  {appointment.customerName}
                </Typography>
                <Typography variant="caption" sx={{ color: '#6E5C63' }}>
                  Registered Salon Client
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <PhoneIcon sx={{ color: '#6E5C63', fontSize: 18 }} />
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#2D1F24' }}>
                {appointment.customerPhone}
              </Typography>
            </Box>

            <Button
              size="small"
              variant="outlined"
              startIcon={<WhatsAppIcon sx={{ color: '#25D366' }} />}
              onClick={handleSendWhatsApp}
              sx={{
                borderColor: '#25D366',
                color: '#128C7E',
                fontWeight: 700,
                fontSize: '0.78rem',
                textTransform: 'none',
                mt: 1,
              }}
            >
              Send WhatsApp Confirmation
            </Button>
          </Stack>
        </Paper>

        {/* Treatment & Stylist Details */}
        <Paper elevation={0} sx={{ p: 2, borderRadius: '12px', bgcolor: '#FFFFFF', border: '1px solid #E8DFD5' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#6A3F4D', mb: 1.5 }}>
            Treatment & Service
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ContentCutIcon sx={{ color: '#6A3F4D', fontSize: 20 }} />
              <Typography variant="body2" sx={{ fontWeight: 800, color: '#2D1F24' }}>
                {appointment.service}
              </Typography>
            </Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#2E7D32' }}>
              ₹{appointment.amount.toLocaleString()}
            </Typography>
          </Box>

          <Divider sx={{ my: 1.5, borderColor: '#E8DFD5' }} />

          <Typography variant="caption" sx={{ color: '#6E5C63', fontWeight: 700, textTransform: 'uppercase', display: 'block', mb: 1 }}>
            Assigned Stylist
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar src={stylist?.avatarUrl} alt={appointment.stylistName} sx={{ width: 40, height: 40, border: '2px solid #A8828F' }} />
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 800, color: '#2D1F24' }}>
                {appointment.stylistName}
              </Typography>
              <Typography variant="caption" sx={{ color: '#6E5C63' }}>
                {stylist?.roleTitle || 'Senior Stylist'}
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Special Notes & Allergies */}
        {appointment.notes && (
          <Alert icon={<WarningAmberIcon />} severity="warning" sx={{ borderRadius: '12px', fontWeight: 600, fontSize: '0.82rem' }}>
            <strong>Client Note / Allergy:</strong> {appointment.notes}
          </Alert>
        )}

        {/* Primary Invoice Action */}
        <Button
          fullWidth
          variant="contained"
          startIcon={<ReceiptLongIcon />}
          onClick={handleGenerateInvoice}
          sx={{
            py: 1.5,
            bgcolor: '#6A3F4D',
            color: '#EBD9DF',
            borderRadius: '12px',
            fontWeight: 800,
            fontSize: '0.9rem',
            boxShadow: '0 4px 12px rgba(107, 79, 58, 0.25)',
            '&:hover': { bgcolor: '#523B2A' },
          }}
        >
          Generate Invoice & Complete
        </Button>
      </Box>
    </Drawer>
  );
};
