import React from 'react';
import { Paper, Box, Typography } from '@mui/material';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { MONTHLY_FINANCIALS } from '../../services/reportData';

export const RevenueExpenseChart: React.FC = () => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: '16px',
        bgcolor: '#FFFFFF',
        border: '1px solid #E8DFD5',
      }}
    >
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, color: '#2D1F24', fontSize: '1.1rem' }}>
          Monthly Financial Growth & Net Profit
        </Typography>
        <Typography variant="body2" sx={{ color: '#6E5C63' }}>
          Compare Gross Revenue (₹) vs Operational Expenses (₹) and Net Operating Margin month-over-month.
        </Typography>
      </Box>

      <Box sx={{ width: '100%', height: 340, mt: 3 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={MONTHLY_FINANCIALS} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0EAE1" />
            <XAxis dataKey="month" tick={{ fill: '#6E5C63', fontSize: 12, fontWeight: 700 }} axisLine={{ stroke: '#E8DFD5' }} />
            <YAxis
              tick={{ fill: '#6E5C63', fontSize: 11 }}
              axisLine={{ stroke: '#E8DFD5' }}
              tickFormatter={(val) => `₹${val / 1000}k`}
            />
            <Tooltip
              formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, '']}
              contentStyle={{ backgroundColor: '#F8F4EE', borderRadius: '12px', borderColor: '#EBD9DF' }}
            />
            <Legend wrapperStyle={{ paddingTop: '15px' }} />
            <Bar dataKey="revenue" name="Gross Revenue (₹)" fill="#6A3F4D" radius={[6, 6, 0, 0]} barSize={28} />
            <Bar dataKey="expenses" name="Operational Expenses (₹)" fill="#A8828F" radius={[6, 6, 0, 0]} barSize={28} />
            <Bar dataKey="profit" name="Net Profit (₹)" fill="#2E7D32" radius={[6, 6, 0, 0]} barSize={28} />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};
