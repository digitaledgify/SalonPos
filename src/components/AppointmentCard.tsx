import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  Chip,
  Button,
  Avatar,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckIcon from '@mui/icons-material/Check';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import { useDashboard } from '../context/DashboardContext';
import { getAppointmentStatusColor, formatCurrency } from '../utils/formatters';
import { AppointmentStatus } from '../types';

export const AppointmentCard: React.FC = () => {
  const { appointments, updateAppointmentStatus, searchQuery } = useDashboard();
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredAppointments = appointments.filter((apt) => {
    const matchesFilter = statusFilter === 'all' || apt.status === statusFilter;
    if (!searchQuery) return matchesFilter;
    const q = searchQuery.toLowerCase();
    return (
      matchesFilter &&
      (apt.customerName.toLowerCase().includes(q) ||
        apt.stylistName.toLowerCase().includes(q) ||
        apt.service.toLowerCase().includes(q))
    );
  });

  const displayAppointments = filteredAppointments.slice(0, 8);

  return (
    <Card
      sx={{
        borderRadius: '16px',
        border: '1px solid #E8DFD5',
        bgcolor: '#FFFFFF',
        height: '100%',
      }}
    >
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 1.5,
            mb: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '10px',
                bgcolor: '#F8F4EE',
                color: '#6A3F4D',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #E8DFD5',
              }}
            >
              <CalendarMonthIcon sx={{ fontSize: 20 }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#2D1F24', fontSize: '1.05rem' }}>
              Today's Schedule ({appointments.length})
            </Typography>
          </Box>

          <ToggleButtonGroup
            value={statusFilter}
            exclusive
            onChange={(_, val) => val && setStatusFilter(val)}
            size="small"
            sx={{
              bgcolor: '#F8F4EE',
              borderRadius: '10px',
              p: 0.5,
              '& .MuiToggleButton-root': {
                border: 'none',
                borderRadius: '8px',
                px: 1.2,
                py: 0.3,
                fontSize: '0.72rem',
                fontWeight: 700,
                color: '#6E5C63',
                '&.Mui-selected': {
                  bgcolor: '#6A3F4D',
                  color: '#FFFFFF',
                },
              },
            }}
          >
            <ToggleButton value="all">All</ToggleButton>
            <ToggleButton value="Booked">Booked</ToggleButton>
            <ToggleButton value="Checked In">In Salon</ToggleButton>
            <ToggleButton value="Completed">Done</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Stack spacing={1.5}>
          {displayAppointments.map((apt) => {
            const badgeColors = getAppointmentStatusColor(apt.status);
            return (
              <Box
                key={apt.id}
                sx={{
                  p: 1.8,
                  borderRadius: '14px',
                  bgcolor: '#F8F4EE',
                  border: '1px solid #E8DFD5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 1.5,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    bgcolor: '#FFFFFF',
                    boxShadow: '0 4px 14px rgba(107, 79, 58, 0.08)',
                    borderColor: '#A8828F',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box
                    sx={{
                      px: 1.2,
                      py: 0.6,
                      borderRadius: '8px',
                      bgcolor: '#EBD9DF',
                      color: '#2D1F24',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                    }}
                  >
                    <AccessTimeIcon sx={{ fontSize: 14 }} />
                    <Typography variant="caption" sx={{ fontWeight: 800, fontSize: '0.75rem' }}>
                      {apt.time}
                    </Typography>
                  </Box>

                  <Avatar sx={{ bgcolor: '#6A3F4D', width: 36, height: 36, fontSize: '0.9rem', fontWeight: 700 }}>
                    {apt.customerName.charAt(0)}
                  </Avatar>

                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#2D1F24', lineHeight: 1.2 }}>
                      {apt.customerName}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#6E5C63', display: 'block', mt: 0.2 }}>
                      {apt.service} • <strong style={{ color: '#6A3F4D' }}>{apt.stylistName}</strong>
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: '#6A3F4D', mr: 1 }}>
                    {formatCurrency(apt.amount)}
                  </Typography>

                  <Chip
                    label={apt.status}
                    size="small"
                    sx={{
                      height: 24,
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      bgcolor: badgeColors.bg,
                      color: badgeColors.text,
                      border: `1px solid ${badgeColors.border}`,
                    }}
                  />

                  {/* Quick Action Buttons */}
                  {apt.status === 'Booked' && (
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<HowToRegIcon sx={{ fontSize: '14px !important' }} />}
                      onClick={() => updateAppointmentStatus(apt.id, 'Checked In' as AppointmentStatus)}
                      sx={{
                        fontSize: '0.7rem',
                        py: 0.3,
                        px: 1,
                        bgcolor: '#A8828F',
                        color: '#2D1F24',
                        minWidth: 'auto',
                      }}
                    >
                      Check In
                    </Button>
                  )}

                  {apt.status === 'Checked In' && (
                    <Button
                      size="small"
                      variant="contained"
                      startIcon={<CheckIcon sx={{ fontSize: '14px !important' }} />}
                      onClick={() => updateAppointmentStatus(apt.id, 'Completed' as AppointmentStatus)}
                      sx={{
                        fontSize: '0.7rem',
                        py: 0.3,
                        px: 1,
                        bgcolor: '#2F855A',
                        color: '#FFFFFF',
                        minWidth: 'auto',
                      }}
                    >
                      Complete
                    </Button>
                  )}
                </Box>
              </Box>
            );
          })}
        </Stack>
      </CardContent>
    </Card>
  );
};
