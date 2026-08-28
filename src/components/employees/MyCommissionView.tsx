import React from 'react';
import { Box, Paper, Typography, Grid, Chip, Avatar, LinearProgress } from '@mui/material';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import PercentIcon from '@mui/icons-material/Percent';
import StarIcon from '@mui/icons-material/Star';
import { useEmployees } from './EmployeesContext';
import { useDashboard } from '../../context/DashboardContext';

/**
 * Restricted, read-only view for the Stylist role: their own earnings only.
 * Never renders any other staff member's data. Note: the underlying
 * `employees` list is currently fetched per-salon without a server-side
 * per-row restriction, so this is a UI-level boundary — for defense in
 * depth in production, add a Supabase Row Level Security policy that also
 * restricts a Stylist's own auth session to only their own employee row.
 */
export const MyCommissionView: React.FC = () => {
  const { employees, loadingEmployees } = useEmployees();
  const { currentUser } = useDashboard();

  const myRecord = employees.find(
    (e) => e.email.trim().toLowerCase() === (currentUser?.email || '').trim().toLowerCase()
  );

  if (loadingEmployees) {
    return null;
  }

  if (!myRecord) {
    return (
      <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 900, mx: 'auto' }}>
        <Paper elevation={0} sx={{ p: 4, borderRadius: '16px', border: '1px solid #E8DFD5', textAlign: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#2D1F24', mb: 1 }}>
            No staff profile linked yet
          </Typography>
          <Typography variant="body2" sx={{ color: '#6E5C63' }}>
            Ask your Admin to add your name and this same login email as a staff record so your
            commission and earnings can show up here.
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 900, mx: 'auto' }}>
      <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', border: '1px solid #E8DFD5', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar src={myRecord.avatarUrl} sx={{ width: 64, height: 64, border: '2px solid #EBD9DF' }} />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#2D1F24' }}>
              {myRecord.name}
            </Typography>
            <Typography variant="body2" sx={{ color: '#6E5C63' }}>
              {myRecord.roleTitle} • {myRecord.department}
            </Typography>
          </Box>
          <Chip
            icon={<StarIcon sx={{ fontSize: '16px !important' }} />}
            label={myRecord.rating.toFixed(1)}
            size="small"
            sx={{ ml: 'auto', bgcolor: '#F8F4EE', color: '#6A3F4D', fontWeight: 800 }}
          />
        </Box>
      </Paper>

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: '16px', border: '1px solid #E8DFD5', bgcolor: '#FFFFFF' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <CurrencyRupeeIcon sx={{ color: '#6A3F4D' }} />
              <Typography variant="caption" sx={{ color: '#6E5C63', fontWeight: 800, textTransform: 'uppercase' }}>
                Commission Earned Today
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#2D1F24', fontSize: '1.6rem' }}>
              ₹{myRecord.commissionEarnedToday.toLocaleString('en-IN')}
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: '16px', border: '1px solid #EBD9DF', bgcolor: '#F8F4EE' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <CurrencyRupeeIcon sx={{ color: '#6A3F4D' }} />
              <Typography variant="caption" sx={{ color: '#6A3F4D', fontWeight: 800, textTransform: 'uppercase' }}>
                Commission Earned This Month
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#6A3F4D', fontSize: '1.6rem' }}>
              ₹{myRecord.commissionEarnedMonth.toLocaleString('en-IN')}
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: '16px', border: '1px solid #E8DFD5', bgcolor: '#FFFFFF' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <PercentIcon sx={{ color: '#6A3F4D' }} />
              <Typography variant="caption" sx={{ color: '#6E5C63', fontWeight: 800, textTransform: 'uppercase' }}>
                My Commission Rate
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#2D1F24', fontSize: '1.6rem' }}>
              {myRecord.commissionRate}%
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: '16px', border: '1px solid #E8DFD5', bgcolor: '#FFFFFF' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <CurrencyRupeeIcon sx={{ color: '#6A3F4D' }} />
              <Typography variant="caption" sx={{ color: '#6E5C63', fontWeight: 800, textTransform: 'uppercase' }}>
                Tips Today
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#2D1F24', fontSize: '1.6rem' }}>
              ₹{myRecord.tipsToday.toLocaleString('en-IN')}
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: '16px', border: '1px solid #E8DFD5', bgcolor: '#FFFFFF' }}>
            <Typography variant="caption" sx={{ color: '#6E5C63', fontWeight: 800, textTransform: 'uppercase', mb: 1, display: 'block' }}>
              Completed Appointments
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#2D1F24', mb: 1 }}>
              {myRecord.completedAppointmentsCount}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={Math.min(100, myRecord.completedAppointmentsCount)}
              sx={{ height: 8, borderRadius: 4, bgcolor: '#F8F4EE', '& .MuiLinearProgress-bar': { bgcolor: '#6A3F4D', borderRadius: 4 } }}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
