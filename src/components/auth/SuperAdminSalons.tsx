import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BusinessIcon from '@mui/icons-material/Business';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditIcon from '@mui/icons-material/Edit';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import SearchIcon from '@mui/icons-material/Search';
import { PauseCircle } from 'lucide-react';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import LockResetIcon from '@mui/icons-material/LockReset';
import { useAuth } from '../../context/AuthContext';

type SalonAdmin = {
  id: string;
  salon_id: string;
  name: string;
  email: string;
  login_id: string | null;
  role: string;
  designation: string;
  phone: string;
  created_at: string;
};

type Salon = {
  id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  currency_symbol: string;
  tax_rate_percent: number;
  status: 'Active' | 'Suspended' | 'Pending';
  subscription_plan: string;
  subscription_status: 'Trial' | 'Active' | 'Expired' | 'Cancelled';
  subscription_start_date: string | null;
  subscription_expiry_date: string | null;
  subscription_amount: number;
  next_renewal_date: string | null;
  created_at: string;
  admin: SalonAdmin | null;
};

const statusChip = (status: Salon['status']) => {
  if (status === 'Active') return { label: 'Active', color: 'success' as const, icon: <CheckCircleIcon /> };
  if (status === 'Suspended') return { label: 'Suspended', color: 'error' as const, icon: <PauseCircle size={20} /> };
  return { label: 'Pending', color: 'warning' as const, icon: undefined };
};

const subscriptionChip = (status: Salon['subscription_status']) => {
  if (status === 'Active') return { label: 'Active', color: 'success' as const };
  if (status === 'Expired') return { label: 'Expired', color: 'error' as const };
  if (status === 'Cancelled') return { label: 'Cancelled', color: 'default' as const };
  return { label: 'Trial', color: 'warning' as const };
};

const formatDate = (value?: string | null) => value ? new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(`${value}T00:00:00`)) : '—';

