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
  CircularProgress,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import { useAuth, Profile } from '../../context/AuthContext';
import { UserRole } from '../../types';

const roleColor: Record<UserRole, string> = {
  Admin: '#6A3F4D',
  Reception: '#0288D1',
  Stylist: '#2E7D32',
};

export const StaffAccessTab: React.FC = () => {
  const { profile, inviteStaff, fetchSalonStaff } = useAuth();

  const [staff, setStaff] = useState<Profile[]>([]);
  const [loadingStaff, setLoadingStaff] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('Reception');
  const [designation, setDesignation] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [invitedEmail, setInvitedEmail] = useState<string | null>(null);

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
    setError(null);
    setInvitedEmail(null);
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
      role,
      designation: designation.trim() || role,
    });

    setSubmitting(false);

    if (!result.success) {
      setError(result.error || 'Something went wrong.');
      return;
    }

    setInvitedEmail(email.trim());
    loadStaff();
  };

  if (profile?.role !== 'Admin') {
    return <Alert severity="info">Only an Admin can view and manage staff login access.</Alert>;
  }

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#2D1F24' }}>
            Staff Login Access
          </Typography>
          <Typography variant="body2" sx={{ color: '#6E5C63' }}>
            Invite Reception and Stylist staff to your salon by email — they'll get a link to set their own password.
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
          Invite Staff
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
        <DialogTitle sx={{ fontWeight: 800 }}>Invite Staff</DialogTitle>
        <DialogContent>
          {invitedEmail ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <Alert icon={<MarkEmailReadIcon />} severity="success">
                Invite sent to <strong>{invitedEmail}</strong>. They'll receive an email with a link to set their
                own password and log in.
              </Alert>
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
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          {invitedEmail ? (
            <Button
              onClick={handleClose}
              variant="contained"
              sx={{
                bgcolor: '#6A3F4D',
                '&:hover': { bgcolor: '#4A2B35' },
                borderRadius: '10px',
                textTransform: 'none',
              }}
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
                sx={{
                  bgcolor: '#6A3F4D',
                  '&:hover': { bgcolor: '#4A2B35' },
                  borderRadius: '10px',
                  textTransform: 'none',
                }}
              >
                {submitting ? <CircularProgress size={20} sx={{ color: '#fff' }} /> : 'Send Invite'}
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};
