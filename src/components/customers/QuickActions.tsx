import React, { useState } from 'react';
import { Box, Button, Paper, Typography, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ReceiptIcon from '@mui/icons-material/Receipt';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RedeemIcon from '@mui/icons-material/Redeem';
import PhoneIcon from '@mui/icons-material/Phone';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { Customer } from '../../types/customer';
import { useCustomers } from '../../context/CustomerContext';

interface Props {
  customer: Customer;
}

export const QuickActions: React.FC<Props> = ({ customer }) => {
  const {
    addLoyaltyPoints,
    redeemLoyaltyPoints,
    setIsBookingOpen,
    setIsBillingOpen,
    setTargetCustomerForAction,
    showCustomerToast,
  } = useCustomers();

  const [ptsDialogOpen, setPtsDialogOpen] = useState(false);
  const [redeemDialogOpen, setRedeemDialogOpen] = useState(false);
  const [ptsVal, setPtsVal] = useState('100');

  const handleCall = () => {
    window.location.href = `tel:${customer.phone.replace(/[^0-9+]/g, '')}`;
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`Hi ${customer.firstName}, warm greetings from our Salon! How can we assist you today?`);
    window.open(`https://wa.me/${customer.phone.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  const handleBookAppt = () => {
    setTargetCustomerForAction(customer);
    setIsBookingOpen(true);
  };

  const handleGenerateBill = () => {
    setTargetCustomerForAction(customer);
    setIsBillingOpen(true);
  };

  const submitAddPoints = () => {
    const pts = parseInt(ptsVal, 10);
    if (!isNaN(pts) && pts > 0) {
      addLoyaltyPoints(customer.id, pts);
      setPtsDialogOpen(false);
    }
  };

  const submitRedeemPoints = () => {
    const pts = parseInt(ptsVal, 10);
    if (!isNaN(pts) && pts > 0) {
      const ok = redeemLoyaltyPoints(customer.id, pts);
      if (ok) setRedeemDialogOpen(false);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: '16px',
        bgcolor: '#FFFFFF',
        border: '1px solid #E8DFD5',
        boxShadow: '0 4px 16px rgba(107, 79, 58, 0.04)',
      }}
    >
      <Typography variant="caption" sx={{ color: '#6A3F4D', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', mb: 1.5, display: 'block' }}>
        Quick Staff Actions
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(6, 1fr)' },
          gap: 1.5,
        }}
      >
        <Button
          variant="contained"
          startIcon={<CalendarMonthIcon />}
          onClick={handleBookAppt}
          sx={{
            bgcolor: '#6A3F4D',
            color: '#FFFFFF',
            fontWeight: 700,
            fontSize: '0.8rem',
            borderRadius: '10px',
            py: 1.2,
            boxShadow: 'none',
            '&:hover': { bgcolor: '#4A2B35' },
          }}
        >
          Book Appt
        </Button>

        <Button
          variant="contained"
          startIcon={<ReceiptIcon />}
          onClick={handleGenerateBill}
          sx={{
            bgcolor: '#2E7D32',
            color: '#FFFFFF',
            fontWeight: 700,
            fontSize: '0.8rem',
            borderRadius: '10px',
            py: 1.2,
            boxShadow: 'none',
            '&:hover': { bgcolor: '#1B5E20' },
          }}
        >
          Generate Bill
        </Button>

        <Button
          variant="outlined"
          startIcon={<AddCircleIcon />}
          onClick={() => setPtsDialogOpen(true)}
          sx={{
            borderColor: '#A8828F',
            color: '#6A3F4D',
            fontWeight: 700,
            fontSize: '0.8rem',
            borderRadius: '10px',
            py: 1.2,
            bgcolor: '#F8F4EE',
            '&:hover': { borderColor: '#6A3F4D', bgcolor: '#F8F4EE' },
          }}
        >
          Add Points
        </Button>

        <Button
          variant="outlined"
          startIcon={<RedeemIcon />}
          onClick={() => setRedeemDialogOpen(true)}
          sx={{
            borderColor: '#A8828F',
            color: '#6A3F4D',
            fontWeight: 700,
            fontSize: '0.8rem',
            borderRadius: '10px',
            py: 1.2,
            bgcolor: '#F8F4EE',
            '&:hover': { borderColor: '#6A3F4D', bgcolor: '#F8F4EE' },
          }}
        >
          Redeem Points
        </Button>

        <Button
          variant="outlined"
          startIcon={<PhoneIcon />}
          onClick={handleCall}
          sx={{
            borderColor: '#1565C0',
            color: '#1565C0',
            fontWeight: 700,
            fontSize: '0.8rem',
            borderRadius: '10px',
            py: 1.2,
            bgcolor: '#E3F2FD',
            '&:hover': { bgcolor: '#BBDEFB' },
          }}
        >
          Call
        </Button>

        <Button
          variant="contained"
          startIcon={<WhatsAppIcon />}
          onClick={handleWhatsApp}
          sx={{
            bgcolor: '#25D366',
            color: '#FFFFFF',
            fontWeight: 800,
            fontSize: '0.8rem',
            borderRadius: '10px',
            py: 1.2,
            boxShadow: 'none',
            '&:hover': { bgcolor: '#128C7E' },
          }}
        >
          WhatsApp
        </Button>
      </Box>

      {/* Dialog for Add Points */}
      <Dialog open={ptsDialogOpen} onClose={() => setPtsDialogOpen(false)}>
        <DialogTitle sx={{ fontWeight: 800 }}>Add Loyalty Points</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            type="number"
            label="Points to Add"
            value={ptsVal}
            onChange={(e) => setPtsVal(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setPtsDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={submitAddPoints} sx={{ bgcolor: '#6A3F4D' }}>
            Add Points
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for Redeem Points */}
      <Dialog open={redeemDialogOpen} onClose={() => setRedeemDialogOpen(false)}>
        <DialogTitle sx={{ fontWeight: 800 }}>Redeem Loyalty Points</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 1, color: '#6E5C63' }}>
            Available Points: {customer.loyalty.availablePoints}
          </Typography>
          <TextField
            fullWidth
            type="number"
            label="Points to Redeem"
            value={ptsVal}
            onChange={(e) => setPtsVal(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setRedeemDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={submitRedeemPoints} sx={{ bgcolor: '#2E7D32' }}>
            Redeem
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};
