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
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useDashboard } from '../context/DashboardContext';

export const NewAppointmentModal: React.FC = () => {
  const { isNewAppointmentOpen, setIsNewAppointmentOpen, addAppointment, stylists } = useDashboard();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [service, setService] = useState('Hair Cut & Styling');
  const [stylistName, setStylistName] = useState('Aarav Kapoor');
  const [time, setTime] = useState('02:30 PM');
  const [amount, setAmount] = useState('1500');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) return;

    addAppointment({
      customerName,
      customerPhone,
      service,
      stylistName,
      time,
      amount: Number(amount),
      status: 'Booked',
    });

    setIsNewAppointmentOpen(false);
    setCustomerName('');
    setCustomerPhone('');
  };

  return (
    <Dialog
      open={isNewAppointmentOpen}
      onClose={() => setIsNewAppointmentOpen(false)}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: { sx: { borderRadius: '16px', p: 1 } },
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, pb: 1 }}>
        <CalendarMonthIcon sx={{ color: '#6A3F4D' }} />
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#2D1F24' }}>
          Schedule New Appointment
        </Typography>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers sx={{ borderBottom: '1px solid #E8DFD5', borderTop: '1px solid #E8DFD5' }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            <TextField
              label="Customer Name"
              fullWidth
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g. Pooja Sharma"
              size="small"
            />
            <TextField
              label="Customer Phone"
              fullWidth
              required
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="+91 98765 43210"
              size="small"
            />
            <TextField
              label="Select Service"
              select
              fullWidth
              value={service}
              onChange={(e) => setService(e.target.value)}
              size="small"
            >
              <MenuItem value="Hair Cut & Styling">Hair Cut & Styling (₹1,500)</MenuItem>
              <MenuItem value="Hair Spa & Keratin">Hair Spa & Keratin (₹2,800)</MenuItem>
              <MenuItem value="Hydra Facial Glow">Hydra Facial Glow (₹3,200)</MenuItem>
              <MenuItem value="Balayage / Hair Color">Balayage / Hair Color (₹4,500)</MenuItem>
              <MenuItem value="Beard Grooming & Shave">Beard Grooming & Shave (₹850)</MenuItem>
              <MenuItem value="Pedicure & Manicure">Pedicure & Manicure (₹1,800)</MenuItem>
            </TextField>
            <TextField
              label="Assign Stylist"
              select
              fullWidth
              value={stylistName}
              onChange={(e) => setStylistName(e.target.value)}
              size="small"
            >
              {stylists.map((s) => (
                <MenuItem key={s.id} value={s.name}>
                  {s.name} ({s.roleTitle})
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Time Slot"
              fullWidth
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="e.g. 02:30 PM"
              size="small"
            />
            <TextField
              label="Estimated Amount (₹)"
              type="number"
              fullWidth
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              size="small"
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ pt: 2, px: 3 }}>
          <Button onClick={() => setIsNewAppointmentOpen(false)} sx={{ color: '#6E5C63' }}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" sx={{ bgcolor: '#6A3F4D', color: '#FFFFFF' }}>
            Confirm Booking
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
