import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from '@mui/material';
import { ExpenseCategory, PaymentMethod, ExpenseStatus } from '../../types/expense';
import { useExpenses } from './ExpensesContext';

export const AddEditExpenseModal: React.FC = () => {
  const {
    isAddModalOpen,
    setIsAddModalOpen,
    editingExpense,
    addExpense,
    updateExpense,
  } = useExpenses();

  const isEdit = Boolean(editingExpense);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Utilities & Rent');
  const [amount, setAmount] = useState(1500);
  const [date, setDate] = useState('2026-08-08');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI / GPay');
  const [paidTo, setPaidTo] = useState('');
  const [approvedBy, setApprovedBy] = useState('Karan Sharma (Manager)');
  const [status, setStatus] = useState<ExpenseStatus>('Approved');
  const [receiptUrl, setReceiptUrl] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (editingExpense) {
      setTitle(editingExpense.title);
      setCategory(editingExpense.category);
      setAmount(editingExpense.amount);
      setDate(editingExpense.date);
      setPaymentMethod(editingExpense.paymentMethod);
      setPaidTo(editingExpense.paidTo);
      setApprovedBy(editingExpense.approvedBy);
      setStatus(editingExpense.status);
      setReceiptUrl(editingExpense.receiptUrl || '');
      setNotes(editingExpense.notes || '');
    } else {
      setTitle('');
      setCategory('Utilities & Rent');
      setAmount(2500);
      setDate('2026-08-08');
      setPaymentMethod('UPI / GPay');
      setPaidTo('');
      setApprovedBy('Karan Sharma (Manager)');
      setStatus('Approved');
      setReceiptUrl('');
      setNotes('');
    }
  }, [editingExpense, isAddModalOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !paidTo.trim() || amount <= 0) return;

    if (isEdit && editingExpense) {
      updateExpense(editingExpense.id, {
        title,
        category,
        amount,
        date,
        paymentMethod,
        paidTo,
        approvedBy,
        status,
        receiptUrl: receiptUrl || undefined,
        notes: notes || undefined,
      });
    } else {
      addExpense({
        title,
        category,
        amount,
        date,
        paymentMethod,
        paidTo,
        approvedBy,
        status,
        receiptUrl: receiptUrl || undefined,
        notes: notes || undefined,
      });
    }

    setIsAddModalOpen(false);
  };

  return (
    <Dialog
      open={isAddModalOpen}
      onClose={() => setIsAddModalOpen(false)}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: { borderRadius: '16px', p: 1 },
        },
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ fontWeight: 800, color: '#2D1F24', fontFamily: '"Playfair Display", serif' }}>
          {isEdit ? 'Edit Operational Expense Record' : 'Log New Salon Expense'}
        </DialogTitle>

        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <TextField
            required
            label="Expense Description / Title"
            placeholder="e.g. Loreal Conditioner Stock Order"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth required>
                <InputLabel>Expense Category</InputLabel>
                <Select
                  value={category}
                  label="Expense Category"
                  onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                >
                  <MenuItem value="Utilities & Rent">Utilities & Rent</MenuItem>
                  <MenuItem value="Salon Supplies">Salon Supplies</MenuItem>
                  <MenuItem value="Staff Welfare & Refreshments">Staff Welfare & Refreshments</MenuItem>
                  <MenuItem value="Maintenance & Repairs">Maintenance & Repairs</MenuItem>
                  <MenuItem value="Marketing & Ads">Marketing & Ads</MenuItem>
                  <MenuItem value="Software & Tech">Software & Tech</MenuItem>
                  <MenuItem value="Miscellaneous">Miscellaneous</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                required
                label="Amount (₹)"
                type="number"
                fullWidth
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                required
                label="Vendor / Paid To"
                placeholder="e.g. Beauty Wholesale Traders"
                fullWidth
                value={paidTo}
                onChange={(e) => setPaidTo(e.target.value)}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                required
                label="Transaction Date"
                type="date"
                fullWidth
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth required>
                <InputLabel>Payment Mode</InputLabel>
                <Select
                  value={paymentMethod}
                  label="Payment Mode"
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                >
                  <MenuItem value="UPI / GPay">UPI / GPay</MenuItem>
                  <MenuItem value="Cash">Cash</MenuItem>
                  <MenuItem value="Credit Card">Credit Card</MenuItem>
                  <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth required>
                <InputLabel>Approval Status</InputLabel>
                <Select
                  value={status}
                  label="Approval Status"
                  onChange={(e) => setStatus(e.target.value as ExpenseStatus)}
                >
                  <MenuItem value="Approved">Approved</MenuItem>
                  <MenuItem value="Pending Approval">Pending Approval</MenuItem>
                  <MenuItem value="Reimbursed">Reimbursed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <TextField
            label="Approved By (Manager Name)"
            placeholder="Karan Sharma (Manager)"
            fullWidth
            value={approvedBy}
            onChange={(e) => setApprovedBy(e.target.value)}
          />

          <TextField
            label="Receipt Document / Photo URL (Optional)"
            placeholder="https://images.unsplash.com/..."
            fullWidth
            value={receiptUrl}
            onChange={(e) => setReceiptUrl(e.target.value)}
          />

          <TextField
            label="Notes & Invoice Memo"
            placeholder="Add relevant invoice details, meter numbers, or PO notes..."
            multiline
            rows={2}
            fullWidth
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setIsAddModalOpen(false)} sx={{ color: '#6E5C63', fontWeight: 700 }}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={{
              bgcolor: '#6A3F4D',
              color: '#F8F4EE',
              fontWeight: 700,
              borderRadius: '8px',
              '&:hover': { bgcolor: '#4A2B35' },
            }}
          >
            {isEdit ? 'Update Expense' : 'Save Expense Record'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
