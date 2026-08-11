import React from 'react';
import { Box, Paper, Typography, Button, Avatar, Chip } from '@mui/material';
import CakeIcon from '@mui/icons-material/Cake';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EventIcon from '@mui/icons-material/Event';
import { useCustomers } from '../../context/CustomerContext';

export const BirthdayWidget: React.FC = () => {
  const { customers, sendBirthdayWish, setSelectedCustomer } = useCustomers();

  const todayBirthdays = customers.filter((c) => c.isBirthdayToday);
  const weekBirthdays = customers.filter((c) => c.isBirthdayThisWeek && !c.isBirthdayToday);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: '16px',
        bgcolor: '#FFFFFF',
        border: '1px solid #E8DFD5',
        boxShadow: '0 4px 16px rgba(107, 79, 58, 0.04)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CakeIcon sx={{ color: '#D81B60', fontSize: 24 }} />
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#2D1F24', fontFamily: '"Inter", sans-serif' }}>
            Upcoming Birthdays
          </Typography>
        </Box>
        <Chip
          label={`${todayBirthdays.length + weekBirthdays.length} Celebration${todayBirthdays.length + weekBirthdays.length === 1 ? '' : 's'}`}
          size="small"
          sx={{ bgcolor: '#FCE4EC', color: '#D81B60', fontWeight: 800, fontSize: '0.72rem' }}
        />
      </Box>

      {/* Today's Birthdays */}
      <Box sx={{ mb: 2.5 }}>
        <Typography variant="caption" sx={{ color: '#D81B60', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', mb: 1, display: 'block' }}>
          🎂 Today's Birthdays ({todayBirthdays.length})
        </Typography>

        {todayBirthdays.length === 0 ? (
          <Typography variant="body2" sx={{ color: '#6E5C63', fontStyle: 'italic', fontSize: '0.85rem' }}>
            No customer birthdays today.
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
            {todayBirthdays.map((c) => (
              <Paper
                key={c.id}
                elevation={0}
                sx={{
                  p: 1.5,
                  borderRadius: '12px',
                  bgcolor: '#FFF8FA',
                  border: '1px solid #F8BBD0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 1.5,
                }}
              >
                <Box
                  sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer' }}
                  onClick={() => setSelectedCustomer(c)}
                >
                  <Avatar src={c.photoUrl} alt={c.fullName} sx={{ width: 40, height: 40, border: '2px solid #D81B60' }} />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 800, color: '#2D1F24' }}>
                      {c.fullName}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#6E5C63' }}>
                      {c.phone} • <span style={{ color: '#D81B60', fontWeight: 700 }}>25% OFF Offer</span>
                    </Typography>
                  </Box>
                </Box>

                <Button
                  size="small"
                  variant="contained"
                  startIcon={<WhatsAppIcon sx={{ fontSize: 16 }} />}
                  onClick={() => sendBirthdayWish(c)}
                  sx={{
                    bgcolor: '#25D366',
                    color: '#FFFFFF',
                    fontWeight: 800,
                    fontSize: '0.75rem',
                    borderRadius: '8px',
                    '&:hover': { bgcolor: '#128C7E' },
                  }}
                >
                  Send Wish
                </Button>
              </Paper>
            ))}
          </Box>
        )}
      </Box>

      {/* This Week's Birthdays */}
      <Box>
        <Typography variant="caption" sx={{ color: '#6A3F4D', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', mb: 1, display: 'block' }}>
          🗓️ This Week's Birthdays ({weekBirthdays.length})
        </Typography>

        {weekBirthdays.length === 0 ? (
          <Typography variant="body2" sx={{ color: '#6E5C63', fontStyle: 'italic', fontSize: '0.85rem' }}>
            No upcoming birthdays later this week.
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {weekBirthdays.slice(0, 4).map((c) => (
              <Box
                key={c.id}
                sx={{
                  p: 1.2,
                  borderRadius: '10px',
                  bgcolor: '#F8F4EE',
                  border: '1px solid #E8DFD5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, cursor: 'pointer' }} onClick={() => setSelectedCustomer(c)}>
                  <Avatar src={c.photoUrl} alt={c.fullName} sx={{ width: 32, height: 32 }} />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#2D1F24', fontSize: '0.85rem' }}>
                      {c.fullName}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#6E5C63' }}>
                      {c.birthdayFormatted} ({c.membership.tier} Tier)
                    </Typography>
                  </Box>
                </Box>

                <Button
                  size="small"
                  startIcon={<EventIcon sx={{ fontSize: 14 }} />}
                  onClick={() => sendBirthdayWish(c)}
                  sx={{ color: '#6A3F4D', fontSize: '0.72rem', fontWeight: 700 }}
                >
                  Wish
                </Button>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Paper>
  );
};
