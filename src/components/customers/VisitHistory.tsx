import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PersonIcon from '@mui/icons-material/Person';
import { CustomerVisit } from '../../types/customer';

interface Props {
  visits: CustomerVisit[];
}

export const VisitHistory: React.FC<Props> = ({ visits }) => {
  if (!visits || visits.length === 0) {
    return (
      <Paper elevation={0} sx={{ p: 4, textAlign: 'center', bgcolor: '#F8F4EE', borderRadius: '14px', border: '1px solid #E8DFD5' }}>
        <ReceiptLongIcon sx={{ fontSize: 48, color: '#A8828F', mb: 1 }} />
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#2D1F24' }}>
          No Visit History Found
        </Typography>
        <Typography variant="body2" sx={{ color: '#6E5C63', mt: 0.5 }}>
          Visits and invoices generated during billing will automatically populate here.
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ReceiptLongIcon sx={{ color: '#6A3F4D' }} />
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#2D1F24', fontFamily: '"Inter", sans-serif' }}>
            Visit & Invoice History ({visits.length})
          </Typography>
        </Box>
        <Typography variant="caption" sx={{ color: '#6E5C63', fontWeight: 600 }}>
          Auto-synchronized with Billing
        </Typography>
      </Box>

      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: '12px', border: '1px solid #E8DFD5', overflow: 'hidden' }}>
        <Table size="small">
          <TableHead sx={{ bgcolor: '#F8F4EE' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, color: '#6A3F4D' }}>Invoice #</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#6A3F4D' }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#6A3F4D' }}>Stylist</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#6A3F4D' }}>Services</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, color: '#6A3F4D' }}>Amount</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, color: '#6A3F4D' }}>Discount</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, color: '#6A3F4D' }}>GST (18%)</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, color: '#6A3F4D' }}>Total Paid</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#6A3F4D' }}>Payment</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#6A3F4D' }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visits.map((v) => (
              <TableRow key={v.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell sx={{ fontWeight: 700, color: '#6A3F4D' }}>{v.invoiceNo}</TableCell>
                <TableCell sx={{ fontSize: '0.82rem', color: '#2D1F24' }}>{v.date}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <PersonIcon sx={{ fontSize: 16, color: '#6E5C63' }} />
                    <Typography variant="body2" sx={{ fontSize: '0.82rem', fontWeight: 600, color: '#2D1F24' }}>
                      {v.stylistName}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {v.services.map((srv, idx) => (
                      <Chip
                        key={idx}
                        label={srv}
                        size="small"
                        sx={{ fontSize: '0.68rem', fontWeight: 600, bgcolor: '#F8F4EE', color: '#6A3F4D', border: '1px solid #E8DFD5' }}
                      />
                    ))}
                  </Box>
                </TableCell>
                <TableCell align="right" sx={{ fontSize: '0.82rem', color: '#6E5C63' }}>₹{v.amount.toLocaleString()}</TableCell>
                <TableCell align="right" sx={{ fontSize: '0.82rem', color: '#D32F2F', fontWeight: 600 }}>
                  {v.discount > 0 ? `-₹${v.discount.toLocaleString()}` : '—'}
                </TableCell>
                <TableCell align="right" sx={{ fontSize: '0.82rem', color: '#6E5C63' }}>+₹{v.gst.toLocaleString()}</TableCell>
                <TableCell align="right" sx={{ fontWeight: 800, color: '#2D1F24' }}>
                  ₹{v.totalPaid.toLocaleString()}
                </TableCell>
                <TableCell>
                  <Chip
                    label={v.paymentMethod}
                    size="small"
                    sx={{ height: 20, fontSize: '0.68rem', fontWeight: 700, bgcolor: '#E8DFD5', color: '#6A3F4D' }}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={v.status}
                    size="small"
                    color={v.status === 'Completed' ? 'success' : v.status === 'Refunded' ? 'error' : 'warning'}
                    sx={{ height: 20, fontSize: '0.68rem', fontWeight: 700 }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
