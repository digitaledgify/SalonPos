import React from 'react';
import { Card, CardContent, Typography, Box, Stack, Avatar, Chip, Rating } from '@mui/material';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import { useDashboard } from '../context/DashboardContext';
import { formatCurrency } from '../utils/formatters';

export const TopStylists: React.FC = () => {
  const { stylists } = useDashboard();
  const sortedStylists = [...stylists].sort((a, b) => b.todayRevenue - a.todayRevenue);

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
            <WorkspacePremiumIcon sx={{ fontSize: 20 }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#2D1F24', fontSize: '1.05rem' }}>
            Top Stylists Leaderboard
          </Typography>
        </Box>

        <Stack spacing={1.8}>
          {sortedStylists.map((stylist, index) => {
            const rank = index + 1;
            const rankBg = rank === 1 ? '#D69E2E' : rank === 2 ? '#A0AEC0' : rank === 3 ? '#DD6B20' : '#E8DFD5';
            const rankTextColor = rank <= 3 ? '#FFFFFF' : '#2D1F24';

            return (
              <Box
                key={stylist.id}
                sx={{
                  p: 1.8,
                  borderRadius: '14px',
                  bgcolor: '#F8F4EE',
                  border: '1px solid #E8DFD5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
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
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      bgcolor: rankBg,
                      color: rankTextColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.75rem',
                    }}
                  >
                    {rank}
                  </Box>

                  <Avatar
                    src={stylist.avatarUrl}
                    alt={stylist.name}
                    sx={{ width: 44, height: 44, border: '2px solid #EBD9DF' }}
                  />

                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#2D1F24' }}>
                      {stylist.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#6E5C63', display: 'block' }}>
                      {stylist.roleTitle}
                    </Typography>
                    <Rating value={stylist.rating} precision={0.1} readOnly size="small" sx={{ fontSize: 12, mt: 0.2 }} />
                  </Box>
                </Box>

                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: '#6A3F4D' }}>
                    {formatCurrency(stylist.todayRevenue)}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#6E5C63', display: 'block' }}>
                    {stylist.appointmentsCount} Appointments
                  </Typography>
                  <Chip
                    label={`Commission: ${formatCurrency(stylist.commissionAmount)} (${stylist.commissionRate}%)`}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      bgcolor: '#EBD9DF',
                      color: '#2D1F24',
                      mt: 0.4,
                    }}
                  />
                </Box>
              </Box>
            );
          })}
        </Stack>
      </CardContent>
    </Card>
  );
};
