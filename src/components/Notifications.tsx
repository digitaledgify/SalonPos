import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  IconButton,
  Button,
  Chip,
  Tooltip,
} from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useDashboard } from '../context/DashboardContext';
import { NotificationCategory } from '../types';

const getNotificationIcon = (category: NotificationCategory) => {
  switch (category) {
    case 'appointment':
      return <CalendarMonthIcon sx={{ fontSize: 18, color: '#2B6CB0' }} />;
    case 'inventory':
      return <InventoryIcon sx={{ fontSize: 18, color: '#C53030' }} />;
    case 'sales':
      return <ShowChartIcon sx={{ fontSize: 18, color: '#2F855A' }} />;
    case 'customer':
      return <PersonAddIcon sx={{ fontSize: 18, color: '#8C5200' }} />;
    default:
      return <NotificationsActiveIcon sx={{ fontSize: 18, color: '#6A3F4D' }} />;
  }
};

export const Notifications: React.FC = () => {
  const { notifications, markNotificationAsRead, clearNotifications } = useDashboard();

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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
              <NotificationsActiveIcon sx={{ fontSize: 20 }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#2D1F24', fontSize: '1.05rem' }}>
              System Alerts & Updates
            </Typography>
          </Box>

          {notifications.length > 0 && (
            <Button
              size="small"
              startIcon={<DeleteSweepIcon sx={{ fontSize: '16px !important' }} />}
              onClick={clearNotifications}
              sx={{ color: '#6E5C63', fontSize: '0.75rem' }}
            >
              Clear All
            </Button>
          )}
        </Box>

        {notifications.length === 0 ? (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: '#6E5C63' }}>
              All caught up! No active notifications.
            </Typography>
          </Box>
        ) : (
          <Stack spacing={1.2}>
            {notifications.map((item) => (
              <Box
                key={item.id}
                sx={{
                  p: 1.5,
                  borderRadius: '12px',
                  bgcolor: item.read ? '#F8F4EE' : '#FFFFFF',
                  border: item.read ? '1px solid #E8DFD5' : '1px solid #A8828F',
                  boxShadow: item.read ? 'none' : '0 2px 10px rgba(198, 167, 125, 0.15)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: 1.5,
                  transition: 'all 0.2s ease',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.2 }}>
                  <Box
                    sx={{
                      p: 0.8,
                      borderRadius: '8px',
                      bgcolor: '#F8F4EE',
                      border: '1px solid #E8DFD5',
                      display: 'flex',
                    }}
                  >
                    {getNotificationIcon(item.category)}
                  </Box>

                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: item.read ? 600 : 800, color: '#2D1F24' }}>
                        {item.title}
                      </Typography>
                      {!item.read && (
                        <Chip
                          label="NEW"
                          size="small"
                          sx={{ height: 16, fontSize: '0.6rem', fontWeight: 800, bgcolor: '#A8828F', color: '#FFFFFF' }}
                        />
                      )}
                    </Box>
                    <Typography variant="caption" sx={{ color: '#6E5C63', display: 'block', mt: 0.3 }}>
                      {item.message}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#9E8D93', fontSize: '0.68rem', mt: 0.2, display: 'block' }}>
                      {item.time}
                    </Typography>
                  </Box>
                </Box>

                {!item.read && (
                  <Tooltip title="Mark as Read">
                    <IconButton size="small" onClick={() => markNotificationAsRead(item.id)} sx={{ color: '#2F855A' }}>
                      <CheckCircleOutlinedIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};
