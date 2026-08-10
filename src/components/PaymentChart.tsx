import React from 'react';
import { Card, CardContent, Typography, Box, Stack } from '@mui/material';
import PieChartIcon from '@mui/icons-material/PieChart';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useDashboard } from '../context/DashboardContext';
import { formatCurrency } from '../utils/formatters';

const CustomPieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <Box
        sx={{
          bgcolor: '#2D1F24',
          color: '#FFFFFF',
          px: 1.5,
          py: 1,
          borderRadius: '10px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
        }}
      >
        <Typography variant="caption" sx={{ color: '#EBD9DF', fontWeight: 700 }}>
          {data.name} Payment
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 800 }}>
          {formatCurrency(data.value)} ({data.payload.percentage}%)
        </Typography>
      </Box>
    );
  }
  return null;
};

export const PaymentChart: React.FC = () => {
  const { paymentBreakdown } = useDashboard();

  return (
    <Card
      sx={{
        borderRadius: '16px',
        border: '1px solid #E8DFD5',
        bgcolor: '#FFFFFF',
        height: '100%',
      }}
    >
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '10px',
              bgcolor: '#F8F4EE',
              color: '#6A3F4D',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #E8DFD5',
            }}
          >
            <PieChartIcon sx={{ fontSize: 20 }} />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#2D1F24', fontSize: '1.05rem' }}>
            Payment Breakdown
          </Typography>
        </Box>

        <Box sx={{ width: '100%', height: 180, my: 1 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={paymentBreakdown}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={4}
                dataKey="value"
                isAnimationActive={true}
              >
                {paymentBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#FFFFFF" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip content={<CustomPieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </Box>

        {/* Legend */}
        <Stack spacing={1} sx={{ mt: 1 }}>
          {paymentBreakdown.map((item) => (
            <Box
              key={item.name}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 1.5,
                py: 0.8,
                borderRadius: '10px',
                bgcolor: '#F8F4EE',
                border: '1px solid #E8DFD5',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    bgcolor: item.color,
                  }}
                />
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#2D1F24', fontSize: '0.85rem' }}>
                  {item.name}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 800, color: '#6A3F4D', fontSize: '0.85rem' }}>
                {item.percentage}%
              </Typography>
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};
