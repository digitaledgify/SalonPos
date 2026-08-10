import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  Typography,
  Chip,
  IconButton,
} from '@mui/material';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import CloseIcon from '@mui/icons-material/Close';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import { useDashboard } from '../../context/DashboardContext';

interface Props {
  open: boolean;
  onClose: () => void;
}

export const QuickWalkInModal: React.FC<Props> = ({ open, onClose }) => {
  const { addAppointment, stylists, showToast } = useDashboard();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [service, setService] = useState('Hair Cut & Styling');
  const [stylistName, setStylistName] = useState('Aarav Kapoor');
  const [amount, setAmount] = useState('1500');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    addAppointment({
      customerName,
      customerPhone,
      service,
      stylistName,
      time: timeStr,
      amount: Number(amount),
      status: 'Checked In', // Direct active status for walk-in!
      notes: 'Walk-in Client (Reception Express)',
    });

    showToast(`Walk-in client ${customerName} checked in directly into ${stylistName}'s chair!`);

    setCustomerName('');
    setCustomerPhone('');
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: '16px',
            p: 1,
            border: '1px solid #E8DFD5',
          },
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '10px',
              bgcolor: '#FFF8E1',
              color: '#F57F17',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #FFE082',
            }}
          >
            <FlashOnIcon />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#2D1F24', fontSize: '1.1rem' }}>
              Quick Walk-In Check-In
            </Typography>
            <Typography variant="caption" sx={{ color: '#6E5C63' }}>
              Instant floor registration (sets status to Checked In)
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers sx={{ borderBottom: '1px solid #E8DFD5', borderTop: '1px solid #E8DFD5' }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            <TextField
              label="Client Name"
              required
              fullWidth
              size="small"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. Vikramaditya"
            />
            <TextField
              label="Phone Number"
              required
              fullWidth
              size="small"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="+91 98765 00000"
            />
            <TextField
              label="Select Service"
              select
              fullWidth
              size="small"
              value={service}
              onChange={(e) => setService(e.target.value)}
            >
              <MenuItem value="Hair Cut & Styling">Hair Cut & Styling (₹1,500)</MenuItem>
              <MenuItem value="Hair Spa & Keratin">Hair Spa & Keratin (₹2,800)</MenuItem>
              <MenuItem value="Hydra Facial Glow">Hydra Facial Glow (₹3,200)</MenuItem>
              <MenuItem value="Beard Grooming & Shave">Beard Grooming & Shave (₹850)</MenuItem>
              <MenuItem value="Pedicure & Manicure">Pedicure & Manicure (₹1,800)</MenuItem>
            </TextField>
            <TextField
              label="Assign Stylist / Chair"
              select
              fullWidth
              size="small"
              value={stylistName}
              onChange={(e) => setStylistName(e.target.value)}
            >
              {stylists.map((s) => (
                <MenuItem key={s.id} value={s.name}>
                  {s.name} ({s.roleTitle})
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Charge Amount (₹)"
              type="number"
              fullWidth
              size="small"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Chip
                icon={<HowToRegIcon sx={{ fontSize: 16 }} />}
                label="Direct Floor Entry"
                color="info"
                sx={{ fontWeight: 800, fontSize: '0.75rem' }}
              />
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ pt: 2, px: 3 }}>
          <Button onClick={onClose} sx={{ color: '#6E5C63' }}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            startIcon={<HowToRegIcon />}
            sx={{ bgcolor: '#0288D1', color: '#FFFFFF', fontWeight: 800 }}
          >
            Check In Now
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
