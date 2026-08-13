import React, { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../../context/AuthContext';

const SUPER_ADMIN_EMAIL = (import.meta.env.VITE_SUPER_ADMIN_EMAIL || '').trim().toLowerCase();

export const SuperAdminDashboard: React.FC = () => {
  const { session, signOut } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ salonName: string; salonCode: string; userId: string; email: string; password: string } | null>(null);
  const [form, setForm] = useState({
    salonName: '',
    salonCode: '',
    ownerName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    password: '',
  });

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setSubmitting(true);
    try {
      const accessToken = session?.access_token;
      if (!accessToken) throw new Error('Your Super Admin session has expired. Please sign in again.');

      const response = await fetch('/api/onboard-salon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not onboard the salon.');

      setResult({
        salonName: data.salon.name,
        salonCode: data.salon.code,
        userId: data.admin.userId,
        email: data.admin.email,
        password: form.password,
      });
      setForm({ salonName: '', salonCode: '', ownerName: '', email: '', phone: '', address: '', city: '', password: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not onboard the salon.');
    } finally {
      setSubmitting(false);
    }
  };

  const copyCredentials = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(`Salon: ${result.salonName}\nUser ID: ${result.userId}\nEmail: ${result.email}\nPassword: ${result.password}`);
  };

  if (!SUPER_ADMIN_EMAIL || (session?.user?.email || '').toLowerCase() !== SUPER_ADMIN_EMAIL) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#F8F4EE', p: 3 }}>
        <Alert severity="error">This page is restricted to the Super Admin account.</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F8F4EE', p: { xs: 2, md: 4 } }}>
      <Box sx={{ maxWidth: 1100, mx: 'auto' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 48, height: 48, borderRadius: '14px', bgcolor: '#6A3F4D', color: '#fff', display: 'grid', placeItems: 'center' }}>
              <AdminPanelSettingsIcon />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#2D1F24' }}>Super Admin</Typography>
              <Typography variant="body2" sx={{ color: '#6E5C63' }}>Salon onboarding & account control</Typography>
            </Box>
          </Box>
          <Button startIcon={<LogoutIcon />} onClick={signOut} sx={{ color: '#6A3F4D', textTransform: 'none', fontWeight: 700 }}>Sign out</Button>
        </Box>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Card elevation={0} sx={{ borderRadius: '20px', border: '1px solid #E8DFD5' }}>
              <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                  <AddBusinessIcon sx={{ color: '#6A3F4D' }} />
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>Onboard New Salon</Typography>
                    <Typography variant="body2" sx={{ color: '#6E5C63' }}>Only you can verify and create a new salon.</Typography>
                  </Box>
                </Box>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField label="Salon Name" required value={form.salonName} onChange={update('salonName')} />
                  <TextField label="Salon Code" required value={form.salonCode} onChange={update('salonCode')} helperText="Example: GLAM01. This becomes part of the Admin User ID." />
                  <TextField label="Admin Name" required value={form.ownerName} onChange={update('ownerName')} />
                  <TextField label="Admin Email" type="email" required value={form.email} onChange={update('email')} />
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6 }}><TextField label="Phone" fullWidth value={form.phone} onChange={update('phone')} /></Grid>
                    <Grid size={{ xs: 12, sm: 6 }}><TextField label="City" fullWidth value={form.city} onChange={update('city')} /></Grid>
                  </Grid>
                  <TextField label="Address" multiline minRows={2} value={form.address} onChange={update('address')} />
                  <TextField label="Temporary Password" type="password" required value={form.password} onChange={update('password')} helperText="At least 6 characters. Give this to the salon Admin securely." />
                  <Button type="submit" variant="contained" size="large" disabled={submitting} sx={{ bgcolor: '#6A3F4D', '&:hover': { bgcolor: '#5A3541' }, borderRadius: '12px', py: 1.3, fontWeight: 800 }}>
                    {submitting ? <CircularProgress size={23} sx={{ color: '#fff' }} /> : 'Verify & Create Salon'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: '20px', border: '1px solid #E8DFD5', bgcolor: '#fff' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>How onboarding works</Typography>
              <Typography variant="body2" sx={{ color: '#6E5C63', lineHeight: 1.7 }}>
                You enter the salon details here. The system creates the salon, creates its first Admin login, and marks the salon Active. No salon Admin can access this onboarding screen or create another salon.
              </Typography>
              <Divider sx={{ my: 2.5 }} />
              <Chip icon={<CheckCircleIcon />} label="Super Admin only" sx={{ fontWeight: 700 }} />
            </Paper>

            {result && (
              <Paper elevation={0} sx={{ mt: 3, p: 3, borderRadius: '20px', border: '1px solid #CFE8D5', bgcolor: '#F7FFF8' }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#245B31' }}>Salon Created Successfully</Typography>
                <Typography variant="body2" sx={{ mt: 0.5, mb: 2, color: '#4D6653' }}>{result.salonName}</Typography>
                <Box sx={{ display: 'grid', gap: 1 }}>
                  <Typography><strong>Salon Code:</strong> {result.salonCode}</Typography>
                  <Typography><strong>Admin User ID:</strong> {result.userId}</Typography>
                  <Typography><strong>Email:</strong> {result.email}</Typography>
                  <Typography><strong>Password:</strong> {result.password}</Typography>
                </Box>
                <Button startIcon={<ContentCopyIcon />} onClick={copyCredentials} sx={{ mt: 2, textTransform: 'none', fontWeight: 700 }}>Copy Credentials</Button>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};
