import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Avatar,
  Chip,
  TextField,
  IconButton,
  InputAdornment,
  Alert,
  Divider,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import SpaIcon from '@mui/icons-material/Spa';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import KeyIcon from '@mui/icons-material/Key';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ShieldIcon from '@mui/icons-material/Shield';
import { useDashboard } from '../../context/DashboardContext';
import { DEMO_USERS, ROLE_DETAILS } from '../../constants/users';
import { UserAccount, UserRole } from '../../types';

interface LoginModalProps {
  open: boolean;
  onClose?: () => void;
  canDismiss?: boolean;
}

export const LoginModal: React.FC<LoginModalProps> = ({ open, onClose, canDismiss = false }) => {
  const { loginWithPin, directLogin, isAuthenticated } = useDashboard();

  const [selectedRole, setSelectedRole] = useState<UserRole>('Admin');
  const [pin, setPin] = useState<string>('');
  const [showPin, setShowPin] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState<number>(0);

  const selectedUser: UserAccount =
    DEMO_USERS.find((u) => u.role === selectedRole) || DEMO_USERS[0];
  const roleMeta = ROLE_DETAILS[selectedRole];

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setPin('');
    setErrorMsg(null);
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!pin.trim()) {
      setErrorMsg('Please enter your 4-digit PIN code.');
      return;
    }

    const success = loginWithPin(selectedRole, pin.trim());
    if (!success) {
      setErrorMsg(`Incorrect PIN code for ${selectedRole}. Try "${roleMeta.defaultPin}"`);
    } else {
      setPin('');
      if (onClose) onClose();
    }
  };

  const handleQuickDemoFill = () => {
    setPin(roleMeta.defaultPin);
    setErrorMsg(null);
  };

  const handleDirectOneClickLogin = (user: UserAccount) => {
    directLogin(user);
    if (onClose) onClose();
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'Admin':
        return <SupervisorAccountIcon sx={{ fontSize: 28 }} />;
      case 'Reception':
        return <SupportAgentIcon sx={{ fontSize: 28 }} />;
      case 'Stylist':
        return <ContentCutIcon sx={{ fontSize: 28 }} />;
      default:
        return <ShieldIcon sx={{ fontSize: 28 }} />;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={canDismiss && isAuthenticated ? onClose : undefined}
      maxWidth="md"
      fullWidth
      slotProps={{
        backdrop: {
          sx: {
            backdropFilter: 'blur(8px)',
            bgcolor: 'rgba(45, 31, 36, 0.75)',
          },
        },
        paper: {
          sx: {
            borderRadius: '24px',
            bgcolor: '#F8F4EE',
            backgroundImage: 'none',
            overflow: 'hidden',
            boxShadow: '0 24px 48px rgba(0, 0, 0, 0.25)',
          },
        },
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        {/* Top Header Banner */}
        <Box
          sx={{
            bgcolor: '#6A3F4D',
            color: '#F8F4EE',
            p: { xs: 3, sm: 4 },
            textAlign: 'center',
            position: 'relative',
          }}
        >
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 56,
              height: 56,
              borderRadius: '16px',
              bgcolor: '#FFFFFF',
              color: '#6A3F4D',
              mb: 1.5,
              boxShadow: '0 6px 16px rgba(0,0,0,0.18)',
            }}
          >
            <SpaIcon sx={{ fontSize: 32 }} />
          </Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              fontFamily: '"Poppins", sans-serif',
              letterSpacing: '-0.02em',
              fontSize: { xs: '1.5rem', sm: '1.85rem' },
            }}
          >
            SALON POS SOFTWARE
          </Typography>
          <Typography
            variant="subtitle2"
            sx={{
              color: '#EBD9DF',
              fontWeight: 500,
              fontSize: '0.85rem',
              letterSpacing: '0.05em',
              mt: 0.5,
              textTransform: 'uppercase',
            }}
          >
            Multi-Salon SaaS Point of Sale & Management Platform
          </Typography>

          {canDismiss && isAuthenticated && (
            <IconButton
              onClick={onClose}
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                color: '#EBD9DF',
                bgcolor: 'rgba(255,255,255,0.1)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' },
              }}
            >
              ✕
            </IconButton>
          )}
        </Box>

        {/* Modal Navigation Tabs */}
        <Box sx={{ borderBottom: '1px solid #E8DFD5', bgcolor: '#FFFFFF', px: 3 }}>
          <Tabs
            value={tabValue}
            onChange={(_, newValue) => setTabValue(newValue)}
            sx={{
              '& .MuiTab-root': {
                fontWeight: 700,
                fontSize: '0.9rem',
                textTransform: 'none',
                py: 2,
                color: '#6E5C63',
                '&.Mui-selected': {
                  color: '#6A3F4D',
                },
              },
              '& .MuiTabs-indicator': {
                bgcolor: '#6A3F4D',
                height: 3,
                borderRadius: '3px 3px 0 0',
              },
            }}
          >
            <Tab label="Staff Login Access" />
            <Tab label="Role Permissions Matrix" />
          </Tabs>
        </Box>

        {/* Tab 0: Login Selection */}
        {tabValue === 0 && (
          <Box sx={{ p: { xs: 2.5, sm: 4 } }}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 800, color: '#2D1F24', mb: 2, textAlign: 'center' }}
            >
              Select Your Role Access Level:
            </Typography>

            {/* 3 Role Selection Cards */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {DEMO_USERS.map((user) => {
                const isSelected = selectedRole === user.role;
                const meta = ROLE_DETAILS[user.role];

                return (
                  <Grid size={{ xs: 12, sm: 4 }} key={user.role}>
                    <Paper
                      elevation={0}
                      onClick={() => handleRoleSelect(user.role)}
                      sx={{
                        p: 2,
                        borderRadius: '16px',
                        cursor: 'pointer',
                        border: isSelected
                          ? `2px solid ${meta.color}`
                          : '1px solid #E8DFD5',
                        bgcolor: isSelected ? meta.bgColor : '#FFFFFF',
                        transition: 'all 0.25s ease',
                        boxShadow: isSelected
                          ? '0 8px 24px rgba(106, 63, 77, 0.12)'
                          : '0 2px 8px rgba(0,0,0,0.02)',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 6px 18px rgba(0,0,0,0.08)',
                          borderColor: meta.color,
                        },
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%',
                        position: 'relative',
                      }}
                    >
                      {isSelected && (
                        <Chip
                          icon={<CheckCircleOutlinedIcon sx={{ fontSize: '14px !important' }} />}
                          label="Selected"
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: 12,
                            right: 12,
                            bgcolor: meta.color,
                            color: '#FFFFFF',
                            fontWeight: 700,
                            fontSize: '0.65rem',
                            height: 20,
                            '& .MuiChip-icon': { color: '#FFFFFF' },
                          }}
                        />
                      )}

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                        <Avatar
                          src={user.avatarUrl}
                          sx={{
                            width: 44,
                            height: 44,
                            border: `2px solid ${meta.color}`,
                          }}
                        />
                        <Box sx={{ pr: 3 }}>
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 800, color: '#2D1F24', lineHeight: 1.2 }}
                          >
                            {user.name}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: meta.color,
                              fontWeight: 700,
                              fontSize: '0.72rem',
                              display: 'block',
                            }}
                          >
                            {meta.title}
                          </Typography>
                        </Box>
                      </Box>

                      <Typography
                        variant="caption"
                        sx={{
                          color: '#6E5C63',
                          fontSize: '0.75rem',
                          mb: 2,
                          flexGrow: 1,
                          lineHeight: 1.35,
                        }}
                      >
                        {meta.description}
                      </Typography>

                      <Divider sx={{ my: 1, opacity: 0.6 }} />

                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto' }}>
                        <Typography
                          variant="caption"
                          sx={{ fontWeight: 700, color: '#6E5C63', fontSize: '0.7rem' }}
                        >
                          PIN: <strong style={{ color: meta.color }}>{user.pin}</strong>
                        </Typography>
                        <Button
                          size="small"
                          variant={isSelected ? 'contained' : 'text'}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDirectOneClickLogin(user);
                          }}
                          sx={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            py: 0.3,
                            px: 1,
                            borderRadius: '8px',
                            bgcolor: isSelected ? meta.color : 'transparent',
                            color: isSelected ? '#FFFFFF' : meta.color,
                            '&:hover': {
                              bgcolor: isSelected ? meta.color : 'rgba(106, 63, 77, 0.08)',
                            },
                          }}
                        >
                          Fast Login
                        </Button>
                      </Box>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>

            {/* Password / PIN Authentication Box */}
            <Paper
              elevation={0}
              sx={{
                p: { xs: 2.5, sm: 3 },
                borderRadius: '20px',
                bgcolor: '#FFFFFF',
                border: `1.5px solid ${roleMeta.borderColor}`,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: { xs: 'flex-start', sm: 'center' },
                  justifyContent: 'space-between',
                  gap: 1.5,
                  mb: 2,
                  pb: 2,
                  borderBottom: '1px solid #E8DFD5',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '12px',
                      bgcolor: roleMeta.bgColor,
                      color: roleMeta.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {getRoleIcon(selectedRole)}
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#2D1F24' }}>
                      Logging in as {selectedUser.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: roleMeta.color, fontWeight: 700 }}>
                      {selectedUser.designation} ({selectedRole} Level)
                    </Typography>
                  </Box>
                </Box>

                <Button
                  size="small"
                  variant="outlined"
                  onClick={handleQuickDemoFill}
                  startIcon={<KeyIcon />}
                  sx={{
                    borderColor: roleMeta.color,
                    color: roleMeta.color,
                    fontWeight: 700,
                    fontSize: '0.78rem',
                    borderRadius: '8px',
                  }}
                >
                  Auto-fill PIN: {roleMeta.defaultPin}
                </Button>
              </Box>

              {errorMsg && (
                <Alert severity="error" sx={{ mb: 2, borderRadius: '12px', fontWeight: 600 }}>
                  {errorMsg}
                </Alert>
              )}

              <Box component="form" onSubmit={handlePinSubmit}>
                <Grid container spacing={2} sx={{ alignItems: 'center' }}>
                  <Grid size={{ xs: 12, sm: 7 }}>
                    <TextField
                      fullWidth
                      label={`${selectedRole} Security PIN / Password`}
                      placeholder={`Enter ${roleMeta.defaultPin}`}
                      type={showPin ? 'text' : 'password'}
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      size="small"
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <LockOutlinedIcon sx={{ color: roleMeta.color, fontSize: 20 }} />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={() => setShowPin(!showPin)} edge="end" size="small">
                                {showPin ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        },
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                          bgcolor: '#F8F4EE',
                          fontFamily: '"Poppins", sans-serif',
                          fontWeight: 700,
                          letterSpacing: showPin ? 'normal' : '0.2em',
                        },
                      }}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 5 }}>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      endIcon={<ArrowForwardIcon />}
                      sx={{
                        py: 1.1,
                        borderRadius: '12px',
                        bgcolor: roleMeta.color,
                        fontWeight: 800,
                        fontSize: '0.9rem',
                        boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
                        '&:hover': {
                          bgcolor: roleMeta.color,
                          opacity: 0.9,
                        },
                      }}
                    >
                      Unlock {selectedRole} Session
                    </Button>
                  </Grid>
                </Grid>

                {/* Direct 1-Click Access Shortcut Banner */}
                <Box
                  sx={{
                    mt: 2.5,
                    pt: 2,
                    borderTop: '1px dashed #E8DFD5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography variant="caption" sx={{ color: '#6E5C63', fontWeight: 600 }}>
                    ⚡ Instant Sandbox Access:
                  </Typography>
                  <Button
                    size="small"
                    onClick={() => handleDirectOneClickLogin(selectedUser)}
                    sx={{
                      fontWeight: 800,
                      color: roleMeta.color,
                      fontSize: '0.78rem',
                      textTransform: 'none',
                    }}
                  >
                    Bypass PIN & Enter as {selectedRole} →
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Box>
        )}

        {/* Tab 1: Permissions Breakdown */}
        {tabValue === 1 && (
          <Box sx={{ p: { xs: 2.5, sm: 4 } }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#2D1F24', mb: 1 }}>
              Role Authorization & Capabilities Guide
            </Typography>
            <Typography variant="body2" sx={{ color: '#6E5C63', mb: 3 }}>
              The salon software adapts UI controls, reports, and administrative menus depending on the active staff role.
            </Typography>

            <Grid container spacing={2}>
              {DEMO_USERS.map((user) => {
                const meta = ROLE_DETAILS[user.role];
                return (
                  <Grid size={{ xs: 12, md: 4 }} key={user.role}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2.5,
                        borderRadius: '16px',
                        bgcolor: '#FFFFFF',
                        border: `1px solid ${meta.borderColor}`,
                        height: '100%',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                        <Avatar src={user.avatarUrl} sx={{ width: 36, height: 36 }} />
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#2D1F24' }}>
                            {user.role} Role
                          </Typography>
                          <Typography variant="caption" sx={{ color: meta.color, fontWeight: 700 }}>
                            {user.name}
                          </Typography>
                        </Box>
                      </Box>

                      <Divider sx={{ my: 1.5 }} />

                      <Typography variant="caption" sx={{ fontWeight: 700, color: '#2D1F24', display: 'block', mb: 1 }}>
                        Granted System Permissions:
                      </Typography>

                      <List dense disablePadding>
                        {user.permissions.map((perm) => (
                          <ListItem key={perm} disableGutters sx={{ py: 0.3 }}>
                            <ListItemIcon sx={{ minWidth: 24, color: meta.color }}>
                              <CheckCircleOutlinedIcon sx={{ fontSize: 16 }} />
                            </ListItemIcon>
                            <ListItemText
                              primary={perm}
                              slotProps={{
                                primary: {
                                  sx: { fontSize: '0.78rem', color: '#2D1F24', fontWeight: 500 },
                                },
                              }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};
