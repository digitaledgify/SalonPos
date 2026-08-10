import React from 'react';
import {
  Paper,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { STAFF_PERFORMANCE_REPORTS } from '../../services/reportData';

export const StaffPerformanceReportTable: React.FC = () => {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: '16px',
        bgcolor: '#FFFFFF',
        border: '1px solid #E8DFD5',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ p: 2.5, bgcolor: '#F8F4EE', borderBottom: '1px solid #E8DFD5' }}>
        <Typography variant="h6" sx={{ fontWeight: 800, color: '#2D1F24', fontSize: '1.1rem' }}>
          Staff Productivity & Revenue Matrix
        </Typography>
        <Typography variant="body2" sx={{ color: '#6E5C63' }}>
          Completed service volume, total billing generated, and commission earned per stylist.
        </Typography>
      </Box>

      <TableContainer>
        <Table>
          <TableHead sx={{ bgcolor: '#FFFDF9' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 800, color: '#6A3F4D' }}>Staff Member</TableCell>
              <TableCell sx={{ fontWeight: 800, color: '#6A3F4D' }}>Role Title</TableCell>
              <TableCell sx={{ fontWeight: 800, color: '#6A3F4D' }}>Completed Appts</TableCell>
              <TableCell sx={{ fontWeight: 800, color: '#6A3F4D' }}>Client Rating</TableCell>
              <TableCell sx={{ fontWeight: 800, color: '#6A3F4D' }}>Commission Earned</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800, color: '#6A3F4D' }}>Billing Revenue</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {STAFF_PERFORMANCE_REPORTS.map((staff) => (
              <TableRow key={staff.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ bgcolor: '#6A3F4D', color: '#F8F4EE', fontWeight: 800 }}>
                      {staff.name.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#2D1F24' }}>
                        {staff.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#6E5C63' }}>
                        #{staff.id}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>

                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#2D1F24' }}>
                    {staff.role}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: '#2D1F24' }}>
                    {staff.completedAppts}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Chip
                    icon={<StarIcon sx={{ fontSize: '14px !important', color: '#FFD54F !important' }} />}
                    label={staff.rating}
                    size="small"
                    sx={{ bgcolor: '#2D1F24', color: '#F8F4EE', fontWeight: 800, height: 24 }}
                  />
                </TableCell>

                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: '#6A3F4D' }}>
                    ₹{staff.commissionEarned.toLocaleString('en-IN')}
                  </Typography>
                </TableCell>

                <TableCell align="right">
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#2E7D32', fontSize: '1rem' }}>
                    ₹{staff.revenueGenerated.toLocaleString('en-IN')}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};
