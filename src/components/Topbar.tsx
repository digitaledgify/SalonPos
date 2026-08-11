import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  InputBase,
  IconButton,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Chip,
  Tooltip,
  useTheme,
  useMediaQuery,
  Paper,
  Divider,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MenuIcon from '@mui/icons-material/Menu';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import RefreshIcon from '@mui/icons-material/Refresh';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import KeyIcon from '@mui/icons-material/Key';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import StorefrontIcon from '@mui/icons-material/Storefront';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import { useDashboard } from '../context/DashboardContext';
import { getCurrentFormattedDate } from '../utils/formatters';

export const Topbar: React.FC = () => {
  const theme = useTheme();
  const isTabletOrMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const {
    role,
    currentUser,
    searchQuery,
    setSearchQuery,
    notifications,
    setIsMobileSidebarOpen,
    setIsLoginModalOpen,
    logout,
    setRole,
    showToast,
    activeOutlet,
  } = useDashboard();

  const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setProfileAnchorEl(null);
  };

  const handleOpenLoginScreen = () => {
    handleProfileClose();
    setIsLoginModalOpen(true);
  };

  const handleLogout = () => {
    handleProfileClose();
    logout();
  };

  const handleQuickSwitch = (newRole: 'Admin' | 'Reception' | 'Stylist') => {
    handleProfileClose();
    setRole(newRole);
  };

  const handleRefresh = () => {
    showToast('Dashboard metrics re-synced with latest POS data!');
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: '#FFFFFF',
        color: '#2D1F24',
        borderBottom: '1px solid #E8DFD5',
        py: 0.5,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 3 } }}>
        {/* Left Side: Mobile Toggle + Date */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {isTabletOrMobile && (
            <IconButton
              onClick={() => setIsMobileSidebarOpen(true)}
              edge="start"
              sx={{ color: '#6A3F4D' }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1 }}>
            <CalendarTodayIcon sx={{ fontSize: 18, color: '#6A3F4D' }} />
            <Typography
              variant="body2"
              sx={{
                fontFamily: '"Inter", sans-serif',
                fontWeight: 400,
                color: '#6A3F4D',
                fontSize: { xs: '0.8rem', md: '0.9rem' },
              }}
            >
              {getCurrentFormattedDate()}
            </Typography>
          </Box>
        </Box>

        {/* Center: Search Box */}
        <Paper
          elevation={0}
          sx={{
            display: 'flex',
            alignItems: 'center',
            bgcolor: '#F8F4EE',
            border: '1px solid #E8DFD5',
            borderRadius: '24px',
            px: 2,
            py: 0.5,
            width: { xs: '180px', sm: '260px', md: '360px' },
            transition: 'all 0.2s ease',
            '&:focus-within': {
              borderColor: '#6A3F4D',
              boxShadow: '0 2px 10px rgba(106, 63, 77, 0.15)',
              bgcolor: '#FFFFFF',
            },
          }}
        >
          <SearchIcon sx={{ color: '#6E5C63', mr: 1, fontSize: 20 }} />
          <InputBase
            placeholder="Search invoice, customer, stylist..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              fontFamily: '"Inter", sans-serif',
              fontSize: '0.88rem',
              width: '100%',
              color: '#2D1F24',
              '& input::placeholder': {
                color: '#9E8D93',
                opacity: 1,
              },
            }}
          />
        </Paper>

        {/* Right Side: Actions + Role Badge + Profile */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
          <Tooltip title="Refresh POS Data">
            <IconButton onClick={handleRefresh} sx={{ color: '#6A3F4D' }}>
              <RefreshIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Tooltip>

          {/* Notifications Icon with Badge */}
          <IconButton
            onClick={handleNotificationClick}
            sx={{ color: '#6A3F4D', bgcolor: '#F8F4EE', border: '1px solid #E8DFD5' }}
          >
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsIcon sx={{ fontSize: 20 }} />
            </Badge>
          </IconButton>

          {/* Active Salon Outlet Chip */}
          <Chip
            icon={<StorefrontIcon sx={{ fontSize: '16px !important', color: '#6A3F4D' }} />}
            label={activeOutlet.name}
            size="small"
            sx={{
              display: { xs: 'none', sm: 'inline-flex' },
              bgcolor: '#F8F4EE',
              color: '#2D1F24',
              border: '1px solid #E8DFD5',
              fontWeight: 700,
              fontFamily: '"Inter", sans-serif',
              fontSize: '0.75rem',
            }}
          />

          {/* Role Chip Indicator */}
          <Chip
            label={`Role: ${currentUser?.role || role}`}
            size="small"
            onClick={handleOpenLoginScreen}
            sx={{
              display: { xs: 'none', md: 'inline-flex' },
              bgcolor: '#EBD9DF',
              color: '#6A3F4D',
              fontWeight: 700,
              fontFamily: '"Inter", sans-serif',
              fontSize: '0.75rem',
              cursor: 'pointer',
              '&:hover': { bgcolor: '#D9C5CB' },
            }}
          />

          {/* User Profile Avatar with Click Handler */}
          <Box
            onClick={handleProfileClick}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              ml: 0.5,
              cursor: 'pointer',
              p: 0.5,
              borderRadius: '12px',
              transition: 'all 0.2s ease',
              '&:hover': { bgcolor: '#F8F4EE' },
            }}
          >
            <Avatar
              alt={currentUser?.name || 'User'}
              src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
              sx={{
                width: 38,
                height: 38,
                border: '2px solid #EBD9DF',
                boxShadow: '0 2px 8px rgba(106, 63, 77, 0.15)',
              }}
            />
            <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 700,
                  lineHeight: 1.1,
                  color: '#2D1F24',
                }}
              >
                {currentUser?.name || 'Priya Roy'}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontFamily: '"Inter", sans-serif',
                  color: '#6E5C63',
                  fontSize: '0.72rem',
                }}
              >
                {currentUser?.designation || (role === 'Admin' ? 'Salon Manager' : role === 'Reception' ? 'Front Desk Lead' : 'Senior Stylist')}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* User Profile Menu */}
        <Menu
          anchorEl={profileAnchorEl}
          open={Boolean(profileAnchorEl)}
          onClose={handleProfileClose}
          slotProps={{
            paper: {
              sx: {
                width: 280,
                borderRadius: '16px',
                mt: 1.5,
                p: 1.5,
                boxShadow: '0 12px 32px rgba(45, 31, 36, 0.18)',
                border: '1px solid #E8DFD5',
              },
            },
          }}
        >
          <Box sx={{ p: 1, mb: 1, textAlign: 'center', bgcolor: '#F8F4EE', borderRadius: '12px' }}>
            <Avatar
              src={currentUser?.avatarUrl}
              sx={{ width: 52, height: 52, mx: 'auto', mb: 1, border: '2px solid #6A3F4D' }}
            />
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#2D1F24' }}>
              {currentUser?.name}
            </Typography>
            <Typography variant="caption" sx={{ color: '#6A3F4D', fontWeight: 700, display: 'block' }}>
              {currentUser?.designation}
            </Typography>
            <Chip
              label={`Role: ${currentUser?.role}`}
              size="small"
              sx={{
                mt: 0.8,
                bgcolor: '#6A3F4D',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '0.68rem',
                height: 20,
              }}
            />
          </Box>

          <Divider sx={{ my: 1 }} />

          <Typography
            variant="caption"
            sx={{ px: 1, py: 0.5, color: '#6E5C63', fontWeight: 700, fontSize: '0.68rem', textTransform: 'uppercase', display: 'block' }}
          >
            Switch Active Access Role:
          </Typography>

          <MenuItem onClick={() => handleQuickSwitch('Admin')} selected={role === 'Admin'}>
            <ListItemIcon><SupervisorAccountIcon sx={{ color: '#6A3F4D', fontSize: 18 }} /></ListItemIcon>
            <ListItemText primary="Admin (Manager)" slotProps={{ primary: { sx: { fontSize: '0.85rem', fontWeight: 600 } } }} />
          </MenuItem>

          <MenuItem onClick={() => handleQuickSwitch('Reception')} selected={role === 'Reception'}>
            <ListItemIcon><SupportAgentIcon sx={{ color: '#0288D1', fontSize: 18 }} /></ListItemIcon>
            <ListItemText primary="Receptionist (POS)" slotProps={{ primary: { sx: { fontSize: '0.85rem', fontWeight: 600 } } }} />
          </MenuItem>

          <MenuItem onClick={() => handleQuickSwitch('Stylist')} selected={role === 'Stylist'}>
            <ListItemIcon><ContentCutIcon sx={{ color: '#2E7D32', fontSize: 18 }} /></ListItemIcon>
            <ListItemText primary="Stylist (Schedule)" slotProps={{ primary: { sx: { fontSize: '0.85rem', fontWeight: 600 } } }} />
          </MenuItem>

          <Divider sx={{ my: 1 }} />

          <MenuItem onClick={handleOpenLoginScreen}>
            <ListItemIcon><KeyIcon sx={{ color: '#6A3F4D', fontSize: 18 }} /></ListItemIcon>
            <ListItemText primary="Switch Staff Login Access" slotProps={{ primary: { sx: { fontSize: '0.85rem', fontWeight: 700, color: '#6A3F4D' } } }} />
          </MenuItem>

          <MenuItem onClick={handleLogout}>
            <ListItemIcon><LockOutlinedIcon sx={{ color: '#D32F2F', fontSize: 18 }} /></ListItemIcon>
            <ListItemText primary="Lock / Sign Out Session" slotProps={{ primary: { sx: { fontSize: '0.85rem', fontWeight: 700, color: '#D32F2F' } } }} />
          </MenuItem>
        </Menu>

        {/* Notifications Popover Menu */}
        <Menu
          anchorEl={notificationAnchorEl}
          open={Boolean(notificationAnchorEl)}
          onClose={handleNotificationClose}
          slotProps={{
            paper: {
              sx: {
                width: 320,
                maxHeight: 400,
                borderRadius: '16px',
                mt: 1.5,
                p: 1,
                boxShadow: '0 8px 30px rgba(107, 79, 58, 0.12)',
              },
            },
          }}
        >
          <Box sx={{ px: 2, py: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              Notifications ({unreadCount} New)
            </Typography>
          </Box>
          {notifications.length === 0 ? (
            <MenuItem sx={{ py: 2, justifyContent: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                No notifications right now
              </Typography>
            </MenuItem>
          ) : (
            notifications.slice(0, 4).map((item) => (
              <MenuItem
                key={item.id}
                onClick={handleNotificationClose}
                sx={{
                  borderRadius: '8px',
                  mb: 0.5,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  bgcolor: item.read ? 'transparent' : '#F8F4EE',
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: item.read ? 500 : 700 }}>
                  {item.title}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'normal', mt: 0.5 }}>
                  {item.message}
                </Typography>
              </MenuItem>
            ))
          )}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};
