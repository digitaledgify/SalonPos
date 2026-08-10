import React from 'react';
import { Box, Paper, Typography, Grid } from '@mui/material';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import TimerIcon from '@mui/icons-material/Timer';
import { useServices } from '../../context/ServiceContext';

export const ServiceSummaryCards: React.FC = () => {
  const { services } = useServices();

  const totalServices = services.length;
  const activeServices = services.filter((s) => s.status === 'Active').length;

  const mostPopularService = [...services].sort((a, b) => b.totalBookings - a.totalBookings)[0];

  const totalRevenue = services.reduce((acc, s) => acc + s.totalRevenue, 0);

  const avgPrice = Math.round(
    services.reduce((acc, s) => acc + s.basePrice, 0) / (totalServices || 1)
  );

  const avgDuration = Math.round(
    services.reduce((acc, s) => acc + s.durationMinutes, 0) / (totalServices || 1)
  );

  const formatCurrency = (val: number) => {
    return `₹${val.toLocaleString('en-IN')}`;
  };

  const cards = [
    {
      title: 'Active Service Catalog',
      value: `${activeServices} / ${totalServices}`,
      subtitle: 'Available for instant customer booking',
      icon: <ContentCutIcon sx={{ color: '#6A3F4D', fontSize: 22 }} />,
      bgColor: '#F8F4EE',
      borderColor: '#E8DFD5',
    },
    {
      title: 'Most Popular Treatment',
      value: mostPopularService ? mostPopularService.name : 'N/A',
      subtitle: mostPopularService
        ? `${mostPopularService.totalBookings} total bookings (${mostPopularService.code})`
        : '',
      icon: <TrendingUpIcon sx={{ color: '#2E7D32', fontSize: 22 }} />,
      bgColor: '#F4F8F4',
      borderColor: '#C8E6C9',
    },
    {
      title: 'Total Service Revenue',
      value: formatCurrency(totalRevenue),
      subtitle: 'Lifetime revenue from service bookings',
      icon: <CurrencyRupeeIcon sx={{ color: '#A8828F', fontSize: 22 }} />,
      bgColor: '#F8F4EE',
      borderColor: '#EBD9DF',
    },
    {
      title: 'Avg Price & Duration',
      value: `${formatCurrency(avgPrice)} • ${avgDuration}m`,
      subtitle: 'Average per salon treatment session',
      icon: <TimerIcon sx={{ color: '#1565C0', fontSize: 22 }} />,
      bgColor: '#F0F4F9',
      borderColor: '#BBDEFB',
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
              bgcolor: card.bgColor,
              border: `1px solid ${card.borderColor}`,
              boxShadow: '0 2px 8px rgba(107, 79, 58, 0.04)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '100%',
              transition: 'transform 0.2s ease, boxShadow 0.2s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 16px rgba(107, 79, 58, 0.08)',
              },
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#6E5C63', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {card.title}
              </Typography>
              <Box
                sx={{
                  p: 0.8,
                  borderRadius: '10px',
                  bgcolor: '#FFFFFF',
                  border: '1px solid rgba(0,0,0,0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {card.icon}
              </Box>
            </Box>

            <Box>
              <Typography
                noWrap
                variant="h6"
                sx={{
                  fontWeight: 800,
                  color: '#2D1F24',
                  fontFamily: '"Poppins", sans-serif',
                  fontSize: { xs: '1.15rem', lg: '1.25rem' },
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {card.value}
              </Typography>
              <Typography variant="caption" sx={{ color: '#6E5C63', fontWeight: 500, display: 'block', mt: 0.5 }}>
                {card.subtitle}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};
