import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  IconButton,
  TextField,
  MenuItem,
  Button,
  Grid,
  Paper,
  Chip,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useServices } from '../../context/ServiceContext';
import { INITIAL_STYLISTS } from '../../services/data';

export const QuickServiceBookingModal: React.FC = () => {
  const { serviceForBooking, setServiceForBooking, showToast } = useServices();

  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [date, setDate] = useState<string>('Today');
  const [time, setTime] = useState<string>('02:30 PM');
  const [stylistName, setStylistName] = useState<string>('Meera Rajput');
  const [notes, setNotes] = useState<string>('');
  const [isMember, setIsMember] = useState<boolean>(false);

  useEffect(() => {
    if (serviceForBooking) {
      setCustomerName('');
      setCustomerPhone('+91 ');
      setDate('Today');
      setTime('02:30 PM');
      setStylistName('Meera Rajput');
      setNotes('');
      setIsMember(true);
    }
  }, [serviceForBooking]);

  const handleClose = () => {
    setServiceForBooking(null);
  };

  if (!serviceForBooking) return null;

  const finalPrice = isMember
    ? Math.round(serviceForBooking.basePrice * (1 - serviceForBooking.memberDiscountPercent / 100))
    : serviceForBooking.basePrice;

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || customerPhone.length < 5) {
      showToast('Please enter customer name and valid phone number', 'warning');
      return;
    }

    showToast(
      `Appointment booked for ${customerName} (${serviceForBooking.name}) with ${stylistName} on ${date} at ${time}!`,
      'success'
    );
    handleClose();
  };

  return (
    <Dialog
      open={Boolean(serviceForBooking)}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: '20px',
            bgcolor: '#F8F4EE',
            p: 1,
          },
        },
      }}
    >
      <Box component="form" onSubmit={handleConfirmBooking}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '12px',
                bgcolor: '#6A3F4D',
                color: '#EBD9DF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CalendarMonthIcon />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#2D1F24', fontFamily: '"Playfair Display", serif' }}>
                Quick Book Appointment
              </Typography>
              <Typography variant="caption" sx={{ color: '#6E5C63' }}>
                Instant booking slot for {serviceForBooking.code}
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={handleClose} size="small" sx={{ color: '#6A3F4D' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Divider sx={{ mb: 2.5, borderColor: '#E8DFD5' }} />

          {/* Pre-selected Service Summary Card */}
          <Paper elevation={0} sx={{ p: 2, borderRadius: '12px', bgcolor: '#FFFFFF', border: '1px solid #E8DFD5', mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Chip label={serviceForBooking.code} size="small" sx={{ bgcolor: '#EBD9DF', color: '#6A3F4D', fontWeight: 800, height: 20, fontSize: '0.68rem', mb: 0.5 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#2D1F24' }}>
                  {serviceForBooking.name}
                </Typography>
                <Typography variant="caption" sx={{ color: '#6E5C63' }}>
                  Duration: {serviceForBooking.durationMinutes} mins • Recommended: {serviceForBooking.recommendedStylistRole}
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="caption" sx={{ color: '#6E5C63', display: 'block' }}>
                  Total Payable
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#2E7D32' }}>
                  ₹{finalPrice.toLocaleString('en-IN')}
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Form Fields */}
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                required
                label="Customer Name *"
                size="small"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Priya Sharma"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                required
                label="Phone Number *"
                size="small"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="+91 98765 43210"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                fullWidth
                label="Booking Date"
                size="small"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              >
                <MenuItem value="Today">Today (7 Aug)</MenuItem>
                <MenuItem value="Tomorrow">Tomorrow (8 Aug)</MenuItem>
                <MenuItem value="Aug 9">Aug 9, 2026</MenuItem>
                <MenuItem value="Aug 10">Aug 10, 2026</MenuItem>
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                fullWidth
                label="Time Slot"
                size="small"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              >
                <MenuItem value="10:30 AM">10:30 AM</MenuItem>
                <MenuItem value="11:45 AM">11:45 AM</MenuItem>
                <MenuItem value="01:15 PM">01:15 PM</MenuItem>
                <MenuItem value="02:30 PM">02:30 PM</MenuItem>
                <MenuItem value="04:00 PM">04:00 PM</MenuItem>
                <MenuItem value="05:30 PM">05:30 PM</MenuItem>
              </TextField>
            </Grid>

            <Grid size={12}>
              <TextField
                select
                fullWidth
                label="Assign Stylist"
                size="small"
                value={stylistName}
                onChange={(e) => setStylistName(e.target.value)}
              >
                {INITIAL_STYLISTS.map((s) => (
                  <MenuItem key={s.id} value={s.name}>
                    {s.name} ({s.roleTitle})
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Special Instructions / Product Allergy Notes"
                size="small"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Sensitive scalp, prefers warm water..."
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 2.5, pt: 1, borderTop: '1px solid #E8DFD5' }}>
          <Button onClick={handleClose} variant="outlined" sx={{ borderColor: '#A8828F', color: '#6A3F4D', borderRadius: '10px' }}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            startIcon={<CheckCircleIcon />}
            sx={{
              bgcolor: '#6A3F4D',
              color: '#EBD9DF',
              borderRadius: '10px',
              fontWeight: 800,
              px: 3,
              '&:hover': { bgcolor: '#523B2A' },
            }}
          >
            Confirm Booking
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};
