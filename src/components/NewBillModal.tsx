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
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import { useDashboard } from '../context/DashboardContext';
import { PaymentMethod, TransactionStatus } from '../types';

export const NewBillModal: React.FC = () => {
  const { isNewBillOpen, setIsNewBillOpen, addTransaction, stylists } = useDashboard();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [stylistName, setStylistName] = useState('Aarav Kapoor');
  const [servicesInput, setServicesInput] = useState('Hair Cut, Head Massage');
  const [amount, setAmount] = useState('1850');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [status, setStatus] = useState<TransactionStatus>('Paid');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName) return;

    const servicesList = servicesInput.split(',').map((s) => s.trim());

    addTransaction({
      customerName,
      customerPhone: customerPhone || '+91 98765 00000',
      stylistName,
      services: servicesList,
      amount: Number(amount),
      paymentMethod,
      status,
    });

    setIsNewBillOpen(false);
    setCustomerName('');
    setCustomerPhone('');
  };

  return (
    <Dialog
      open={isNewBillOpen}
      onClose={() => setIsNewBillOpen(false)}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: { sx: { borderRadius: '16px', p: 1 } },
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, pb: 1 }}>
        <PointOfSaleIcon sx={{ color: '#6A3F4D' }} />
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#2D1F24' }}>
          Create New Bill (POS Checkout)
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
              placeholder="e.g. Ramesh Ahuja"
              size="small"
            />
            <TextField
              label="Customer Phone"
              fullWidth
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="+91 98123 00000"
              size="small"
            />
            <TextField
              label="Primary Stylist"
              select
              fullWidth
              value={stylistName}
              onChange={(e) => setStylistName(e.target.value)}
              size="small"
            >
              {stylists.map((s) => (
                <MenuItem key={s.id} value={s.name}>
                  {s.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Services (comma separated)"
              fullWidth
              value={servicesInput}
              onChange={(e) => setServicesInput(e.target.value)}
              size="small"
            />
            <TextField
              label="Total Amount (₹)"
              type="number"
              fullWidth
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              size="small"
            />
            <TextField
              label="Payment Method"
              select
              fullWidth
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
              size="small"
            >
              <MenuItem value="UPI">UPI / GPay / PhonePe</MenuItem>
              <MenuItem value="Cash">Cash</MenuItem>
              <MenuItem value="Card">Credit/Debit Card</MenuItem>
              <MenuItem value="Split">Split Payment</MenuItem>
            </TextField>
            <Box sx={{ gridColumn: { sm: 'span 2' } }}>
              <TextField
                label="Bill Status"
                select
                fullWidth
                value={status}
                onChange={(e) => setStatus(e.target.value as TransactionStatus)}
                size="small"
              >
                <MenuItem value="Paid">Paid</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
              </TextField>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ pt: 2, px: 3 }}>
          <Button onClick={() => setIsNewBillOpen(false)} sx={{ color: '#6E5C63' }}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" sx={{ bgcolor: '#6A3F4D', color: '#FFFFFF' }}>
            Generate Receipt & Print
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
