import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  Chip,
  Button,
  Tabs,
  Tab,
  Avatar,
} from '@mui/material';
import CakeIcon from '@mui/icons-material/Cake';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import PhoneIcon from '@mui/icons-material/Phone';
import { useDashboard } from '../context/DashboardContext';

export const BirthdayWidget: React.FC = () => {
  const { birthdays, showToast } = useDashboard();
  const [tabIndex, setTabIndex] = useState(0);

  const todayBirthdays = birthdays.filter((b) => b.isToday);
  const upcomingBirthdays = birthdays.filter((b) => !b.isToday);

  const activeList = tabIndex === 0 ? todayBirthdays : upcomingBirthdays;

  const handleSendWish = (name: string, phone: string) => {
    showToast(`20% Birthday Discount Coupon sent to ${name} (${phone}) via WhatsApp!`);
  };

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
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '10px',
                bgcolor: '#FFF8E6',
                color: '#D69E2E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #FFE8B6',
              }}
            >
              <CakeIcon sx={{ fontSize: 20 }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#2D1F24', fontSize: '1.05rem' }}>
              Customer Birthdays
            </Typography>
          </Box>
          <Chip
            label={`${todayBirthdays.length} Today`}
            size="small"
            sx={{ bgcolor: '#EBD9DF', color: '#2D1F24', fontWeight: 700 }}
          />
        </Box>

        <Tabs
          value={tabIndex}
          onChange={(_, val) => setTabIndex(val)}
          sx={{
            minHeight: 36,
            mb: 2,
            borderBottom: '1px solid #E8DFD5',
            '& .MuiTab-root': {
              minHeight: 36,
              fontSize: '0.82rem',
              fontWeight: 700,
              textTransform: 'none',
              color: '#6E5C63',
              '&.Mui-selected': {
                color: '#6A3F4D',
              },
            },
            '& .MuiTabs-indicator': {
              bgcolor: '#6A3F4D',
            },
          }}
        >
          <Tab label={`Today (${todayBirthdays.length})`} />
          <Tab label={`Upcoming (${upcomingBirthdays.length})`} />
        </Tabs>

        <Stack spacing={1.5}>
          {activeList.map((customer) => (
            <Box
              key={customer.id}
              sx={{
                p: 1.8,
                borderRadius: '14px',
                bgcolor: '#F8F4EE',
                border: '1px solid #E8DFD5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 1.5,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Avatar sx={{ bgcolor: '#A8828F', color: '#FFFFFF', width: 40, height: 40, fontWeight: 700 }}>
                  {customer.name.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#2D1F24' }}>
                    {customer.name}{' '}
                    <Typography component="span" variant="caption" sx={{ color: '#6E5C63', fontWeight: 600 }}>
                      ({customer.age} yrs)
                    </Typography>
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.2 }}>
                    <PhoneIcon sx={{ fontSize: 12, color: '#6E5C63' }} />
                    <Typography variant="caption" sx={{ color: '#6E5C63' }}>
                      {customer.phone}
                    </Typography>
                  </Box>

                  <Typography variant="caption" sx={{ color: '#6A3F4D', fontWeight: 600, display: 'block', mt: 0.2 }}>
                    Favs: {customer.preferredServices.join(', ')}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ textAlign: 'right' }}>
                <Chip
                  label={customer.birthDate}
                  size="small"
                  sx={{
                    height: 22,
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    bgcolor: customer.isToday ? '#FEFCBF' : '#EBF8FF',
                    color: customer.isToday ? '#8C5200' : '#2B6CB0',
                    border: '1px solid #E8DFD5',
                    mb: 0.8,
                    display: 'inline-flex',
                  }}
                />
                <Button
                  size="small"
                  variant="contained"
                  startIcon={<CardGiftcardIcon sx={{ fontSize: '13px !important' }} />}
                  onClick={() => handleSendWish(customer.name, customer.phone)}
                  sx={{
                    fontSize: '0.7rem',
                    py: 0.3,
                    px: 1,
                    display: 'block',
                    bgcolor: '#6A3F4D',
                    color: '#FFFFFF',
                  }}
                >
                  Send 20% Offer
                </Button>
              </Box>
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};
