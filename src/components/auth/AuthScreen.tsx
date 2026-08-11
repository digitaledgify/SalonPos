import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Tabs,
  Tab,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
} from '@mui/material';
import SpaIcon from '@mui/icons-material/Spa';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useAuth } from '../../context/AuthContext';

export const AuthScreen: React.FC = () => {
  const { signIn, signUpNewSalon, authError } = useAuth();

  const [tab, setTab] = useState<0 | 1>(0);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Sign in fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Sign up fields
  const [salonName, setSalonName] = useState('');
  const [salonCode, setSalonCode] = useState('');
  const [adminName, setAdminName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupSuccess, setSignupSuccess] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await signIn(loginEmail.trim(), loginPassword);
    setSubmitting(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSignupSuccess(false);
    const ok = await signUpNewSalon({
      salonName: salonName.trim(),
      salonCode: salonCode.trim().toUpperCase(),
      adminName: adminName.trim(),
      email: signupEmail.trim(),
      password: signupPassword,
    });
    setSubmitting(false);
    if (ok) setSignupSuccess(true);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#F8F4EE',
        p: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 460,
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 24px 48px rgba(0,0,0,0.12)',
        }}
      >
        <Box sx={{ bgcolor: '#6A3F4D', color: '#F8F4EE', p: 4, textAlign: 'center' }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '16px',
              bgcolor: '#FFFFFF',
              color: '#6A3F4D',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 1.5,
            }}
          >
            <SpaIcon sx={{ fontSize: 32 }} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>
            Salon POS Software
          </Typography>
          <Typography variant="caption" sx={{ color: '#EBD9DF' }}>
            Multi-Salon SaaS Point of Sale & Management Platform
          </Typography>
        </Box>

        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          variant="fullWidth"
          sx={{ borderBottom: '1px solid #E8DFD5' }}
        >
          <Tab label="Sign In" sx={{ textTransform: 'none', fontWeight: 700 }} />
          <Tab label="New Salon Sign Up" sx={{ textTransform: 'none', fontWeight: 700 }} />
        </Tabs>

        <Box sx={{ p: 4 }}>
          {authError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {authError}
            </Alert>
          )}

          {tab === 0 && (
            <Box component="form" onSubmit={handleSignIn} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="body2" sx={{ color: '#6E5C63' }}>
                Sign in with the email and password your salon Admin gave you.
              </Typography>
              <TextField
                label="Email"
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                fullWidth
              />
              <TextField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                fullWidth
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword((s) => !s)} edge="end">
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={submitting}
                sx={{ bgcolor: '#6A3F4D', '&:hover': { bgcolor: '#5A3541' }, borderRadius: '12px', py: 1.2 }}
              >
                {submitting ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : 'Sign In'}
              </Button>
            </Box>
          )}

          {tab === 1 && (
            <Box component="form" onSubmit={handleSignUp} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {signupSuccess ? (
                <Alert severity="success">
                  Salon created! Check your email to confirm your account, then sign in from the "Sign In" tab.
                </Alert>
              ) : (
                <>
                  <Typography variant="body2" sx={{ color: '#6E5C63' }}>
                    Setting up a new salon creates your Admin account automatically.
                  </Typography>
                  <TextField
                    label="Salon Name"
                    required
                    value={salonName}
                    onChange={(e) => setSalonName(e.target.value)}
                    fullWidth
                  />
                  <TextField
                    label="Salon Code (short, unique — e.g. GLAM01)"
                    required
                    value={salonCode}
                    onChange={(e) => setSalonCode(e.target.value)}
                    fullWidth
                  />
                  <TextField
                    label="Your Name (Admin)"
                    required
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    fullWidth
                  />
                  <TextField
                    label="Email"
                    type="email"
                    required
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    fullWidth
                  />
                  <TextField
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    fullWidth
                    helperText="At least 6 characters"
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={submitting}
                    sx={{ bgcolor: '#6A3F4D', '&:hover': { bgcolor: '#5A3541' }, borderRadius: '12px', py: 1.2 }}
                  >
                    {submitting ? <CircularProgress size={22} sx={{ color: '#fff' }} /> : 'Create Salon & Admin Account'}
                  </Button>
                </>
              )}
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};
