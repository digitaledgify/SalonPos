import React from 'react';
import { Grid, Paper, Box, Typography } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CategoryIcon from '@mui/icons-material/Category';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useExpenses } from './ExpensesContext';

export const ExpensesSummaryCards: React.FC = () => {
  const { expenses } = useExpenses();

  const totalMonthlyExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  const pendingExpenses = expenses.filter((e) => e.status === 'Pending Approval');
  const pendingCount = pendingExpenses.length;
  const pendingAmount = pendingExpenses.reduce((acc, curr) => acc + curr.amount, 0);

  // Top Category
  const categoryTotals: Record<string, number> = {};
  expenses.forEach((e) => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  });
  let topCategory = '—';
  let maxCatAmount = 0;
  Object.entries(categoryTotals).forEach(([cat, amt]) => {
    if (amt > maxCatAmount) {
      maxCatAmount = amt;
      topCategory = cat;
    }
  });

  const dailyBurnAvg = Math.round(totalMonthlyExpenses / 30);

  return (
    <Grid container spacing={2.5} sx={{ mb: 3 }}>
      {/* Total Expenses Card */}
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            borderRadius: '16px',
            bgcolor: '#FFFFFF',
            border: '1px solid #E8DFD5',
            height: '100%',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
            <Typography variant="caption" sx={{ color: '#6E5C63', fontWeight: 800, textTransform: 'uppercase' }}>
              Total Month Expenses
            </Typography>
            <Box sx={{ p: 1, borderRadius: '10px', bgcolor: '#F8F4EE', color: '#6A3F4D' }}>
              <AccountBalanceWalletIcon sx={{ fontSize: 20 }} />
            </Box>
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#2D1F24', fontSize: '1.75rem', fontFamily: '"Inter", sans-serif' }}>
            ₹{totalMonthlyExpenses.toLocaleString('en-IN')}
          </Typography>
          <Typography variant="caption" sx={{ color: '#6E5C63', mt: 0.5, display: 'block' }}>
            {expenses.length} logged line items this month
          </Typography>
        </Paper>
      </Grid>

      {/* Pending Approval Card */}
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            borderRadius: '16px',
            bgcolor: pendingCount > 0 ? '#FFF8E1' : '#FFFFFF',
            border: pendingCount > 0 ? '1px solid #FFE082' : '1px solid #E8DFD5',
            height: '100%',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
            <Typography
              variant="caption"
              sx={{ color: pendingCount > 0 ? '#B78103' : '#6E5C63', fontWeight: 800, textTransform: 'uppercase' }}
            >
              Pending Manager Approval
            </Typography>
            <Box sx={{ p: 1, borderRadius: '10px', bgcolor: pendingCount > 0 ? '#FFF3C4' : '#F8F4EE', color: '#ED6C02' }}>
              <PendingActionsIcon sx={{ fontSize: 20 }} />
            </Box>
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: pendingCount > 0 ? '#B78103' : '#2D1F24', fontSize: '1.75rem', fontFamily: '"Inter", sans-serif' }}>
            ₹{pendingAmount.toLocaleString('en-IN')}
          </Typography>
          <Typography variant="caption" sx={{ color: pendingCount > 0 ? '#8D6100' : '#6E5C63', mt: 0.5, display: 'block' }}>
            {pendingCount} claims requiring verification
          </Typography>
        </Paper>
      </Grid>

      {/* Top Expense Category Card */}
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            borderRadius: '16px',
            bgcolor: '#FFFFFF',
            border: '1px solid #E8DFD5',
            height: '100%',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
            <Typography variant="caption" sx={{ color: '#6E5C63', fontWeight: 800, textTransform: 'uppercase' }}>
              Highest Cost Sector
            </Typography>
            <Box sx={{ p: 1, borderRadius: '10px', bgcolor: '#F8F4EE', color: '#6A3F4D' }}>
              <CategoryIcon sx={{ fontSize: 20 }} />
            </Box>
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#2D1F24', fontSize: '1.15rem' }}>
            {topCategory}
          </Typography>
          <Typography variant="caption" sx={{ color: '#2E7D32', fontWeight: 700, mt: 0.5, display: 'block', fontFamily: '"Inter", sans-serif' }}>
            ₹{maxCatAmount.toLocaleString('en-IN')} ({Math.round((maxCatAmount / (totalMonthlyExpenses || 1)) * 100)}% of total)
          </Typography>
        </Paper>
      </Grid>

      {/* Daily Average Burn Rate */}
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            borderRadius: '16px',
            bgcolor: '#FFFFFF',
            border: '1px solid #E8DFD5',
            height: '100%',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
            <Typography variant="caption" sx={{ color: '#6E5C63', fontWeight: 800, textTransform: 'uppercase' }}>
              Daily Avg Operating Burn
            </Typography>
            <Box sx={{ p: 1, borderRadius: '10px', bgcolor: '#F8F4EE', color: '#6A3F4D' }}>
              <TrendingUpIcon sx={{ fontSize: 20 }} />
            </Box>
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#2D1F24', fontSize: '1.75rem', fontFamily: '"Inter", sans-serif' }}>
            ₹{dailyBurnAvg.toLocaleString('en-IN')}
          </Typography>
          <Typography variant="caption" sx={{ color: '#6E5C63', mt: 0.5, display: 'block' }}>
            Average daily operational outflow
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
};
