import React from 'react';
import { Card, CardContent, Typography, Box, LinearProgress } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { useDashboard } from '../context/DashboardContext';
import { formatCurrency } from '../utils/formatters';

export const TopServicesChart: React.FC = () => {
  const { topServices } = useDashboard();
  const maxRevenue = Math.max(...topServices.map((s) => s.revenue));

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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
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
            <AutoAwesomeIcon sx={{ fontSize: 20 }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#2D1F24', fontSize: '1.05rem' }}>
            Top Requested Services
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {topServices.map((service) => {
            const progressPercent = Math.round((service.revenue / maxRevenue) * 100);
            return (
              <Box key={service.serviceName}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#2D1F24', fontSize: '0.88rem' }}>
                    {service.serviceName}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#6A3F4D', fontSize: '0.85rem' }}>
                    {formatCurrency(service.revenue)}{' '}
                    <Typography component="span" variant="caption" sx={{ color: '#6E5C63', ml: 0.5 }}>
                      ({service.bookings} booked)
                    </Typography>
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={progressPercent}
                  sx={{
                    height: 10,
                    borderRadius: 5,
                    bgcolor: '#F8F4EE',
                    border: '1px solid #E8DFD5',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: '#6A3F4D',
                      borderRadius: 5,
                    },
                  }}
                />
              </Box>
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
};
