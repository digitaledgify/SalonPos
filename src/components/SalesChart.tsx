import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, ToggleButtonGroup, ToggleButton } from '@mui/material';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useDashboard } from '../context/DashboardContext';
import { formatCurrency } from '../utils/formatters';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          bgcolor: '#2D1F24',
          color: '#FFFFFF',
          p: 1.5,
          borderRadius: '12px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          border: '1px solid #6A3F4D',
        }}
      >
        <Typography variant="caption" sx={{ color: '#EBD9DF', fontWeight: 700 }}>
          {label}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 800, mt: 0.5 }}>
          Sales: {formatCurrency(payload[0].value)}
        </Typography>
        {payload[1] && (
          <Typography variant="caption" sx={{ color: '#A8828F', display: 'block' }}>
            Target: {formatCurrency(payload[1].value)}
          </Typography>
        )}
      </Box>
    );
  }
  return null;
};

export const SalesChart: React.FC = () => {
  const { dailySales } = useDashboard();
  const [chartView, setChartView] = useState<'sales' | 'comparison'>('sales');

  const totalSales = dailySales.reduce((sum, item) => sum + item.sales, 0);

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
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 1.5,
            mb: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
              <ShowChartIcon sx={{ fontSize: 20 }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#2D1F24', fontSize: '1.05rem' }}>
                Sales Trend (Last 7 Days)
              </Typography>
              <Typography variant="caption" sx={{ color: '#6E5C63', fontWeight: 600 }}>
                Total Revenue: {formatCurrency(totalSales)}
              </Typography>
            </Box>
          </Box>

          <ToggleButtonGroup
            value={chartView}
            exclusive
            onChange={(_, val) => val && setChartView(val)}
            size="small"
            sx={{
              bgcolor: '#F8F4EE',
              borderRadius: '10px',
              p: 0.5,
              '& .MuiToggleButton-root': {
                border: 'none',
                borderRadius: '8px',
                px: 1.5,
                py: 0.4,
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#6E5C63',
                '&.Mui-selected': {
                  bgcolor: '#6A3F4D',
                  color: '#FFFFFF',
                },
              },
            }}
          >
            <ToggleButton value="sales">Actual Sales</ToggleButton>
            <ToggleButton value="comparison">VS Target</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Box sx={{ width: '100%', height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dailySales} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6A3F4D" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6A3F4D" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#A8828F" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#A8828F" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0EAE1" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#6E5C63', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6E5C63', fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="#6A3F4D"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorSales)"
                isAnimationActive={true}
              />
              {chartView === 'comparison' && (
                <Area
                  type="monotone"
                  dataKey="target"
                  stroke="#A8828F"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  fillOpacity={1}
                  fill="url(#colorTarget)"
                  isAnimationActive={true}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};
