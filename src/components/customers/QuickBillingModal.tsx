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
  Divider,
} from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { useCustomers } from '../../context/CustomerContext';

export const QuickBillingModal: React.FC = () => {
  const { isBillingOpen, setIsBillingOpen, targetCustomerForAction, addVisitToCustomer } = useCustomers();

  const [stylist, setStylist] = useState('Aarav Kapoor');
  const [service, setService] = useState('Hair Cut & Styling');
  const [amount, setAmount] = useState(1500);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'Cash' | 'Split'>('UPI');

  useEffect(() => {
    if (targetCustomerForAction) {
      if (targetCustomerForAction.preferredStylist) setStylist(targetCustomerForAction.preferredStylist);
      if (targetCustomerForAction.membership?.discountPercent) setDiscountPercent(targetCustomerForAction.membership.discountPercent);
    }
  }, [targetCustomerForAction]);

  const discountVal = Math.round(amount * (discountPercent / 100));
  const baseAfterDiscount = amount - discountVal;
  const gst = Math.round(baseAfterDiscount * 0.18);
  const totalPaid = baseAfterDiscount + gst;

  const handleSubmit = () => {
    if (targetCustomerForAction) {
      const invNo = `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      addVisitToCustomer(targetCustomerForAction.id, {
        invoiceNo: invNo,
        date: new Date().toISOString().split('T')[0],
        stylistName: stylist,
        services: [service],
        amount,
        discount: discountVal,
        gst,
        totalPaid,
        paymentMethod,
        status: 'Completed',
      });
      setIsBillingOpen(false);
    }
  };

  return (
    <Dialog open={isBillingOpen} onClose={() => setIsBillingOpen(false)} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 800, color: '#2D1F24', display: 'flex', alignItems: 'center', gap: 1 }}>
        <ReceiptIcon sx={{ color: '#2E7D32' }} />
        Generate Bill & Invoice — {targetCustomerForAction?.fullName}
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} sx={{ pt: 1 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth label="Customer" value={targetCustomerForAction?.fullName || ''} disabled size="small" />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField fullWidth label="Membership Discount" value={`${discountPercent}% Tier Discount`} disabled size="small" />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField select fullWidth label="Stylist" value={stylist} onChange={(e) => setStylist(e.target.value)} size="small">
              {['Aarav Kapoor', 'Pooja Sharma', 'Rohan Verma', 'Karan Malhotra', 'Ananya Roy', 'Vikram Singh'].map((s) => (
                <MenuItem key={s} value={s}>{s}</MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField select fullWidth label="Service Rendered" value={service} onChange={(e) => setService(e.target.value)} size="small">
              {['Hair Cut & Styling', 'Hair Spa & Keratin', 'Hydra Facial Glow', 'Balayage / Hair Color', 'Pedicure & Manicure'].map((srv) => (
                <MenuItem key={srv} value={srv}>{srv}</MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              type="number"
              label="Service Amount (₹)"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value) || 0)}
              size="small"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField select fullWidth label="Payment Method" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as any)} size="small">
              <MenuItem value="UPI">UPI / GPay / PhonePe</MenuItem>
              <MenuItem value="Card">Credit / Debit Card</MenuItem>
              <MenuItem value="Cash">Cash</MenuItem>
              <MenuItem value="Split">Split Payment</MenuItem>
            </TextField>
          </Grid>

          {/* Bill Summary */}
          <Grid size={12}>
            <Box sx={{ p: 2, bgcolor: '#F8F4EE', borderRadius: '12px', border: '1px solid #E8DFD5' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2" sx={{ color: '#6E5C63' }}>Subtotal Amount:</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>₹{amount.toLocaleString()}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2" sx={{ color: '#D32F2F' }}>Member Discount ({discountPercent}%):</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#D32F2F' }}>-₹{discountVal.toLocaleString()}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2" sx={{ color: '#6E5C63' }}>GST (18%):</Typography>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>+₹{gst.toLocaleString()}</Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#2D1F24' }}>Total Amount Payable:</Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#2E7D32' }}>₹{totalPaid.toLocaleString()}</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={() => setIsBillingOpen(false)}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} sx={{ bgcolor: '#2E7D32' }}>
          Collect ₹{totalPaid.toLocaleString()} & Generate Invoice
        </Button>
      </DialogActions>
    </Dialog>
  );
};