export const SuperAdminSalons: React.FC<{ onBack: () => void; onManage: (salonId: string) => void }> = ({ onBack, onManage }) => {
  const { session } = useAuth();
  const [salons, setSalons] = useState<Salon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<'All' | Salon['status']>('All');

  const loadSalons = async () => {
    setLoading(true);
    setError('');
    try {
      if (!session?.access_token) throw new Error('Your Super Admin session has expired. Please sign in again.');
      const response = await fetch('/api/super-admin-salons', { headers: { Authorization: `Bearer ${session.access_token}` } });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not load salons.');
      setSalons(data.salons || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load salons.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void loadSalons(); }, [session?.access_token]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return salons.filter((salon) => {
      const matchesStatus = status === 'All' || salon.status === status;
      const matchesSearch = !needle || [salon.name, salon.code, salon.city, salon.phone, salon.email, salon.admin?.name, salon.admin?.email, salon.admin?.login_id]
        .filter(Boolean).some((value) => String(value).toLowerCase().includes(needle));
      return matchesStatus && matchesSearch;
    });
  }, [salons, query, status]);

  const activeCount = salons.filter((salon) => salon.status === 'Active').length;
  const suspendedCount = salons.filter((salon) => salon.status === 'Suspended').length;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F8F4EE', p: { xs: 2, md: 4 } }}>
      <Box sx={{ maxWidth: 1250, mx: 'auto' }}>
        <Button startIcon={<ArrowBackIcon />} onClick={onBack} sx={{ mb: 2, color: '#6A3F4D', textTransform: 'none', fontWeight: 800 }}>
          Back to Super Admin
        </Button>

        <Box sx={{ display: 'flex', alignItems: { xs: 'flex-start', md: 'center' }, justifyContent: 'space-between', gap: 2, mb: 3, flexDirection: { xs: 'column', md: 'row' } }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900, color: '#2D1F24' }}>All Salons</Typography>
            <Typography sx={{ color: '#6E5C63', mt: 0.5 }}>Every salon you have onboarded is listed here.</Typography>
          </Box>
          <Button variant="outlined" onClick={loadSalons} disabled={loading} sx={{ borderColor: '#D9C8CE', color: '#6A3F4D', borderRadius: '12px', textTransform: 'none', fontWeight: 800 }}>
            {loading ? <CircularProgress size={20} /> : 'Refresh list'}
          </Button>
        </Box>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          {[
            ['Total Salons', salons.length, '#6A3F4D'],
            ['Active', activeCount, '#2E7D32'],
            ['Suspended', suspendedCount, '#C62828'],
          ].map(([label, value, color]) => (
            <Grid size={{ xs: 12, sm: 4 }} key={String(label)}>
              <Card elevation={0} sx={{ borderRadius: '18px', border: '1px solid #E8DFD5' }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Typography variant="body2" sx={{ color: '#6E5C63', fontWeight: 700 }}>{label}</Typography>
                  <Typography variant="h4" sx={{ color, fontWeight: 900, mt: 0.5 }}>{value}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Paper elevation={0} sx={{ border: '1px solid #E8DFD5', borderRadius: '20px', overflow: 'hidden' }}>
          <Box sx={{ p: 2, display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center', bgcolor: '#FFFDFC' }}>
            <TextField
              size="small"
              placeholder="Search salon, code, city or admin..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              sx={{ minWidth: { xs: '100%', md: 360 }, flex: 1 }}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#8D7A81' }} /></InputAdornment> }}
            />
            <Select size="small" value={status} onChange={(e: SelectChangeEvent) => setStatus(e.target.value as typeof status)} sx={{ minWidth: 150 }}>
              <MenuItem value="All">All statuses</MenuItem>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Suspended">Suspended</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
            </Select>
          </Box>
          <Divider />

          {error && <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>}
          {loading ? (
            <Box sx={{ py: 8, display: 'grid', placeItems: 'center' }}><CircularProgress sx={{ color: '#6A3F4D' }} /></Box>
          ) : filtered.length === 0 ? (
            <Box sx={{ py: 8, textAlign: 'center', px: 2 }}>
              <BusinessIcon sx={{ fontSize: 42, color: '#B7A7AD' }} />
              <Typography sx={{ mt: 1, fontWeight: 800 }}>No salons found</Typography>
              <Typography variant="body2" sx={{ color: '#6E5C63', mt: 0.5 }}>Try a different search or status filter.</Typography>
            </Box>
          ) : (
            <Box sx={{ overflowX: 'auto' }}>
              <Box sx={{ minWidth: 1050 }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1.8fr 1.25fr 1.15fr 0.9fr 1.15fr 1fr 110px', gap: 2, px: 2.5, py: 1.5, bgcolor: '#FAF6F1' }}>
                  {['Salon', 'Admin', 'Contact', 'Status', 'Subscription', 'Onboarded', ''].map((heading) => <Typography key={heading} variant="caption" sx={{ fontWeight: 900, color: '#7A666D', textTransform: 'uppercase', letterSpacing: '.05em' }}>{heading}</Typography>)}
                </Box>
                {filtered.map((salon) => {
                  const chip = statusChip(salon.status);
                  return (
                    <Box key={salon.id} sx={{ display: 'grid', gridTemplateColumns: '1.8fr 1.25fr 1.15fr 0.9fr 1.15fr 1fr 110px', gap: 2, alignItems: 'center', px: 2.5, py: 2, borderTop: '1px solid #EEE6DE', '&:hover': { bgcolor: '#FFFDFC' } }}>
                      <Box>
                        <Typography sx={{ fontWeight: 850, color: '#2D1F24' }}>{salon.name}</Typography>
                        <Typography variant="body2" sx={{ color: '#7B6870' }}>{salon.code}{salon.city ? ` · ${salon.city}` : ''}</Typography>
                      </Box>
                      <Box>
                        <Typography sx={{ fontWeight: 750 }}>{salon.admin?.name || '—'}</Typography>
                        <Typography variant="body2" sx={{ color: '#7B6870' }}>{salon.admin?.login_id || 'No Admin ID'}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2">{salon.phone || '—'}</Typography>
                        <Typography variant="body2" sx={{ color: '#7B6870', overflow: 'hidden', textOverflow: 'ellipsis' }}>{salon.email || '—'}</Typography>
                      </Box>
                      <Box sx={{ display: 'grid', gap: 0.5 }}>
                        <Chip label={salon.subscription_plan || 'Trial'} size="small" sx={{ width: 'fit-content', fontWeight: 800 }} />
                        <Typography variant="caption" sx={{ color: subscriptionChip(salon.subscription_status).color === 'error' ? '#C62828' : '#6E5C63', fontWeight: 700 }}>{subscriptionChip(salon.subscription_status).label}</Typography>
                      </Box>
                      <Typography variant="body2" sx={{ color: '#6E5C63' }}>{formatDate(salon.created_at)}</Typography>
                      <Button variant="outlined" startIcon={<EditIcon />} onClick={() => onManage(salon.id)} sx={{ borderColor: '#D9C8CE', color: '#6A3F4D', borderRadius: '10px', textTransform: 'none', fontWeight: 800 }}>Manage</Button>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export const SuperAdminManageSalon: React.FC<{ salonId: string; onBack: () => void; onSaved: () => void }> = ({ salonId, onBack, onSaved }) => {
  const { session } = useAuth();
  const [salon, setSalon] = useState<Salon | null>(null);
  const [form, setForm] = useState({ name: '', address: '', city: '', phone: '', email: '', currencySymbol: '₹', taxRatePercent: '18', status: 'Active' as Salon['status'], subscriptionPlan: 'Trial', subscriptionStatus: 'Trial' as Salon['subscription_status'], subscriptionStartDate: '', subscriptionExpiryDate: '', subscriptionAmount: '0', nextRenewalDate: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState('');
  const [resetOpen, setResetOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resettingPassword, setResettingPassword] = useState(false);
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        if (!session?.access_token) throw new Error('Your Super Admin session has expired.');
        const response = await fetch('/api/super-admin-salons', { headers: { Authorization: `Bearer ${session.access_token}` } });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Could not load salon details.');
        const found = (data.salons || []).find((item: Salon) => item.id === salonId) as Salon | undefined;
        if (!found) throw new Error('Salon not found.');
        setSalon(found);
        setForm({ name: found.name, address: found.address || '', city: found.city || '', phone: found.phone || '', email: found.email || '', currencySymbol: found.currency_symbol || '₹', taxRatePercent: String(found.tax_rate_percent ?? 18), status: found.status, subscriptionPlan: found.subscription_plan || 'Trial', subscriptionStatus: found.subscription_status || 'Trial', subscriptionStartDate: found.subscription_start_date || '', subscriptionExpiryDate: found.subscription_expiry_date || '', subscriptionAmount: String(found.subscription_amount ?? 0), nextRenewalDate: found.next_renewal_date || '' });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not load salon details.');
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [session?.access_token, salonId]);

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const resetAdminPassword = async () => {
    setResetError('');
    setResetSuccess('');
    if (newPassword.length < 6) { setResetError('Password must be at least 6 characters.'); return; }
    if (newPassword.length > 72) { setResetError('Password must be 72 characters or fewer.'); return; }
    if (newPassword !== confirmPassword) { setResetError('Passwords do not match.'); return; }

    setResettingPassword(true);
    try {
      if (!session?.access_token) throw new Error('Your Super Admin session has expired.');
      const response = await fetch('/api/super-admin-salons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ action: 'reset-admin-password', salonId, newPassword }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not reset the Admin password.');
      setResetSuccess('Admin password reset successfully. Give the new password to the salon Admin securely.');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setResetError(err instanceof Error ? err.message : 'Could not reset the Admin password.');
    } finally {
      setResettingPassword(false);
    }
  };

  const changeStatus = async (nextStatus: 'Active' | 'Suspended') => {
    const action = nextStatus === 'Active' ? 'activate' : 'deactivate';
    const confirmed = window.confirm(
      nextStatus === 'Active'
        ? `Activate ${salon?.name || 'this salon'}? The salon Admin and staff will be able to access Salon POS again.`
        : `Deactivate ${salon?.name || 'this salon'}? The salon Admin and staff will lose access to Salon POS. Their data will remain safe and can be restored later.`
    );
    if (!confirmed) return;

    setSaving(true);
    setError('');
    setSaved('');
    try {
      if (!session?.access_token) throw new Error('Your Super Admin session has expired.');
      const response = await fetch('/api/super-admin-salons', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ salonId, status: nextStatus }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || `Could not ${action} the salon.`);
      setSalon((prev) => prev ? { ...prev, ...data.salon } : data.salon);
      setForm((prev) => ({ ...prev, status: nextStatus }));
      setSaved(nextStatus === 'Active' ? 'Salon activated successfully.' : 'Salon deactivated successfully.');
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : `Could not ${action} the salon.`);
    } finally {
      setSaving(false);
    }
  };

  const save = async () => {
    setSaving(true); setError(''); setSaved('');
    try {
      if (!session?.access_token) throw new Error('Your Super Admin session has expired.');
      const response = await fetch('/api/super-admin-salons', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ salonId, ...form, taxRatePercent: Number(form.taxRatePercent) }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not save changes.');
      setSalon((prev) => prev ? { ...prev, ...data.salon } : data.salon);
      setSaved('Salon details updated successfully.');
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save changes.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Box sx={{ minHeight: '100vh', bgcolor: '#F8F4EE', display: 'grid', placeItems: 'center' }}><CircularProgress sx={{ color: '#6A3F4D' }} /></Box>;
  if (!salon) return <Box sx={{ minHeight: '100vh', bgcolor: '#F8F4EE', p: 4 }}><Alert severity="error">{error || 'Salon not found.'}</Alert><Button onClick={onBack} sx={{ mt: 2 }}>Back to All Salons</Button></Box>;

  const chip = statusChip(salon.status);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F8F4EE', p: { xs: 2, md: 4 } }}>
      <Box sx={{ maxWidth: 1050, mx: 'auto' }}>
        <Button startIcon={<ArrowBackIcon />} onClick={onBack} sx={{ mb: 2, color: '#6A3F4D', textTransform: 'none', fontWeight: 800 }}>Back to All Salons</Button>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, alignItems: 'flex-start', mb: 3 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 900, color: '#2D1F24' }}>{salon.name}</Typography>
            <Typography sx={{ color: '#6E5C63', mt: 0.5 }}>Salon code: <strong>{salon.code}</strong></Typography>
          </Box>
          <Chip icon={chip.icon} label={chip.label} color={chip.color} sx={{ fontWeight: 800 }} />
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {saved && <Alert severity="success" sx={{ mb: 2 }}>{saved}</Alert>}

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Card elevation={0} sx={{ borderRadius: '20px', border: '1px solid #E8DFD5' }}>
              <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
                <Typography variant="h6" sx={{ fontWeight: 900, mb: 2.5 }}>Salon Details</Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12 }}><TextField fullWidth label="Salon Name" value={form.name} onChange={update('name')} /></Grid>
                  <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Salon Code" value={salon.code} disabled helperText="Code is fixed because it is part of the Admin User ID." /></Grid>
                  <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Status" select value={form.status} onChange={update('status')}><MenuItem value="Active">Active</MenuItem><MenuItem value="Suspended">Suspended</MenuItem><MenuItem value="Pending">Pending</MenuItem></TextField></Grid>
                  <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Phone" value={form.phone} onChange={update('phone')} InputProps={{ startAdornment: <InputAdornment position="start"><PhoneOutlinedIcon fontSize="small" /></InputAdornment> }} /></Grid>
                  <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="Email" value={form.email} onChange={update('email')} InputProps={{ startAdornment: <InputAdornment position="start"><EmailOutlinedIcon fontSize="small" /></InputAdornment> }} /></Grid>
                  <Grid size={{ xs: 12 }}><TextField fullWidth label="Address" multiline minRows={2} value={form.address} onChange={update('address')} InputProps={{ startAdornment: <InputAdornment position="start"><LocationOnOutlinedIcon fontSize="small" /></InputAdornment> }} /></Grid>
                  <Grid size={{ xs: 12, sm: 6 }}><TextField fullWidth label="City" value={form.city} onChange={update('city')} /></Grid>
                  <Grid size={{ xs: 12, sm: 3 }}><TextField fullWidth label="Currency" value={form.currencySymbol} onChange={update('currencySymbol')} /></Grid>
                  <Grid size={{ xs: 12, sm: 3 }}><TextField fullWidth label="Tax %" type="number" value={form.taxRatePercent} onChange={update('taxRatePercent')} inputProps={{ min: 0, max: 100, step: 0.1 }} /></Grid>
                </Grid>
                <Divider sx={{ my: 3 }} />
                <Typography variant="h6" sx={{ fontWeight: 900, mb: 2 }}>Subscription</Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}><TextField select fullWidth label="Plan" value={form.subscriptionPlan} onChange={update('subscriptionPlan')}><MenuItem value="Trial">Trial</MenuItem><MenuItem value="Basic">Basic</MenuItem><MenuItem value="Pro">Pro</MenuItem><MenuItem value="Premium">Premium</MenuItem><MenuItem value="Custom">Custom</MenuItem></TextField></Grid>
                  <Grid size={{ xs: 12, sm: 6 }}><TextField select fullWidth label="Subscription Status" value={form.subscriptionStatus} onChange={update('subscriptionStatus')}><MenuItem value="Trial">Trial</MenuItem><MenuItem value="Active">Active</MenuItem><MenuItem value="Expired">Expired</MenuItem><MenuItem value="Cancelled">Cancelled</MenuItem></TextField></Grid>
                  <Grid size={{ xs: 12, sm: 4 }}><TextField fullWidth type="date" label="Start Date" value={form.subscriptionStartDate} onChange={update('subscriptionStartDate')} InputLabelProps={{ shrink: true }} /></Grid>
                  <Grid size={{ xs: 12, sm: 4 }}><TextField fullWidth type="date" label="Expiry Date" value={form.subscriptionExpiryDate} onChange={update('subscriptionExpiryDate')} InputLabelProps={{ shrink: true }} /></Grid>
                  <Grid size={{ xs: 12, sm: 4 }}><TextField fullWidth type="number" label="Amount" value={form.subscriptionAmount} onChange={update('subscriptionAmount')} inputProps={{ min: 0, step: 0.01 }} /></Grid>
                  <Grid size={{ xs: 12 }}><TextField fullWidth type="date" label="Next Renewal Date" value={form.nextRenewalDate} onChange={update('nextRenewalDate')} InputLabelProps={{ shrink: true }} /></Grid>
                </Grid>
                <Box sx={{ mt: 3, display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                  <Button variant="contained" onClick={save} disabled={saving} startIcon={saving ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : <CheckCircleIcon />} sx={{ bgcolor: '#6A3F4D', '&:hover': { bgcolor: '#5A3541' }, borderRadius: '12px', textTransform: 'none', fontWeight: 900, px: 3 }}>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                  {salon.status === 'Active' ? (
                    <Button variant="outlined" onClick={() => void changeStatus('Suspended')} disabled={saving} startIcon={<PowerSettingsNewIcon />} sx={{ borderColor: '#B3261E', color: '#B3261E', '&:hover': { borderColor: '#8F1D18', bgcolor: '#FFF5F4' }, borderRadius: '12px', textTransform: 'none', fontWeight: 900, px: 2.5 }}>
                      Deactivate Salon
                    </Button>
                  ) : (
                    <Button variant="outlined" onClick={() => void changeStatus('Active')} disabled={saving} startIcon={<PowerSettingsNewIcon />} sx={{ borderColor: '#2E7D32', color: '#2E7D32', '&:hover': { borderColor: '#1B5E20', bgcolor: '#F3FBF4' }, borderRadius: '12px', textTransform: 'none', fontWeight: 900, px: 2.5 }}>
                      Activate Salon
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: '20px', border: '1px solid #E8DFD5', bgcolor: '#fff' }}>
              <Typography variant="h6" sx={{ fontWeight: 900, mb: 2 }}>Admin Account</Typography>
              {salon.admin ? (
                <Box sx={{ display: 'grid', gap: 1.5 }}>
                  <Box><Typography variant="caption" sx={{ color: '#7A666D' }}>Admin Name</Typography><Typography sx={{ fontWeight: 800 }}>{salon.admin.name}</Typography></Box>
                  <Box><Typography variant="caption" sx={{ color: '#7A666D' }}>Admin User ID</Typography><Typography sx={{ fontWeight: 800 }}>{salon.admin.login_id || '—'}</Typography></Box>
                  <Box><Typography variant="caption" sx={{ color: '#7A666D' }}>Login Email</Typography><Typography sx={{ fontWeight: 800 }}>{salon.admin.email}</Typography></Box>
                  <Box><Typography variant="caption" sx={{ color: '#7A666D' }}>Phone</Typography><Typography sx={{ fontWeight: 800 }}>{salon.admin.phone || '—'}</Typography></Box>
                  <Divider sx={{ my: 1 }} />
                  {resetSuccess && <Alert severity="success" sx={{ mb: 1.5 }}>{resetSuccess}</Alert>}
                  <Button
                    variant="outlined"
                    startIcon={<LockResetIcon />}
                    onClick={() => { setResetError(''); setResetSuccess(''); setNewPassword(''); setConfirmPassword(''); setResetOpen(true); }}
                    disabled={saving || resettingPassword}
                    sx={{ borderColor: '#6A3F4D', color: '#6A3F4D', borderRadius: '12px', textTransform: 'none', fontWeight: 900 }}
                  >
                    Reset Admin Password
                  </Button>
                </Box>
              ) : <Alert severity="warning">No Admin profile is linked to this salon.</Alert>}
            </Paper>

            <Paper elevation={0} sx={{ p: 3, mt: 2, borderRadius: '20px', border: '1px solid #E8DFD5', bgcolor: '#fff' }}>
              <Typography variant="h6" sx={{ fontWeight: 900, mb: 1 }}>Salon Overview</Typography>
              <Typography variant="body2" sx={{ color: '#6E5C63', lineHeight: 1.7 }}>
                Onboarded on <strong>{formatDate(salon.created_at)}</strong>. This page is restricted to the Super Admin and changes are saved server-side.
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'grid', gap: 1 }}>
                <Typography variant="body2"><strong>Plan:</strong> {salon.subscription_plan || 'Trial'}</Typography>
                <Typography variant="body2"><strong>Status:</strong> {salon.subscription_status || 'Trial'}</Typography>
                <Typography variant="body2"><strong>Amount:</strong> ₹{Number(salon.subscription_amount || 0).toLocaleString('en-IN')}</Typography>
                <Typography variant="body2"><strong>Start:</strong> {formatDate(salon.subscription_start_date)}</Typography>
                <Typography variant="body2"><strong>Expiry:</strong> {formatDate(salon.subscription_expiry_date)}</Typography>
                <Typography variant="body2"><strong>Next Renewal:</strong> {formatDate(salon.next_renewal_date)}</Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        <Dialog open={resetOpen} onClose={() => !resettingPassword && setResetOpen(false)} fullWidth maxWidth="sm">
          <DialogTitle sx={{ fontWeight: 900 }}>Reset Admin Password</DialogTitle>
          <DialogContent>
            <Typography variant="body2" sx={{ color: '#6E5C63', mb: 2 }}>
              Set a new password for {salon.admin?.name || 'this salon Admin'}. The current password will stop working immediately.
            </Typography>
            {resetError && <Alert severity="error" sx={{ mb: 2 }}>{resetError}</Alert>}
            <TextField
              fullWidth
              autoFocus
              margin="dense"
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              helperText="Minimum 6 characters"
              disabled={resettingPassword}
            />
            <TextField
              fullWidth
              margin="dense"
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={resettingPassword}
              sx={{ mt: 1 }}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setResetOpen(false)} disabled={resettingPassword} sx={{ textTransform: 'none', fontWeight: 700 }}>Cancel</Button>
            <Button
              variant="contained"
              onClick={() => void resetAdminPassword()}
              disabled={resettingPassword || !newPassword || !confirmPassword}
              startIcon={resettingPassword ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : <LockResetIcon />}
              sx={{ bgcolor: '#6A3F4D', '&:hover': { bgcolor: '#5A3541' }, borderRadius: '10px', textTransform: 'none', fontWeight: 800 }}
            >
              {resettingPassword ? 'Resetting...' : 'Reset Password'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};
