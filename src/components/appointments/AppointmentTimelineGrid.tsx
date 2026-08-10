import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Chip,
  Button,
  IconButton,
  Tooltip,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PhoneIcon from '@mui/icons-material/Phone';
import { Appointment, AppointmentStatus } from '../../types';
import { useDashboard } from '../../context/DashboardContext';

interface Props {
  appointments: Appointment[];
  onSelectAppointment: (apt: Appointment) => void;
  onOpenNewModalForSlot?: (stylistName: string, timeSlot: string) => void;
}

const HOURS = [
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '01:00 PM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
  '05:00 PM',
  '06:00 PM',
  '07:00 PM',
  '08:00 PM',
];

export const AppointmentTimelineGrid: React.FC<Props> = ({
  appointments,
  onSelectAppointment,
  onOpenNewModalForSlot,
}) => {
  const { stylists, updateAppointmentStatus, setIsNewAppointmentOpen, showToast } = useDashboard();

  // Helper to get status chip styling
  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case 'Checked In':
        return { bg: '#E1F5FE', text: '#0288D1', border: '#B3E5FC' };
      case 'Completed':
        return { bg: '#E8F5E9', text: '#2E7D32', border: '#C8E6C9' };
      case 'Cancelled':
        return { bg: '#FFEBEE', text: '#C62828', border: '#FFCDD2' };
      case 'Booked':
      default:
        return { bg: '#FFF8E1', text: '#F57F17', border: '#FFE082' };
    }
  };

  // Find appointment matching a stylist and time slot approximation
  const findAppointment = (stylistName: string, hourStr: string) => {
    return appointments.find((apt) => {
      if (apt.stylistName !== stylistName) return false;
      
      // Compare hour part e.g. "10:00 AM" vs "10:30 AM" or "10:15 AM"
      const aptHour = apt.time.substring(0, 2); // e.g. "10"
      const slotHour = hourStr.substring(0, 2);
      const aptAmPm = apt.time.slice(-2);
      const slotAmPm = hourStr.slice(-2);

      return aptHour === slotHour && aptAmPm === slotAmPm;
    });
  };

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: '16px',
        bgcolor: '#FFFFFF',
        border: '1px solid #E8DFD5',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(107, 79, 58, 0.05)',
        mb: 3,
      }}
    >
      <Box sx={{ overflowX: 'auto' }}>
        <Box sx={{ minWidth: 950 }}>
          {/* Header Row: Stylist Columns */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: `100px repeat(${stylists.length}, 1fr)`,
              bgcolor: '#F8F4EE',
              borderBottom: '2px solid #E8DFD5',
            }}
          >
            {/* Time Axis Label Header */}
            <Box
              sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRight: '1px solid #E8DFD5',
                bgcolor: '#F8F4EE',
              }}
            >
              <AccessTimeIcon sx={{ color: '#6A3F4D', fontSize: 20, mr: 0.5 }} />
              <Typography variant="caption" sx={{ fontWeight: 800, color: '#6A3F4D', textTransform: 'uppercase' }}>
                Time
              </Typography>
            </Box>

            {/* Stylist Chairs Header */}
            {stylists.map((stylist) => {
              const activeCountForStylist = appointments.filter(
                (a) => a.stylistName === stylist.name && a.status !== 'Cancelled'
              ).length;

              return (
                <Box
                  key={stylist.id}
                  sx={{
                    p: 1.8,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.2,
                    borderRight: '1px solid #E8DFD5',
                    bgcolor: '#F8F4EE',
                  }}
                >
                  <Avatar
                    src={stylist.avatarUrl}
                    alt={stylist.name}
                    sx={{ width: 38, height: 38, border: '2px solid #A8828F' }}
                  />
                  <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                    <Typography variant="subtitle2" noWrap sx={{ fontWeight: 800, color: '#2D1F24', fontSize: '0.88rem' }}>
                      {stylist.name}
                    </Typography>
                    <Typography variant="caption" noWrap sx={{ color: '#6E5C63', display: 'block', fontSize: '0.72rem' }}>
                      {stylist.roleTitle}
                    </Typography>
                  </Box>
                  <Chip
                    label={`${activeCountForStylist} slots`}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      bgcolor: '#EBD9DF',
                      color: '#6A3F4D',
                    }}
                  />
                </Box>
              );
            })}
          </Box>

          {/* Body Rows: Hours */}
          {HOURS.map((hour) => (
            <Box
              key={hour}
              sx={{
                display: 'grid',
                gridTemplateColumns: `100px repeat(${stylists.length}, 1fr)`,
                borderBottom: '1px solid #E8DFD5',
                minHeight: 90,
                '&:hover': {
                  bgcolor: '#F8F4EE',
                },
              }}
            >
              {/* Time Hour Label */}
              <Box
                sx={{
                  p: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRight: '1px solid #E8DFD5',
                  bgcolor: '#F8F4EE',
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 800,
                    color: '#6A3F4D',
                    fontSize: '0.78rem',
                    fontFamily: 'monospace',
                  }}
                >
                  {hour}
                </Typography>
              </Box>

              {/* Stylist Cells for this Hour */}
              {stylists.map((stylist) => {
                const apt = findAppointment(stylist.name, hour);

                if (apt) {
                  const style = getStatusColor(apt.status);
                  return (
                    <Box
                      key={stylist.id}
                      sx={{
                        p: 1,
                        borderRight: '1px solid #E8DFD5',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Paper
                        elevation={0}
                        onClick={() => onSelectAppointment(apt)}
                        sx={{
                          p: 1.2,
                          height: '100%',
                          borderRadius: '12px',
                          bgcolor: style.bg,
                          border: `1px solid ${style.border}`,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
                          '&:hover': {
                            boxShadow: '0 4px 12px rgba(107, 79, 58, 0.15)',
                            transform: 'translateY(-1px)',
                          },
                        }}
                      >
                        <Box>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                            <Typography variant="caption" sx={{ fontWeight: 800, color: style.text, fontSize: '0.72rem' }}>
                              {apt.time}
                            </Typography>
                            <Chip
                              label={apt.status}
                              size="small"
                              sx={{
                                height: 18,
                                fontSize: '0.62rem',
                                fontWeight: 800,
                                bgcolor: '#FFFFFF',
                                color: style.text,
                                border: `1px solid ${style.border}`,
                              }}
                            />
                          </Box>

                          <Typography variant="body2" sx={{ fontWeight: 800, color: '#2D1F24', fontSize: '0.82rem', lineHeight: 1.2 }}>
                            {apt.customerName}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#523B2A', fontWeight: 600, display: 'block', mt: 0.3 }}>
                            {apt.service}
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1, pt: 0.8, borderTop: '1px dashed rgba(107, 79, 58, 0.15)' }}>
                          <Typography variant="caption" sx={{ fontWeight: 800, color: '#6A3F4D' }}>
                            ₹{apt.amount}
                          </Typography>

                          {/* Quick Action Buttons */}
                          <Box sx={{ display: 'flex', gap: 0.5 }} onClick={(e) => e.stopPropagation()}>
                            {apt.status === 'Booked' && (
                              <Tooltip title="Check In Client">
                                <IconButton
                                  size="small"
                                  onClick={() => updateAppointmentStatus(apt.id, 'Checked In')}
                                  sx={{ bgcolor: '#FFFFFF', color: '#0288D1', p: 0.4 }}
                                >
                                  <HowToRegIcon sx={{ fontSize: 14 }} />
                                </IconButton>
                              </Tooltip>
                            )}

                            {apt.status === 'Checked In' && (
                              <Tooltip title="Mark as Completed">
                                <IconButton
                                  size="small"
                                  onClick={() => updateAppointmentStatus(apt.id, 'Completed')}
                                  sx={{ bgcolor: '#FFFFFF', color: '#2E7D32', p: 0.4 }}
                                >
                                  <CheckCircleIcon sx={{ fontSize: 14 }} />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Box>
                        </Box>
                      </Paper>
                    </Box>
                  );
                }

                // Empty Slot State
                return (
                  <Box
                    key={stylist.id}
                    sx={{
                      p: 1,
                      borderRight: '1px solid #E8DFD5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Button
                      fullWidth
                      size="small"
                      startIcon={<AddIcon sx={{ fontSize: 14 }} />}
                      onClick={() => {
                        if (onOpenNewModalForSlot) {
                          onOpenNewModalForSlot(stylist.name, hour);
                        } else {
                          setIsNewAppointmentOpen(true);
                        }
                      }}
                      sx={{
                        height: '100%',
                        minHeight: 50,
                        borderRadius: '10px',
                        border: '1px dashed #E8DFD5',
                        color: '#6E5C63',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        textTransform: 'none',
                        opacity: 0.6,
                        '&:hover': {
                          opacity: 1,
                          bgcolor: '#F8F4EE',
                          borderColor: '#A8828F',
                          color: '#6A3F4D',
                        },
                      }}
                    >
                      Available
                    </Button>
                  </Box>
                );
              })}
            </Box>
          ))}
        </Box>
      </Box>
    </Paper>
  );
};
