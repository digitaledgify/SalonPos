import React from 'react';
import { Box, Paper, Typography, Grid, LinearProgress, Chip } from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ReceiptIcon from '@mui/icons-material/Receipt';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import PaymentsIcon from '@mui/icons-material/Payments';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useDashboard } from '../../context/DashboardContext';

export const BillingSummaryCards: React.FC = () => {
  const { transactions } = useDashboard();

  // Paid transactions
  const paidTx = transactions.filter((t) => t.status === 'Paid');
  const pendingTx = transactions.filter((t) => t.status === 'Pending');

  const totalPaidRevenue = paidTx.reduce((sum, t) => sum + t.amount, 0);
  const totalPendingRevenue = pendingTx.reduce((sum, t) => sum + t.amount, 0);

  // Estimated 18% GST collected on paid invoices
  const totalGstCollected = Math.round(totalPaidRevenue * 0.18);
  const netBeforeTax = totalPaidRevenue - totalGstCollected;

  // Average ticket size
  const avgTicket = paidTx.length > 0 ? Math.round(totalPaidRevenue / paidTx.length) : 0;

  // Payment Breakdown
  const upiTotal = paidTx
    .filter((t) => t.paymentMethod === 'UPI')
    .reduce((sum, t) => sum + t.amount, 0);
  const cardTotal = paidTx
    .filter((t) => t.paymentMethod === 'Card')
    .reduce((sum, t) => sum + t.amount, 0);
  const cashTotal = paidTx
    .filter((t) => t.paymentMethod === 'Cash')
    .reduce((sum, t) => sum + t.amount, 0);
  const splitTotal = paidTx
    .filter((t) => t.paymentMethod === 'Split')
    .reduce((sum, t) => sum + t.amount, 0);

  const upiPercent = totalPaidRevenue > 0 ? Math.round((upiTotal / totalPaidRevenue) * 100) : 0;

  return (
    <Grid container spacing={2.5} sx={{ mb: 3 }}>
      {/* 1. Total Billed Revenue */}
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            borderRadius: '16px',
            bgcolor: '#FFFFFF',
            border: '1px solid #E8DFD5',
            boxShadow: '0 2px 10px rgba(107, 79, 58, 0.04)',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '4px',
              height: '100%',
              bgcolor: '#6A3F4D',
            },
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
            <Box>
              <Typography variant="caption" sx={{ color: '#6E5C63', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Total Revenue
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#2D1F24', mt: 0.5, fontFamily: '"Inter", sans-serif' }}>
                ₹{totalPaidRevenue.toLocaleString()}
              </Typography>
            </Box>
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: '12px',
                bgcolor: '#F8F4EE',
                color: '#6A3F4D',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #E8DFD5',
              }}
            >
              <AccountBalanceIcon sx={{ fontSize: 22 }} />
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mt: 1 }}>
            <Typography variant="caption" sx={{ color: '#6E5C63', fontWeight: 600 }}>
              {paidTx.length} Invoices
            </Typography>
          </Box>
        </Paper>
      </Grid>

      {/* 2. Tax / GST Collected */}
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            borderRadius: '16px',
            bgcolor: '#FFFFFF',
            border: '1px solid #E8DFD5',
            boxShadow: '0 2px 10px rgba(107, 79, 58, 0.04)',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '4px',
              height: '100%',
              bgcolor: '#0288D1',
            },
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
            <Box>
              <Typography variant="caption" sx={{ color: '#6E5C63', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                18% GST Collected
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#0288D1', mt: 0.5, fontFamily: '"Inter", sans-serif' }}>
                ₹{totalGstCollected.toLocaleString()}
              </Typography>
            </Box>
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: '12px',
                bgcolor: '#E1F5FE',
                color: '#0288D1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ReceiptIcon sx={{ fontSize: 22 }} />
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="caption" sx={{ color: '#6E5C63', fontWeight: 600 }}>
              Net Sales: ₹{netBeforeTax.toLocaleString()}
            </Typography>
          </Box>
        </Paper>
      </Grid>

      {/* 3. Average Ticket Size */}
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            borderRadius: '16px',
            bgcolor: '#FFFFFF',
            border: '1px solid #E8DFD5',
            boxShadow: '0 2px 10px rgba(107, 79, 58, 0.04)',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '4px',
              height: '100%',
              bgcolor: '#2E7D32',
            },
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
            <Box>
              <Typography variant="caption" sx={{ color: '#6E5C63', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Average Ticket Size
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#2E7D32', mt: 0.5, fontFamily: '"Inter", sans-serif' }}>
                ₹{avgTicket.toLocaleString()}
              </Typography>
            </Box>
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: '12px',
                bgcolor: '#E8F5E9',
                color: '#2E7D32',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <PaymentsIcon sx={{ fontSize: 22 }} />
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="caption" sx={{ color: '#6E5C63', fontWeight: 600 }}>
              Target: ₹1,500 / Bill
            </Typography>
          </Box>
        </Paper>
      </Grid>

      {/* 4. Digital UPI vs Cash Ratio */}
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            borderRadius: '16px',
            bgcolor: '#FFFFFF',
            border: '1px solid #E8DFD5',
            boxShadow: '0 2px 10px rgba(107, 79, 58, 0.04)',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '4px',
              height: '100%',
              bgcolor: '#A8828F',
            },
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
            <Box>
              <Typography variant="caption" sx={{ color: '#6E5C63', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Digital UPI Share
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#2D1F24', mt: 0.5, fontFamily: '"Inter", sans-serif' }}>
                {upiPercent}%
              </Typography>
            </Box>
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: '12px',
                bgcolor: '#F8F4EE',
                color: '#6A3F4D',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #E8DFD5',
              }}
            >
              <QrCode2Icon sx={{ fontSize: 22 }} />
            </Box>
          </Box>

          <Box sx={{ mt: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography variant="caption" sx={{ color: '#6E5C63', fontWeight: 600 }}>
                UPI: ₹{upiTotal.toLocaleString()}
              </Typography>
              <Typography variant="caption" sx={{ color: '#6A3F4D', fontWeight: 800 }}>
                Cash: ₹{cashTotal.toLocaleString()}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={upiPercent}
              sx={{
                height: 6,
                borderRadius: 3,
                bgcolor: '#F8F4EE',
                '& .MuiLinearProgress-bar': {
                  bgcolor: '#6A3F4D',
                  borderRadius: 3,
                },
              }}
            />
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};
