import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CakeIcon from '@mui/icons-material/Cake';
import { useCustomers } from '../../context/CustomerContext';

export const TopSummaryCards: React.FC = () => {
  const { customers } = useCustomers();

  const totalCustomers = customers.length;
  const activeCustomers = customers.filter((c) => c.status === 'Active' || c.status === 'VIP').length;
  const newThisMonth = customers.filter((c) => c.createdAt.startsWith('2026-08') || c.createdAt.startsWith('2026-07')).length;
  const birthdayThisMonth = customers.filter((c) => c.isBirthdayToday || c.isBirthdayThisWeek || c.birthdayFormatted.includes('Aug')).length;

  const cards = [
    {
      title: 'Total Customers',
      count: totalCustomers,
      description: 'Registered salon database',
      icon: <PeopleAltIcon sx={{ fontSize: 26, color: '#6A3F4D' }} />,
      bgColor: '#FAF5EF',
      accentColor: '#6A3F4D',
    },
    {
      title: 'Active Customers',
      count: activeCustomers,
      description: 'Visited in last 60 days',
      icon: <CheckCircleIcon sx={{ fontSize: 26, color: '#2E7D32' }} />,
      bgColor: '#F1F8E9',
      accentColor: '#2E7D32',
    },
    {
      title: 'New This Month',
      count: newThisMonth,
      description: 'Registered this month',
      icon: <PersonAddIcon sx={{ fontSize: 26, color: '#1565C0' }} />,
      bgColor: '#E3F2FD',
      accentColor: '#1565C0',
    },
    {
      title: 'Birthday This Month',
      count: birthdayThisMonth,
      description: 'Eligible for birthday offer',
      icon: <CakeIcon sx={{ fontSize: 26, color: '#D81B60' }} />,
      bgColor: '#FCE4EC',
      accentColor: '#D81B60',
    },
  ];

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          lg: 'repeat(4, 1fr)',
        },
        gap: 2.5,
        mb: 3,
      }}
    >
      {cards.map((card, idx) => (
        <Paper
          key={idx}
          elevation={0}
          sx={{
            p: 2.5,
            borderRadius: '16px',
            bgcolor: '#FFFFFF',
            border: '1px solid #E8DFD5',
            boxShadow: '0 4px 16px rgba(107, 79, 58, 0.04)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 24px rgba(107, 79, 58, 0.08)',
            },
          }}
        >
          <Box>
            <Typography variant="caption" sx={{ color: '#6E5C63', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {card.title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#2D1F24', my: 0.5, fontFamily: '"Poppins", sans-serif' }}>
              {card.count.toLocaleString()}
            </Typography>
            <Typography variant="caption" sx={{ color: card.accentColor, fontWeight: 600 }}>
              {card.description}
            </Typography>
          </Box>
          <Box
            sx={{
              width: 52,
              height: 52,
              borderRadius: '14px',
              bgcolor: card.bgColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.02)',
            }}
          >
            {card.icon}
          </Box>
        </Paper>
      ))}
    </Box>
  );
};
