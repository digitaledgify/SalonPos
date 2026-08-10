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
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import { useDashboard } from '../context/DashboardContext';
import { PaymentMethod } from '../types';

export const AddExpenseModal: React.FC = () => {
  const { isAddExpenseOpen, setIsAddExpenseOpen, addExpense } = useDashboard();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Supplies');
  const [amount, setAmount] = useState('1200');
  const [paidTo, setPaidTo] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount) return;

    addExpense({
      title,
      category,
      amount: Number(amount),
      paidTo: paidTo || 'Vendor',
      paymentMethod,
    });

    setIsAddExpenseOpen(false);
    setTitle('');
    setAmount('');
    setPaidTo('');
  };

  return (
    <Dialog
      open={isAddExpenseOpen}
      onClose={() => setIsAddExpenseOpen(false)}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: { sx: { borderRadius: '16px', p: 1 } },
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, pb: 1 }}>
        <RequestQuoteIcon sx={{ color: '#6A3F4D' }} />
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#2D1F24' }}>
          Record Salon Expense
        </Typography>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers sx={{ borderBottom: '1px solid #E8DFD5', borderTop: '1px solid #E8DFD5' }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            <TextField
              label="Expense Title"
              fullWidth
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Laundry & Towels Clean"
              size="small"
            />
            <TextField
              label="Category"
              select
              fullWidth
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              size="small"
            >
              <MenuItem value="Supplies">Salon Consumable Supplies</MenuItem>
              <MenuItem value="Maintenance">Maintenance & Repairs</MenuItem>
              <MenuItem value="Utilities">Electricity & Water</MenuItem>
              <MenuItem value="Tea/Coffee">Refreshments for Clients</MenuItem>
              <MenuItem value="Marketing">Local Marketing / Flyers</MenuItem>
            </TextField>
            <TextField
              label="Amount (₹)"
              type="number"
              fullWidth
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              size="small"
            />
            <TextField
              label="Paid To (Vendor/Person)"
              fullWidth
              value={paidTo}
              onChange={(e) => setPaidTo(e.target.value)}
              placeholder="e.g. Metro Laundry"
              size="small"
            />
            <Box sx={{ gridColumn: { sm: 'span 2' } }}>
              <TextField
                label="Payment Method"
                select
                fullWidth
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                size="small"
              >
                <MenuItem value="UPI">UPI / GPay</MenuItem>
                <MenuItem value="Cash">Cash</MenuItem>
                <MenuItem value="Card">Card</MenuItem>
              </TextField>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ pt: 2, px: 3 }}>
          <Button onClick={() => setIsAddExpenseOpen(false)} sx={{ color: '#6E5C63' }}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" sx={{ bgcolor: '#6A3F4D', color: '#FFFFFF' }}>
            Log Expense
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
