import React from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Chip,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PeopleIcon from '@mui/icons-material/People';
import InventoryIcon from '@mui/icons-material/Inventory';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import BadgeIcon from '@mui/icons-material/Badge';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SettingsIcon from '@mui/icons-material/Settings';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import StorefrontIcon from '@mui/icons-material/Storefront';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import { useDashboard } from '../context/DashboardContext';
import { canAccessNavItem } from '../constants/permissions';

const NAV_ITEMS = [
  { text: 'Dashboard', icon: <DashboardIcon /> },
  { text: 'Appointments', icon: <CalendarMonthIcon /> },
  { text: 'Billing', icon: <ReceiptLongIcon /> },
  { text: 'Customers', icon: <PeopleIcon /> },
  { text: 'Inventory', icon: <InventoryIcon /> },
  { text: 'Services', icon: <ContentCutIcon /> },
  { text: 'Employees', icon: <BadgeIcon /> },
  { text: 'Expenses', icon: <AccountBalanceWalletIcon /> },
  { text: 'Reports', icon: <AssessmentIcon /> },
  { text: 'Settings', icon: <SettingsIcon /> },
];

export const Sidebar: React.FC = () => {
  const theme = useTheme();
  const isTabletOrMobile = useMediaQuery(theme.breakpoints.down('md'));
  const {
    role,
    currentUser,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
    activeNavItem,
    setActiveNavItem,
    showToast,
    activeOutlet,
  } = useDashboard();

  const visibleNavItems = NAV_ITEMS.filter((item) => canAccessNavItem(role, item.text));

  const handleNavClick = (itemText: string) => {
    setActiveNavItem(itemText);
    if (itemText !== 'Dashboard') {
      showToast(`Viewing ${itemText} context within ${activeOutlet.name}.`);
    }
    if (isTabletOrMobile) {
      setIsMobileSidebarOpen(false);
    }
  };

  const sidebarContent = (
    <Box
      sx={{
        width: 260,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#F8F4EE',
        borderRight: '1px solid rgba(106, 63, 77, 0.15)',
      }}
    >
      {/* Brand Header - Salon POS Software */}
      <Box sx={{ p: 2.5, pb: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: '12px',
              bgcolor: '#6A3F4D',
              color: '#F8F4EE',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(106, 63, 77, 0.25)',
            }}
          >
            <PointOfSaleIcon sx={{ fontSize: 26 }} />
          </Box>
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                fontSize: '1.25rem',
                color: '#2D1F24',
                fontFamily: '"Inter", sans-serif',
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
              }}
            >
              Salon POS
            </Typography>
          </Box>
        </Box>

        {/* Active Salon Info (static — a login belongs to exactly one salon) */}
        <Paper
          elevation={0}
          sx={{
            p: 1.2,
            bgcolor: '#FFFFFF',
            border: '1px solid rgba(106, 63, 77, 0.18)',
            borderRadius: '12px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
              <StorefrontIcon sx={{ fontSize: 16, color: '#6A3F4D' }} />
              <Typography variant="caption" sx={{ fontWeight: 800, color: '#2D1F24', fontSize: '0.68rem', textTransform: 'uppercase' }}>
                Your Salon
              </Typography>
            </Box>
            <Chip
              label={activeOutlet.code}
              size="small"
              sx={{ height: 18, fontSize: '0.65rem', fontWeight: 800, bgcolor: '#EBD9DF', color: '#6A3F4D' }}
            />
          </Box>
          <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.85rem', color: '#2D1F24', lineHeight: 1.3 }}>
            {activeOutlet.name}
          </Typography>
          {activeOutlet.city && (
            <Typography variant="caption" sx={{ color: '#6E5C63', fontSize: '0.72rem' }}>
              {activeOutlet.city}
            </Typography>
          )}
        </Paper>
      </Box>

      <Divider sx={{ borderColor: 'rgba(106, 63, 77, 0.12)', mx: 2, mb: 1 }} />

      {/* Navigation Links — filtered by the signed-in user's real role */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', px: 1.5, py: 0.5 }}>
        <List disablePadding>
          {visibleNavItems.map((item) => {
            const isSelected = activeNavItem === item.text;
            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  selected={isSelected}
                  onClick={() => handleNavClick(item.text)}
                  sx={{
                    borderRadius: '8px',
                    py: 1,
                    px: 2,
                    color: '#6A3F4D',
                    opacity: isSelected ? 1 : 0.8,
                    bgcolor: isSelected ? 'rgba(255, 255, 255, 0.85) !important' : 'transparent',
                    borderLeft: isSelected ? '4px solid #6A3F4D' : '4px solid transparent',
                    boxShadow: isSelected ? '0 2px 8px rgba(106, 63, 77, 0.08)' : 'none',
                    '&:hover': {
                      bgcolor: isSelected ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.45)',
                      opacity: 1,
                    },
                    transition: 'all 0.2s ease',
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: '#6A3F4D',
                      minWidth: 36,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    slotProps={{
                      primary: {
                        sx: {
                          fontFamily: '"Inter", sans-serif',
                          fontSize: '0.9rem',
                          fontWeight: isSelected ? 600 : 500,
                          color: '#6A3F4D',
                        },
                      },
                    }}
                  />
                  {item.text === 'Dashboard' && (
                    <Chip
                      label="Live"
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        bgcolor: '#6A3F4D',
                        color: '#F8F4EE',
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* Signed-in Staff Info */}
      <Box sx={{ p: 2, borderTop: '1px solid rgba(106, 63, 77, 0.12)', bgcolor: 'rgba(255, 255, 255, 0.25)' }}>
        <Paper
          elevation={0}
          sx={{
            p: 1.5,
            bgcolor: '#FFFFFF',
            border: '1px solid rgba(106, 63, 77, 0.15)',
            borderRadius: '12px',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SupervisorAccountIcon sx={{ fontSize: 18, color: '#6A3F4D' }} />
              <Box>
                <Typography variant="body2" sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 700, color: '#2D1F24', lineHeight: 1.2 }}>
                  {currentUser?.name || 'Signed in'}
                </Typography>
                <Typography variant="caption" sx={{ color: '#6E5C63', fontSize: '0.72rem' }}>
                  {currentUser?.designation || role}
                </Typography>
              </Box>
            </Box>
            <Chip label={role} size="small" sx={{ height: 18, fontSize: '0.65rem', fontWeight: 800, bgcolor: '#EBD9DF', color: '#6A3F4D' }} />
          </Box>
        </Paper>
      </Box>
    </Box>
  );

  if (isTabletOrMobile) {
    return (
      <Drawer
        anchor="left"
        open={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
        slotProps={{
          paper: { sx: { borderRadius: '0px 16px 16px 0px' } },
        }}
      >
        {sidebarContent}
      </Drawer>
    );
  }

  return sidebarContent;
};
