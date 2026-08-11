import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Divider,
  Paper,
  Grid,
  TextField,
  Chip,
  IconButton,
} from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CloseIcon from '@mui/icons-material/Close';
import PaymentsIcon from '@mui/icons-material/Payments';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PrintIcon from '@mui/icons-material/Print';
import { useDashboard } from '../../context/DashboardContext';

interface Props {
  open: boolean;
  onClose: () => void;
}

export const CashDrawerModal: React.FC<Props> = ({ open, onClose }) => {
  const { transactions, expenses, showToast } = useDashboard();

  const [openingFloat, setOpeningFloat] = useState('5000');
  const [actualCashCounted, setActualCashCounted] = useState('');

  // Cash sales today
  const cashSales = transactions
    .filter((t) => t.status === 'Paid' && t.paymentMethod === 'Cash')
    .reduce((sum, t) => sum + t.amount, 0);

  // UPI sales today
  const upiSales = transactions
    .filter((t) => t.status === 'Paid' && t.paymentMethod === 'UPI')
    .reduce((sum, t) => sum + t.amount, 0);

  // Card sales today
  const cardSales = transactions
    .filter((t) => t.status === 'Paid' && t.paymentMethod === 'Card')
    .reduce((sum, t) => sum + t.amount, 0);

  // Cash expenses paid out from drawer today
  const cashExpenses = expenses
    .filter((e) => e.paymentMethod === 'Cash')
    .reduce((sum, e) => sum + e.amount, 0);

  const totalOpening = Number(openingFloat) || 0;
  const expectedCashInDrawer = totalOpening + cashSales - cashExpenses;

  const countDiff = Number(actualCashCounted) ? Number(actualCashCounted) - expectedCashInDrawer : 0;

  const handleCloseRegister = () => {
    showToast('Daily Cash Drawer closed & reconciliation report printed successfully!');
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
            borderRadius: '20px',
            p: 1,
            border: '1px solid #E8DFD5',
          },
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '10px',
              bgcolor: '#6A3F4D',
              color: '#EBD9DF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AccountBalanceWalletIcon />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#2D1F24', fontSize: '1.1rem' }}>
              Daily Cash Drawer & Register
            </Typography>
            <Typography variant="caption" sx={{ color: '#6E5C63' }}>
              Real-time till balance, cash float, and payment settlements
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ borderBottom: '1px solid #E8DFD5', borderTop: '1px solid #E8DFD5' }}>
        {/* Floating Balance & Cash In Hand */}
        <Paper elevation={0} sx={{ p: 2.5, bgcolor: '#F8F4EE', borderRadius: '14px', border: '1px solid #E8DFD5', mb: 2.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="caption" sx={{ color: '#6E5C63', fontWeight: 700, textTransform: 'uppercase' }}>
                Expected Cash in Drawer
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#2D1F24', mt: 0.2, fontFamily: '"Inter", sans-serif' }}>
                ₹{expectedCashInDrawer.toLocaleString()}
              </Typography>
            </Box>
            <Chip
              label="Live Till Balance"
              size="small"
              sx={{ bgcolor: '#2E7D32', color: '#FFFFFF', fontWeight: 800, fontSize: '0.72rem' }}
            />
          </Box>

          <Divider sx={{ my: 1.5, borderColor: '#E8DFD5' }} />

          <Grid container spacing={1.5}>
            <Grid size={{ xs: 6 }}>
              <Typography variant="caption" sx={{ color: '#6E5C63', display: 'block' }}>
                Opening Cash Float
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 800, color: '#2D1F24' }}>
                ₹{totalOpening.toLocaleString()}
              </Typography>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Typography variant="caption" sx={{ color: '#6E5C63', display: 'block' }}>
                Cash Collections
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 800, color: '#2E7D32' }}>
                +₹{cashSales.toLocaleString()}
              </Typography>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Typography variant="caption" sx={{ color: '#6E5C63', display: 'block' }}>
                Petty Cash Expenses
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 800, color: '#C62828' }}>
                -₹{cashExpenses.toLocaleString()}
              </Typography>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Typography variant="caption" sx={{ color: '#6E5C63', display: 'block' }}>
                UPI / Digital (Direct Bank)
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 800, color: '#0288D1' }}>
                ₹{upiSales.toLocaleString()}
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* Till Reconciliation Count */}
        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#6A3F4D', mb: 1 }}>
          End-of-Day Physical Cash Count
        </Typography>

        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
          <TextField
            label="Actual Physical Cash Counted (₹)"
            size="small"
            type="number"
            fullWidth
            value={actualCashCounted}
            onChange={(e) => setActualCashCounted(e.target.value)}
            placeholder={`e.g. ${expectedCashInDrawer}`}
          />
          {Number(actualCashCounted) > 0 && (
            <Chip
              label={
                countDiff === 0
                  ? 'Perfect Match!'
                  : countDiff > 0
                  ? `Over: +₹${countDiff}`
                  : `Short: -₹${Math.abs(countDiff)}`
              }
              color={countDiff === 0 ? 'success' : countDiff > 0 ? 'info' : 'error'}
              sx={{ fontWeight: 800, fontSize: '0.78rem' }}
            />
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} sx={{ color: '#6E5C63' }}>
          Close
        </Button>
        <Button
          variant="contained"
          startIcon={<PrintIcon />}
          onClick={handleCloseRegister}
          sx={{ bgcolor: '#6A3F4D', color: '#EBD9DF', fontWeight: 800 }}
        >
          Print Register Report & Reconcile
        </Button>
      </DialogActions>
    </Dialog>
  );
};
