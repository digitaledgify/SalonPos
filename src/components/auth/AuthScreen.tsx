import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
} from '@mui/material';
import SpaIcon from '@mui/icons-material/Spa';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useAuth } from '../../context/AuthContext';

interface AuthScreenProps {
  /** When false (default, used on the public route), the "New Salon Sign Up"
   *  tab is hidden entirely — customers only ever see Sign In. */
  allowSignUp?: boolean;
}

export const AuthScreen: React.FC<AuthScreenProps> = () => {
  const { signIn, authError } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Sign in fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await signIn(loginEmail.trim(), loginPassword);
    setSubmitting(false);
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

        <Box sx={{ p: 4 }}>
          {authError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {authError}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSignIn} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="body2" sx={{ color: '#6E5C63' }}>
                Sign in with the User ID or email and password provided to you by your Salon POS administrator.
              </Typography>
              <TextField
                label="User ID or Email"
                type="text"
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
        </Box>
      </Paper>
    </Box>
  );
};
