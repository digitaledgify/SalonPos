import React from 'react';
import { Box, Paper, Typography, Grid } from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import PieChartIcon from '@mui/icons-material/PieChart';
import FaceIcon from '@mui/icons-material/Face';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { Customer } from '../../types/customer';

interface Props {
  customer?: Customer; // If provided, shows customer-specific analytics; else shows aggregate customer analytics
}

export const Analytics: React.FC<Props> = ({ customer }) => {
  // Monthly visits data
  const monthlyVisitsData = [
    { month: 'Jan', visits: customer ? Math.max(1, Math.round(customer.visitsCount * 0.12)) : 42 },
    { month: 'Feb', visits: customer ? Math.max(1, Math.round(customer.visitsCount * 0.15)) : 58 },
    { month: 'Mar', visits: customer ? Math.max(1, Math.round(customer.visitsCount * 0.10)) : 65 },
    { month: 'Apr', visits: customer ? Math.max(1, Math.round(customer.visitsCount * 0.18)) : 80 },
    { month: 'May', visits: customer ? Math.max(1, Math.round(customer.visitsCount * 0.14)) : 74 },
    { month: 'Jun', visits: customer ? Math.max(1, Math.round(customer.visitsCount * 0.16)) : 92 },
    { month: 'Jul', visits: customer ? Math.max(1, Math.round(customer.visitsCount * 0.15)) : 110 },
  ];

  // Spend timeline
  const baseSpend = customer ? customer.lifetimeSpend / 7 : 45000;
  const moneySpentData = [
    { month: 'Jan', spend: Math.round(baseSpend * 0.7) },
    { month: 'Feb', spend: Math.round(baseSpend * 0.9) },
    { month: 'Mar', spend: Math.round(baseSpend * 1.1) },
    { month: 'Apr', spend: Math.round(baseSpend * 0.8) },
    { month: 'May', spend: Math.round(baseSpend * 1.3) },
    { month: 'Jun', spend: Math.round(baseSpend * 1.0) },
    { month: 'Jul', spend: Math.round(baseSpend * 1.4) },
  ];

  // Favourite Services
  const favServicesData = customer
    ? [
        { name: customer.preferredServices[0] || 'Hair Spa', value: 45, color: '#6A3F4D' },
        { name: customer.preferredServices[1] || 'Facial Glow', value: 30, color: '#A8828F' },
        { name: 'Keratin Smoothing', value: 15, color: '#EBD9DF' },
        { name: 'Pedicure', value: 10, color: '#6E5C63' },
      ]
    : [
        { name: 'Hair Cut & Styling', value: 38, color: '#6A3F4D' },
        { name: 'Hydra Facial', value: 26, color: '#A8828F' },
        { name: 'Balayage Color', value: 20, color: '#EBD9DF' },
        { name: 'Pedicure & Mani', value: 16, color: '#6E5C63' },
      ];

  // Favourite Stylists
  const favStylistsData = [
    { name: customer?.preferredStylist || 'Aarav Kapoor', bookings: 28 },
    { name: 'Pooja Sharma', bookings: 22 },
    { name: 'Rohan Verma', bookings: 18 },
    { name: 'Ananya Roy', bookings: 14 },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
        <BarChartIcon sx={{ color: '#6A3F4D' }} />
        <Typography variant="h6" sx={{ fontWeight: 800, color: '#2D1F24', fontFamily: '"Playfair Display", serif' }}>
          {customer ? `${customer.firstName}'s Activity Analytics` : 'Customer Base Insights & Analytics'}
        </Typography>
      </Box>

      <Grid container spacing={2.5}>
        {/* Visits per Month */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: '14px', bgcolor: '#FFFFFF', border: '1px solid #E8DFD5' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <BarChartIcon sx={{ fontSize: 18, color: '#6A3F4D' }} />
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#2D1F24' }}>
                Visits per Month
              </Typography>
            </Box>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={monthlyVisitsData}>
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6E5C63' }} />
                <YAxis tick={{ fontSize: 11, fill: '#6E5C63' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#F8F4EE', borderRadius: '8px', border: '1px solid #E8DFD5', fontSize: '0.8rem' }}
                />
                <Bar dataKey="visits" fill="#6A3F4D" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Money Spent */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: '14px', bgcolor: '#FFFFFF', border: '1px solid #E8DFD5' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <ShowChartIcon sx={{ fontSize: 18, color: '#2E7D32' }} />
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#2D1F24' }}>
                Money Spent (₹)
              </Typography>
            </Box>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={moneySpentData}>
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6E5C63' }} />
                <YAxis tick={{ fontSize: 11, fill: '#6E5C63' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#F8F4EE', borderRadius: '8px', border: '1px solid #E8DFD5', fontSize: '0.8rem' }}
                  formatter={(val: any) => [`₹${val.toLocaleString()}`, 'Spent']}
                />
                <Area type="monotone" dataKey="spend" stroke="#2E7D32" fill="#E8F5E9" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Favourite Services */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: '14px', bgcolor: '#FFFFFF', border: '1px solid #E8DFD5' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <PieChartIcon sx={{ fontSize: 18, color: '#A8828F' }} />
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#2D1F24' }}>
                Favourite Services
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', height: 160 }}>
              <ResponsiveContainer width="50%" height={150}>
                <PieChart>
                  <Pie data={favServicesData} innerRadius={35} outerRadius={55} dataKey="value" paddingAngle={3}>
                    {favServicesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <Box sx={{ width: '50%', pl: 1 }}>
                {favServicesData.map((item, idx) => (
                  <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.8 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: item.color }} />
                    <Typography variant="caption" sx={{ fontWeight: 600, color: '#2D1F24', fontSize: '0.72rem' }}>
                      {item.name} ({item.value}%)
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Favourite Stylists */}
        <Grid size={{ xs: 12, sm: 6 }}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: '14px', bgcolor: '#FFFFFF', border: '1px solid #E8DFD5' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <FaceIcon sx={{ fontSize: 18, color: '#1565C0' }} />
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#2D1F24' }}>
                Favourite Stylists
              </Typography>
            </Box>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={favStylistsData} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 11, fill: '#6E5C63' }} />
                <YAxis dataKey="name" type="category" width={90} tick={{ fontSize: 11, fill: '#2D1F24' }} />
                <Tooltip />
                <Bar dataKey="bookings" fill="#1565C0" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
