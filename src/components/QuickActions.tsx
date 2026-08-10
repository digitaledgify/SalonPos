import React from 'react';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';
import AddTaskIcon from '@mui/icons-material/AddTask';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import TouchAppIcon from '@mui/icons-material/TouchApp';
import { useDashboard } from '../context/DashboardContext';

export const QuickActions: React.FC = () => {
  const {
    setIsNewAppointmentOpen,
    setIsNewBillOpen,
    setIsNewCustomerOpen,
    setIsAddExpenseOpen,
  } = useDashboard();

  const actions = [
    {
      label: '+ New Appointment',
      icon: <AddTaskIcon sx={{ fontSize: 26 }} />,
      color: '#6A3F4D',
      bgColor: '#F8F4EE',
      borderColor: '#E8DFD5',
      onClick: () => setIsNewAppointmentOpen(true),
    },
    {
      label: '+ New Bill',
      icon: <PointOfSaleIcon sx={{ fontSize: 26 }} />,
      color: '#2B6CB0',
      bgColor: '#EBF8FF',
      borderColor: '#C3DDFD',
      onClick: () => setIsNewBillOpen(true),
    },
    {
      label: '+ New Customer',
      icon: <PersonAddAlt1Icon sx={{ fontSize: 26 }} />,
      color: '#2F855A',
      bgColor: '#F0FFF4',
      borderColor: '#A7F3D0',
      onClick: () => setIsNewCustomerOpen(true),
    },
    {
      label: '+ Add Expense',
      icon: <RequestQuoteIcon sx={{ fontSize: 26 }} />,
      color: '#8C5200',
      bgColor: '#FFF8E6',
      borderColor: '#FFE8B6',
      onClick: () => setIsAddExpenseOpen(true),
    },
  ];

  return (
    <Card
      sx={{
        borderRadius: '16px',
        border: '1px solid #E8DFD5',
        bgcolor: '#FFFFFF',
      }}
    >
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <TouchAppIcon sx={{ color: '#A8828F', fontSize: 22 }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#2D1F24', fontSize: '1.05rem' }}>
            Quick Touch Actions
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
            gap: 2,
          }}
        >
          {actions.map((action) => (
            <Button
              key={action.label}
              fullWidth
              variant="outlined"
              onClick={action.onClick}
              sx={{
                py: 1.8,
                px: 2,
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                gap: 1.5,
                bgcolor: action.bgColor,
                color: action.color,
                borderColor: action.borderColor,
                textTransform: 'none',
                fontSize: '0.92rem',
                fontWeight: 700,
                boxShadow: '0 2px 8px rgba(107, 79, 58, 0.04)',
                transition: 'all 0.25s ease',
                '&:hover': {
                  bgcolor: action.bgColor,
                  borderColor: action.color,
                  transform: 'scale(1.02)',
                  boxShadow: '0 6px 16px rgba(107, 79, 58, 0.10)',
                },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 1,
                  borderRadius: '10px',
                  bgcolor: '#FFFFFF',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                }}
              >
                {action.icon}
              </Box>
              <span>{action.label}</span>
            </Button>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};
