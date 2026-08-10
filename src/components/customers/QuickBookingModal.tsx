import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
  Box,
  Typography,
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useCustomers } from '../../context/CustomerContext';

export const QuickBookingModal: React.FC = () => {
  const { isBookingOpen, setIsBookingOpen, targetCustomerForAction, showCustomerToast } = useCustomers();

  const [stylist, setStylist] = useState('Aarav Kapoor');
  const [service, setService] = useState('Hair Cut & Styling');
  const [date, setDate] = useState('2026-08-08');
  const [time, setTime] = useState('11:00 AM');
  const [amount, setAmount] = useState('1200');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (targetCustomerForAction) {
      if (targetCustomerForAction.preferredStylist) setStylist(targetCustomerForAction.preferredStylist);
      if (targetCustomerForAction.preferredServices?.[0]) setService(targetCustomerForAction.preferredServices[0]);
    }
  }, [targetCustomerForAction]);

  const handleSubmit = () => {
    if (targetCustomerForAction) {
      showCustomerToast(`Appointment booked for ${targetCustomerForAction.fullName} on ${date} at ${time}!`);
      setIsBookingOpen(false);
    }
  };

  return (
    <Dialog open={isBookingOpen} onClose={() => setIsBookingOpen(false)} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 800, color: '#2D1F24', display: 'flex', alignItems: 'center', gap: 1 }}>
        <CalendarMonthIcon sx={{ color: '#6A3F4D' }} />
        Book Appointment — {targetCustomerForAction?.fullName}
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} sx={{ pt: 1 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Customer Name"
              value={targetCustomerForAction?.fullName || ''}
              disabled
              size="small"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Phone Number"
              value={targetCustomerForAction?.phone || ''}
              disabled
              size="small"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              select
              fullWidth
              label="Select Stylist"
              value={stylist}
              onChange={(e) => setStylist(e.target.value)}
              size="small"
            >
              {['Aarav Kapoor', 'Pooja Sharma', 'Rohan Verma', 'Karan Malhotra', 'Ananya Roy', 'Vikram Singh'].map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              select
              fullWidth
              label="Select Service"
              value={service}
              onChange={(e) => setService(e.target.value)}
              size="small"
            >
              {[
                'Hair Cut & Styling',
                'Hair Spa & Keratin',
                'Hydra Facial Glow',
                'Balayage / Hair Color',
                'Beard Grooming & Shave',
                'Pedicure & Manicure',
                'Bridal Makeup',
              ].map((srv) => (
                <MenuItem key={srv} value={srv}>
                  {srv}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              type="date"
              label="Appointment Date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              size="small"
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Time Slot"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              size="small"
              placeholder="e.g. 11:30 AM"
            />
          </Grid>

          <Grid size={12}>
            <TextField
              fullWidth
              label="Estimated Amount (₹)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              size="small"
            />
          </Grid>

          <Grid size={12}>
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Special Notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              size="small"
              placeholder="Any special requests or product choices..."
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={() => setIsBookingOpen(false)}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} sx={{ bgcolor: '#6A3F4D' }}>
          Confirm Appointment
        </Button>
      </DialogActions>
    </Dialog>
  );
};
