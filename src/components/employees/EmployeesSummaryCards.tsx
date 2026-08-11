import React from 'react';
import { Grid, Paper, Box, Typography, Avatar, LinearProgress } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import PercentIcon from '@mui/icons-material/Percent';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useEmployees } from './EmployeesContext';

export const EmployeesSummaryCards: React.FC = () => {
  const { employees } = useEmployees();

  // Metrics
  const totalStaff = employees.length;
  const onShiftToday = employees.filter((e) => e.status === 'On Shift').length;
  const onLeaveCount = employees.filter((e) => e.status === 'On Leave').length;

  const todaySalesTotal = employees.reduce((acc, curr) => acc + curr.todaySales, 0);
  const todayCommissionTotal = employees.reduce((acc, curr) => acc + curr.commissionEarnedToday, 0);
  const monthCommissionTotal = employees.reduce((acc, curr) => acc + curr.commissionEarnedMonth, 0);

  const avgCommRate = totalStaff > 0
    ? (employees.reduce((acc, curr) => acc + curr.commissionRate, 0) / totalStaff).toFixed(1)
    : 0;

  const cards = [
    {
      title: 'Total Active Staff',
      value: `${totalStaff} Members`,
      subtitle: `${onShiftToday} currently on shift · ${onLeaveCount} on leave`,
      icon: <PeopleIcon sx={{ color: '#6A3F4D' }} />,
      bgColor: '#F8F4EE',
      accentColor: '#6A3F4D',
    },
    {
      title: "Today's Staff Sales",
      value: `₹${todaySalesTotal.toLocaleString('en-IN')}`,
      subtitle: `Total services delivered today`,
      icon: <CurrencyRupeeIcon sx={{ color: '#2E7D32' }} />,
      bgColor: '#F4F9F4',
      accentColor: '#2E7D32',
    },
    {
      title: 'Today’s Commissions',
      value: `₹${todayCommissionTotal.toLocaleString('en-IN')}`,
      subtitle: `Avg commission rate: ${avgCommRate}%`,
      icon: <PercentIcon sx={{ color: '#A8828F' }} />,
      bgColor: '#F8F4EE',
      accentColor: '#6A3F4D',
    },
    {
      title: 'Shift Coverage Today',
      value: `${onShiftToday} / ${totalStaff} Present`,
      subtitle: `Morning & Evening shift active`,
      icon: <AccessTimeIcon sx={{ color: '#0288D1' }} />,
      bgColor: '#F0F8FF',
      accentColor: '#0288D1',
    },
  ];

  return (
    <Grid container spacing={2.5} sx={{ mb: 3 }}>
      {cards.map((card, idx) => (
        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={idx}>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: '16px',
              bgcolor: '#FFFFFF',
              border: '1px solid #E8DFD5',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 24px rgba(107, 79, 58, 0.08)',
              },
            }}
          >
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                <Typography variant="caption" sx={{ color: '#6E5C63', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {card.title}
                </Typography>
                <Avatar
                  sx={{
                    bgcolor: card.bgColor,
                    width: 38,
                    height: 38,
                    border: `1px solid ${card.accentColor}22`,
                  }}
                >
                  {card.icon}
                </Avatar>
              </Box>

              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  color: '#2D1F24',
                  fontSize: '1.5rem',
                  fontFamily: '"Inter", sans-serif',
                  mb: 0.5,
                }}
              >
                {card.value}
              </Typography>
            </Box>

            <Box sx={{ pt: 1, borderTop: '1px solid #F5EFE6', mt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="caption" sx={{ color: '#6E5C63', fontSize: '0.75rem', fontWeight: 500 }}>
                {card.subtitle}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};
