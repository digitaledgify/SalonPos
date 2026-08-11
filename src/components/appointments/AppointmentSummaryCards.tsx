import React from 'react';
import { Box, Paper, Typography, Grid, LinearProgress, Chip } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ChairIcon from '@mui/icons-material/Chair';
import { useDashboard } from '../../context/DashboardContext';

export const AppointmentSummaryCards: React.FC = () => {
  const { appointments } = useDashboard();

  const totalBooked = appointments.length;
  const checkedInCount = appointments.filter((a) => a.status === 'Checked In').length;
  const completedCount = appointments.filter((a) => a.status === 'Completed').length;
  const cancelledCount = appointments.filter((a) => a.status === 'Cancelled').length;

  const totalRevenue = appointments
    .filter((a) => a.status === 'Completed')
    .reduce((sum, a) => sum + a.amount, 0);

  const totalEstimatedRevenue = appointments.reduce((sum, a) => sum + a.amount, 0);

  // Chair occupancy rate calculation assuming 5 stylists with 8 time slots = 40 max capacity
  const maxCapacity = 40;
  const activeCount = totalBooked - cancelledCount;
  const occupancyPercentage = Math.min(100, Math.round((activeCount / maxCapacity) * 100));

  return (
    <Grid container spacing={2.5} sx={{ mb: 3 }}>
      {/* 1. Total Appointments Today */}
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            borderRadius: '16px',
            bgcolor: '#FFFFFF',
            border: '1px solid #E8DFD5',
            boxShadow: '0 2px 10px rgba(107, 79, 58, 0.04)',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '4px',
              height: '100%',
              bgcolor: '#6A3F4D',
            },
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
            <Box>
              <Typography variant="caption" sx={{ color: '#6E5C63', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Total Scheduled
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#2D1F24', mt: 0.5, fontFamily: '"Inter", sans-serif' }}>
                {totalBooked}
              </Typography>
            </Box>
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: '12px',
                bgcolor: '#F8F4EE',
                color: '#6A3F4D',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #E8DFD5',
              }}
            >
              <CalendarTodayIcon sx={{ fontSize: 22 }} />
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
            <Typography variant="caption" sx={{ color: '#6E5C63', fontWeight: 600 }}>
              Expected Revenue: <b>₹{totalEstimatedRevenue.toLocaleString()}</b>
            </Typography>
          </Box>
        </Paper>
      </Grid>

      {/* 2. Checked In / In Chair */}
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>

        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            borderRadius: '16px',
            bgcolor: '#FFFFFF',
            border: '1px solid #E8DFD5',
            boxShadow: '0 2px 10px rgba(107, 79, 58, 0.04)',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '4px',
              height: '100%',
              bgcolor: '#0288D1',
            },
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
            <Box>
              <Typography variant="caption" sx={{ color: '#6E5C63', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                In Chair / Checked In
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#0288D1', mt: 0.5, fontFamily: '"Inter", sans-serif' }}>
                {checkedInCount}
              </Typography>
            </Box>
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: '12px',
                bgcolor: '#E1F5FE',
                color: '#0288D1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <HowToRegIcon sx={{ fontSize: 22 }} />
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
            <Typography variant="caption" sx={{ color: '#6E5C63', fontWeight: 600 }}>
              Active on floor right now
            </Typography>
          </Box>
        </Paper>
      </Grid>

      {/* 3. Completed & Revenue Realized */}
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>

        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            borderRadius: '16px',
            bgcolor: '#FFFFFF',
            border: '1px solid #E8DFD5',
            boxShadow: '0 2px 10px rgba(107, 79, 58, 0.04)',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '4px',
              height: '100%',
              bgcolor: '#2E7D32',
            },
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
            <Box>
              <Typography variant="caption" sx={{ color: '#6E5C63', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Completed Sessions
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#2E7D32', mt: 0.5, fontFamily: '"Inter", sans-serif' }}>
                {completedCount}
              </Typography>
            </Box>
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: '12px',
                bgcolor: '#E8F5E9',
                color: '#2E7D32',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CheckCircleIcon sx={{ fontSize: 22 }} />
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="caption" sx={{ color: '#2E7D32', fontWeight: 800 }}>
              Realized: ₹{totalRevenue.toLocaleString()}
            </Typography>
            <Typography variant="caption" sx={{ color: '#6E5C63', fontWeight: 500 }}>
              {cancelledCount} Cancelled
            </Typography>
          </Box>
        </Paper>
      </Grid>

      {/* 4. Chair Utilization Rate */}
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            borderRadius: '16px',
            bgcolor: '#FFFFFF',
            border: '1px solid #E8DFD5',
            boxShadow: '0 2px 10px rgba(107, 79, 58, 0.04)',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '4px',
              height: '100%',
              bgcolor: '#A8828F',
            },
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
            <Box>
              <Typography variant="caption" sx={{ color: '#6E5C63', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Chair Utilization
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#2D1F24', mt: 0.5, fontFamily: '"Inter", sans-serif' }}>
                {occupancyPercentage}%
              </Typography>
            </Box>
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: '12px',
                bgcolor: '#F8F4EE',
                color: '#6A3F4D',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #E8DFD5',
              }}
            >
              <ChairIcon sx={{ fontSize: 22 }} />
            </Box>
          </Box>

          <Box sx={{ mt: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="caption" sx={{ color: '#6E5C63', fontWeight: 600 }}>
                Occupancy Capacity
              </Typography>
              <Typography variant="caption" sx={{ color: '#6A3F4D', fontWeight: 800 }}>
                {activeCount} / 40 Slots
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={occupancyPercentage}
              sx={{
                height: 6,
                borderRadius: 3,
                bgcolor: '#F8F4EE',
                '& .MuiLinearProgress-bar': {
                  bgcolor: occupancyPercentage > 75 ? '#2E7D32' : '#6A3F4D',
                  borderRadius: 3,
                },
              }}
            />
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};
