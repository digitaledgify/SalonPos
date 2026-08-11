import React from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

export interface KPICardProps {
  id: string;
  title: string;
  value: string | number;
  comparison: string;
  isPositive?: boolean;
  description: string;
  type: 'sales' | 'appointments' | 'walkins' | 'completed' | 'pending' | 'stock';
}

const getKPIIcon = (type: KPICardProps['type']) => {
  switch (type) {
    case 'sales':
      return <CurrencyRupeeIcon sx={{ fontSize: 24, color: '#6A3F4D' }} />;
    case 'appointments':
      return <CalendarMonthIcon sx={{ fontSize: 24, color: '#2B6CB0' }} />;
    case 'walkins':
      return <DirectionsWalkIcon sx={{ fontSize: 24, color: '#6A3F4D' }} />;
    case 'completed':
      return <CheckCircleOutlinedIcon sx={{ fontSize: 24, color: '#2F855A' }} />;
    case 'pending':
      return <PendingActionsIcon sx={{ fontSize: 24, color: '#D69E2E' }} />;
    case 'stock':
      return <WarningAmberIcon sx={{ fontSize: 24, color: '#C53030' }} />;
    default:
      return <CurrencyRupeeIcon sx={{ fontSize: 24, color: '#6A3F4D' }} />;
  }
};

const getKPIIconBg = (type: KPICardProps['type']) => {
  switch (type) {
    case 'sales':
      return '#EBD9DF';
    case 'appointments':
      return '#EBF8FF';
    case 'walkins':
      return '#F8F4EE';
    case 'completed':
      return '#F0FFF4';
    case 'pending':
      return '#FEFCBF';
    case 'stock':
      return '#FFF5F5';
    default:
      return '#F8F4EE';
  }
};

export const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  comparison,
  isPositive = true,
  description,
  type,
}) => {
  return (
    <Card
      sx={{
        height: '100%',
        borderRadius: '16px',
        border: '1px solid #E8DFD5',
        bgcolor: '#FFFFFF',
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 28px rgba(106, 63, 77, 0.12)',
          borderColor: '#6A3F4D',
        },
      }}
    >
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
          <Box
            sx={{
              width: 46,
              height: 46,
              borderRadius: '14px',
              bgcolor: getKPIIconBg(type),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {getKPIIcon(type)}
          </Box>
        </Box>

        <Typography variant="caption" sx={{ fontFamily: '"Inter", sans-serif', color: '#6E5C63', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {title}
        </Typography>

        <Typography
          variant="h4"
          sx={{
            fontFamily: '"Inter", sans-serif',
            fontWeight: 700,
            color: '#2D1F24',
            my: 0.5,
            fontSize: { xs: '1.6rem', md: '1.85rem' },
          }}
        >
          {value}
        </Typography>

        <Typography variant="caption" sx={{ fontFamily: '"Inter", sans-serif', color: '#9E8D93', fontSize: '0.78rem', display: 'block', fontWeight: 500 }}>
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
};
