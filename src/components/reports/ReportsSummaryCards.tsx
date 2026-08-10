import React from 'react';
import { Grid, Paper, Box, Typography, Chip } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { MONTHLY_FINANCIALS } from '../../services/reportData';

export const ReportsSummaryCards: React.FC = () => {
  const currentMonthData = MONTHLY_FINANCIALS[MONTHLY_FINANCIALS.length - 1];
  const grossRevenue = currentMonthData.revenue;
  const netProfit = currentMonthData.profit;
  const profitMarginPercent = Math.round((netProfit / grossRevenue) * 100);

  const avgTicketValue = 1850;
  const totalClientFootfall = 320;

  return (
    <Grid container spacing={2.5} sx={{ mb: 3 }}>
      {/* Gross Revenue Card */}
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Paper elevation={0} sx={{ p: 2.5, borderRadius: '16px', bgcolor: '#FFFFFF', border: '1px solid #E8DFD5' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="caption" sx={{ color: '#6E5C63', fontWeight: 800, textTransform: 'uppercase' }}>
              Gross Revenue (YTD)
            </Typography>
            <Box sx={{ p: 1, borderRadius: '10px', bgcolor: '#E8F5E9', color: '#2E7D32' }}>
              <TrendingUpIcon sx={{ fontSize: 20 }} />
            </Box>
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#2D1F24', fontSize: '1.75rem', fontFamily: '"Poppins", sans-serif' }}>
            ₹{grossRevenue.toLocaleString('en-IN')}
          </Typography>
        </Paper>
      </Grid>

      {/* Net Profit Card */}
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Paper elevation={0} sx={{ p: 2.5, borderRadius: '16px', bgcolor: '#F8F4EE', border: '1px solid #EBD9DF' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="caption" sx={{ color: '#6A3F4D', fontWeight: 800, textTransform: 'uppercase' }}>
              Net Operating Profit
            </Typography>
            <Box sx={{ p: 1, borderRadius: '10px', bgcolor: '#FFFFFF', color: '#6A3F4D' }}>
              <AccountBalanceIcon sx={{ fontSize: 20 }} />
            </Box>
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#6A3F4D', fontSize: '1.75rem', fontFamily: '"Poppins", sans-serif' }}>
            ₹{netProfit.toLocaleString('en-IN')}
          </Typography>
          <Typography variant="caption" sx={{ color: '#6E5C63', mt: 0.8, display: 'block', fontWeight: 700, fontFamily: '"Poppins", sans-serif' }}>
            {profitMarginPercent}% Net Profit Margin
          </Typography>
        </Paper>
      </Grid>

      {/* Average Ticket Size Card */}
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Paper elevation={0} sx={{ p: 2.5, borderRadius: '16px', bgcolor: '#FFFFFF', border: '1px solid #E8DFD5' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="caption" sx={{ color: '#6E5C63', fontWeight: 800, textTransform: 'uppercase' }}>
              Avg Ticket / Invoice Size
            </Typography>
            <Box sx={{ p: 1, borderRadius: '10px', bgcolor: '#F8F4EE', color: '#6A3F4D' }}>
              <ConfirmationNumberIcon sx={{ fontSize: 20 }} />
            </Box>
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#2D1F24', fontSize: '1.75rem', fontFamily: '"Poppins", sans-serif' }}>
            ₹{avgTicketValue.toLocaleString('en-IN')}
          </Typography>
          <Typography variant="caption" sx={{ color: '#6E5C63', mt: 0.8, display: 'block' }}>
            Average spend per visiting client
          </Typography>
        </Paper>
      </Grid>

      {/* Total Client Footfall */}
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Paper elevation={0} sx={{ p: 2.5, borderRadius: '16px', bgcolor: '#FFFFFF', border: '1px solid #E8DFD5' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="caption" sx={{ color: '#6E5C63', fontWeight: 800, textTransform: 'uppercase' }}>
              Total Client Footfall
            </Typography>
            <Box sx={{ p: 1, borderRadius: '10px', bgcolor: '#F8F4EE', color: '#6A3F4D' }}>
              <PeopleAltIcon sx={{ fontSize: 20 }} />
            </Box>
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#2D1F24', fontSize: '1.75rem', fontFamily: '"Poppins", sans-serif' }}>
            {totalClientFootfall} Visits
          </Typography>
          <Typography variant="caption" sx={{ color: '#6E5C63', mt: 0.8, display: 'block' }}>
            78% Repeat / Returning Clients
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
};
