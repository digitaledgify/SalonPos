import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  Chip,
  Avatar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  InputAdornment,
  CircularProgress,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useAuth, Profile } from '../../context/AuthContext';
import { UserRole } from '../../types';

const roleColor: Record<UserRole, string> = {
  Admin: '#6A3F4D',
  Reception: '#0288D1',
  Stylist: '#2E7D32',
};

function generateTempPassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
  let out = '';
  for (let i = 0; i < 10; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

export const StaffAccessTab: React.FC = () => {
  const { profile, inviteStaff, fetchSalonStaff } = useAuth();

  const [staff, setStaff] = useState<Profile[]>([]);
  const [loadingStaff, setLoadingStaff] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('Reception');
  const [designation, setDesignation] = useState('');
  const [password, setPassword] = useState(generateTempPassword());
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdCreds, setCreatedCreds] = useState<{ email: string; password: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const loadStaff = async () => {
    setLoadingStaff(true);
    const rows = await fetchSalonStaff();
    setStaff(rows);
    setLoadingStaff(false);
  };

  useEffect(() => {
    loadStaff();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetForm = () => {
    setName('');
    setEmail('');
    setRole('Reception');
    setDesignation('');
    setPassword(generateTempPassword());
    setError(null);
    setCreatedCreds(null);
  };

  const handleOpen = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const result = await inviteStaff({
      name: name.trim(),
      email: email.trim(),
      password,
      role,
      designation: designation.trim() || role,
    });

    setSubmitting(false);

    if (!result.success) {
      setError(result.error || 'Something went wrong.');
      return;
    }

    setCreatedCreds({ email: email.trim(), password });
    loadStaff();
  };

  const handleCopy = () => {
    if (!createdCreds) return;
    navigator.clipboard.writeText(`Email: ${createdCreds.email}\nPassword: ${createdCreds.password}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (profile?.role !== 'Admin') {
    return (
      <Alert severity="info">Only an Admin can view and manage staff login access.</Alert>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#2D1F24' }}>
            Staff Login Access
          </Typography>
          <Typography variant="body2" sx={{ color: '#6E5C63' }}>
            Create separate logins for Reception and Stylist staff in your salon.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpen}
          sx={{
            bgcolor: '#6A3F4D',
            '&:hover': { bgcolor: '#4A2B35' },
            borderRadius: '10px',
            textTransform: 'none',
            fontWeight: 700,
          }}
        >
          Add Staff Login
        </Button>
      </Box>

      <Paper elevation={0} sx={{ borderRadius: '16px', border: '1px solid #E8DFD5', overflow: 'hidden' }}>
        {loadingStaff ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <CircularProgress size={24} sx={{ color: '#6A3F4D' }} />
          </Box>
        ) : staff.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center', color: '#6E5C63' }}>No staff accounts yet.</Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#F8F4EE' }}>
                <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Designation</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {staff.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: roleColor[s.role] }}>
                        {s.name.charAt(0)}
                      </Avatar>
                      <Typography sx={{ fontWeight: 600 }}>{s.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={s.role}
                      size="small"
                      sx={{ bgcolor: roleColor[s.role], color: '#fff', fontWeight: 700 }}
                    />
                  </TableCell>
                  <TableCell sx={{ color: '#6E5C63' }}>{s.designation || '—'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>

      <Dialog open={isModalOpen} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>Add Staff Login</DialogTitle>
        <DialogContent>
          {createdCreds ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <Alert icon={<CheckCircleIcon />} severity="success">
                Login created. Share these credentials with your staff member — they'll only be shown once.
              </Alert>
              <Paper variant="outlined" sx={{ p: 2, borderRadius: '12px', bgcolor: '#F8F4EE' }}>
                <Typography variant="caption" sx={{ color: '#6E5C63', fontWeight: 700 }}>
                  EMAIL
                </Typography>
                <Typography sx={{ fontWeight: 700, mb: 1.5 }}>{createdCreds.email}</Typography>
                <Typography variant="caption" sx={{ color: '#6E5C63', fontWeight: 700 }}>
                  TEMPORARY PASSWORD
                </Typography>
                <Typography sx={{ fontWeight: 700, fontFamily: 'monospace', fontSize: '1.1rem' }}>
                  {createdCreds.password}
                </Typography>
              </Paper>
              <Button
                variant="outlined"
                startIcon={<ContentCopyIcon />}
                onClick={handleCopy}
                sx={{ borderRadius: '10px', textTransform: 'none' }}
              >
                {copied ? 'Copied!' : 'Copy Credentials'}
              </Button>
              <Typography variant="caption" sx={{ color: '#6E5C63' }}>
                Depending on your Supabase project's email confirmation setting, this staff member may need to
                confirm their email before their first login.
              </Typography>
            </Box>
          ) : (
            <Box
              component="form"
              id="invite-staff-form"
              onSubmit={handleSubmit}
              sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}
            >
              {error && <Alert severity="error">{error}</Alert>}
              <TextField
                label="Full Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
              />
              <TextField
                label="Email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
              />
              <TextField
                select
                label="Role"
                required
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                fullWidth
              >
                <MenuItem value="Reception">Reception</MenuItem>
                <MenuItem value="Stylist">Stylist</MenuItem>
                <MenuItem value="Admin">Admin</MenuItem>
              </TextField>
              <TextField
                label="Designation (optional)"
                placeholder="e.g. Senior Stylist"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                fullWidth
              />
              <TextField
                label="Temporary Password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                helperText="Auto-generated — you can edit it, or regenerate below."
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
                size="small"
                onClick={() => setPassword(generateTempPassword())}
                sx={{ alignSelf: 'flex-start', textTransform: 'none', color: '#6A3F4D', fontWeight: 700 }}
              >
                Regenerate Password
              </Button>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          {createdCreds ? (
            <Button
              onClick={handleClose}
              variant="contained"
              sx={{ bgcolor: '#6A3F4D', '&:hover': { bgcolor: '#4A2B35' }, borderRadius: '10px', textTransform: 'none' }}
            >
              Done
            </Button>
          ) : (
            <>
              <Button onClick={handleClose} sx={{ textTransform: 'none', color: '#6E5C63' }}>
                Cancel
              </Button>
              <Button
                type="submit"
                form="invite-staff-form"
                variant="contained"
                disabled={submitting}
                sx={{ bgcolor: '#6A3F4D', '&:hover': { bgcolor: '#4A2B35' }, borderRadius: '10px', textTransform: 'none' }}
              >
                {submitting ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Create Login'}
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};
