import React from 'react';
import { Paper, Box, Typography, Grid, LinearProgress } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { DEPARTMENT_REVENUE_SHARES, PAYMENT_MODES_DISTRIBUTION } from '../../services/reportData';

export const DepartmentBreakdownChart: React.FC = () => {
  return (
    <Grid container spacing={2.5}>
      {/* Department Share Pie Chart */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', bgcolor: '#FFFFFF', border: '1px solid #E8DFD5', height: '100%' }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#2D1F24', fontSize: '1.1rem', mb: 0.5 }}>
            Revenue Share by Department
          </Typography>
          <Typography variant="body2" sx={{ color: '#6E5C63', mb: 2 }}>
            Contribution of Hair Care, Skin Aesthetics, Barbering & Product Retail.
          </Typography>

          <Box sx={{ width: '100%', height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={DEPARTMENT_REVENUE_SHARES}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="revenue"
                  nameKey="department"
                >
                  {DEPARTMENT_REVENUE_SHARES.map((entry) => (
                    <Cell key={entry.department} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any) => `₹${Number(val).toLocaleString('en-IN')}`}
                  contentStyle={{ backgroundColor: '#F8F4EE', borderRadius: '12px', borderColor: '#EBD9DF' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Box>

          {/* Department Legend */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
            {DEPARTMENT_REVENUE_SHARES.map((dept) => (
              <Box key={dept.department} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: '3px', bgcolor: dept.color }} />
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#2D1F24' }}>
                    {dept.department}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 800, color: '#6A3F4D' }}>
                  ₹{dept.revenue.toLocaleString('en-IN')} ({dept.percentage}%)
                </Typography>
              </Box>
            ))}
          </Box>
        </Paper>
      </Grid>

      {/* Payment Channel Split */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', bgcolor: '#FFFFFF', border: '1px solid #E8DFD5', height: '100%' }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#2D1F24', fontSize: '1.1rem', mb: 0.5 }}>
            Payment Mode Collection Share
          </Typography>
          <Typography variant="body2" sx={{ color: '#6E5C63', mb: 3 }}>
            Breakdown of digital UPI, POS card swipes, and cash counter receipts.
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {PAYMENT_MODES_DISTRIBUTION.map((pm) => (
              <Box key={pm.mode}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.8 }}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#2D1F24' }}>
                      {pm.mode}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#6E5C63' }}>
                      {pm.count} transactions completed
                    </Typography>
                  </Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#6A3F4D' }}>
                    ₹{pm.amount.toLocaleString('en-IN')} ({pm.percentage}%)
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={pm.percentage}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: '#F8F4EE',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: '#6A3F4D',
                      borderRadius: 4,
                    },
                  }}
                />
              </Box>
            ))}
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};
