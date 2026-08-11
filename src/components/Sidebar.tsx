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
  FormControl,
  Select,
  MenuItem,
  Chip,
  SelectChangeEvent,
  Paper,
  useTheme,
  useMediaQuery,
  Button,
  Tooltip,
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
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import StorefrontIcon from '@mui/icons-material/Storefront';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import KeyIcon from '@mui/icons-material/Key';
import { useDashboard } from '../context/DashboardContext';
import { UserRole } from '../types';

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
    setRole,
    currentUser,
    setIsLoginModalOpen,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
    activeNavItem,
    setActiveNavItem,
    showToast,
    outlets,
    activeOutlet,
    switchOutlet,
    setIsNewOutletModalOpen,
  } = useDashboard();

  const handleRoleChange = (event: SelectChangeEvent) => {
    setRole(event.target.value as UserRole);
  };

  const handleOutletChange = (event: SelectChangeEvent) => {
    switchOutlet(event.target.value as string);
  };

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
            <Typography
              variant="caption"
              sx={{
                fontFamily: '"Inter", sans-serif',
                fontSize: '0.62rem',
                fontWeight: 700,
                letterSpacing: '0.14em',
                color: '#6A3F4D',
                textTransform: 'uppercase',
                display: 'block',
              }}
            >
              Multi-Salon Platform
            </Typography>
          </Box>
        </Box>

        {/* Multi-Tenant Salon Outlet Switcher Card */}
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
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.8 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
              <StorefrontIcon sx={{ fontSize: 16, color: '#6A3F4D' }} />
              <Typography variant="caption" sx={{ fontWeight: 800, color: '#2D1F24', fontSize: '0.68rem', textTransform: 'uppercase' }}>
                Active Salon Outlet
              </Typography>
            </Box>
            <Chip
              label={activeOutlet.code}
              size="small"
              sx={{ height: 18, fontSize: '0.65rem', fontWeight: 800, bgcolor: '#EBD9DF', color: '#6A3F4D' }}
            />
          </Box>

          <FormControl fullWidth size="small">
            <Select
              value={activeOutlet.id}
              onChange={handleOutletChange}
              displayEmpty
              sx={{
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: '#2D1F24',
                bgcolor: '#F8F4EE',
                '& .MuiSelect-select': { py: 0.8 },
              }}
            >
              {outlets.map((outlet) => (
                <MenuItem key={outlet.id} value={outlet.id}>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.82rem', color: '#2D1F24', lineHeight: 1.2 }}>
                      {outlet.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#6E5C63', fontSize: '0.68rem' }}>
                      {outlet.type} • {outlet.city}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            fullWidth
            size="small"
            variant="text"
            onClick={() => setIsNewOutletModalOpen(true)}
            startIcon={<AddBusinessIcon sx={{ fontSize: 15 }} />}
            sx={{
              mt: 0.8,
              fontSize: '0.72rem',
              fontWeight: 800,
              color: '#6A3F4D',
              textTransform: 'none',
              py: 0.3,
              '&:hover': { bgcolor: 'rgba(106, 63, 77, 0.08)' },
            }}
          >
            + Sell / Add New Salon Client
          </Button>
        </Paper>
      </Box>

      <Divider sx={{ borderColor: 'rgba(106, 63, 77, 0.12)', mx: 2, mb: 1 }} />

      {/* Navigation Links */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', px: 1.5, py: 0.5 }}>
        <List disablePadding>
          {NAV_ITEMS.map((item) => {
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

      {/* Role Switcher & Staff Login Section at Bottom */}
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
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SupervisorAccountIcon sx={{ fontSize: 18, color: '#6A3F4D' }} />
              <Typography variant="caption" sx={{ fontFamily: '"Inter", sans-serif', fontWeight: 700, color: '#6A3F4D', opacity: 0.8, textTransform: 'uppercase' }}>
                Active Role
              </Typography>
            </Box>
            <Chip label={role} size="small" sx={{ height: 18, fontSize: '0.65rem', fontWeight: 800, bgcolor: '#EBD9DF', color: '#6A3F4D' }} />
          </Box>

          <FormControl fullWidth size="small" sx={{ mb: 1.5 }}>
            <Select
              value={role}
              onChange={handleRoleChange}
              displayEmpty
              sx={{
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontFamily: '"Inter", sans-serif',
                fontWeight: 600,
                color: '#6A3F4D',
                bgcolor: '#F8F4EE',
                '& .MuiSelect-select': {
                  py: 1,
                },
              }}
            >
              <MenuItem value="Admin">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip label="Admin" size="small" color="primary" sx={{ height: 18, fontSize: '0.65rem' }} />
                </Box>
              </MenuItem>
              <MenuItem value="Reception">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip label="Reception" size="small" color="secondary" sx={{ height: 18, fontSize: '0.65rem' }} />
                </Box>
              </MenuItem>
              <MenuItem value="Stylist">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip label="Stylist" size="small" sx={{ height: 18, fontSize: '0.65rem', bgcolor: '#EBD9DF', color: '#6A3F4D' }} />
                </Box>
              </MenuItem>
            </Select>
          </FormControl>

          <Button
            fullWidth
            size="small"
            variant="outlined"
            onClick={() => setIsLoginModalOpen(true)}
            startIcon={<KeyIcon sx={{ fontSize: 16 }} />}
            sx={{
              borderRadius: '8px',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#6A3F4D',
              borderColor: '#6A3F4D',
              textTransform: 'none',
              py: 0.5,
              '&:hover': {
                bgcolor: 'rgba(106, 63, 77, 0.08)',
                borderColor: '#6A3F4D',
              },
            }}
          >
            Staff Login Gateway
          </Button>
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

