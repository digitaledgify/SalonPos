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
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { TOP_SERVICES_PERFORMANCE } from '../../services/reportData';

export const TopServicesReportTable: React.FC = () => {
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
          Top Performing Services & Treatments
        </Typography>
        <Typography variant="body2" sx={{ color: '#6E5C63' }}>
          Ranked by revenue generation and client booking frequency.
        </Typography>
      </Box>

      <TableContainer>
        <Table>
          <TableHead sx={{ bgcolor: '#FFFDF9' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 800, color: '#6A3F4D' }}>Rank & Service Name</TableCell>
              <TableCell sx={{ fontWeight: 800, color: '#6A3F4D' }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 800, color: '#6A3F4D' }}>Bookings</TableCell>
              <TableCell sx={{ fontWeight: 800, color: '#6A3F4D' }}>Duration</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800, color: '#6A3F4D' }}>Total Revenue Generated</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {TOP_SERVICES_PERFORMANCE.map((service, idx) => (
              <TableRow key={service.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Chip
                      label={`#${idx + 1}`}
                      size="small"
                      sx={{ bgcolor: '#6A3F4D', color: '#F8F4EE', fontWeight: 800, fontSize: '0.75rem' }}
                    />
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#2D1F24' }}>
                      {service.name}
                    </Typography>
                  </Box>
                </TableCell>

                <TableCell>
                  <Chip
                    label={service.category}
                    size="small"
                    sx={{ bgcolor: '#F8F4EE', color: '#6A3F4D', fontWeight: 700, fontSize: '0.72rem' }}
                  />
                </TableCell>

                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#2D1F24' }}>
                    {service.bookingsCount} appointments
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography variant="body2" sx={{ color: '#6E5C63', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <AccessTimeIcon sx={{ fontSize: 16 }} /> {service.avgDurationMinutes} mins
                  </Typography>
                </TableCell>

                <TableCell align="right">
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#2E7D32', fontSize: '1rem' }}>
                    ₹{service.totalRevenue.toLocaleString('en-IN')}
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
