import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  TablePagination,
  IconButton,
  Tooltip,
} from '@mui/material';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useDashboard } from '../context/DashboardContext';
import { formatCurrency, getTransactionStatusColor } from '../utils/formatters';
import { Transaction } from '../types';

export const RecentTransactions: React.FC = () => {
  const { transactions, searchQuery, setSelectedInvoice } = useDashboard();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const filteredTransactions = transactions.filter((tx) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      tx.invoiceNo.toLowerCase().includes(q) ||
      tx.customerName.toLowerCase().includes(q) ||
      tx.stylistName.toLowerCase().includes(q) ||
      tx.paymentMethod.toLowerCase().includes(q) ||
      tx.status.toLowerCase().includes(q)
    );
  });

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const visibleTransactions = filteredTransactions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Card
      sx={{
        borderRadius: '16px',
        border: '1px solid #E8DFD5',
        bgcolor: '#FFFFFF',
      }}
    >
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 1 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
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
              <ReceiptLongIcon sx={{ fontSize: 20 }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#2D1F24', fontSize: '1.05rem' }}>
                Recent Billing Transactions
              </Typography>
              <Typography variant="caption" sx={{ color: '#6E5C63', fontWeight: 600 }}>
                Showing {filteredTransactions.length} records
              </Typography>
            </Box>
          </Box>
        </Box>

        <TableContainer sx={{ borderRadius: '12px', border: '1px solid #E8DFD5' }}>
          <Table sx={{ minWidth: 650 }} size="medium">
            <TableHead sx={{ bgcolor: '#F8F4EE' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: '#6A3F4D' }}>Invoice #</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#6A3F4D' }}>Customer</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#6A3F4D' }}>Stylist</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#6A3F4D' }}>Services</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#6A3F4D' }}>Amount</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#6A3F4D' }}>Payment</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#6A3F4D' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#6A3F4D' }}>Time</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, color: '#6A3F4D' }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleTransactions.map((row: Transaction) => {
                const statusColors = getTransactionStatusColor(row.status);
                return (
                  <TableRow
                    key={row.id}
                    hover
                    sx={{
                      cursor: 'pointer',
                      '&:last-child td, &:last-child th': { border: 0 },
                    }}
                    onClick={() => setSelectedInvoice(row)}
                  >
                    <TableCell sx={{ fontWeight: 700, color: '#2D1F24' }}>{row.invoiceNo}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{row.customerName}</TableCell>
                    <TableCell sx={{ color: '#6E5C63' }}>{row.stylistName}</TableCell>
                    <TableCell sx={{ color: '#6E5C63', fontSize: '0.82rem' }}>
                      {row.services.join(', ')}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 800, color: '#6A3F4D' }}>
                      {formatCurrency(row.amount)}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={row.paymentMethod}
                        size="small"
                        variant="outlined"
                        sx={{ height: 22, fontSize: '0.72rem', fontWeight: 600, borderColor: '#A8828F' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={row.status}
                        size="small"
                        sx={{
                          height: 24,
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          bgcolor: statusColors.bg,
                          color: statusColors.text,
                          border: `1px solid ${statusColors.border}`,
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: '#6E5C63', fontSize: '0.82rem' }}>{row.time}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="View Receipt">
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedInvoice(row);
                          }}
                          sx={{ color: '#6A3F4D' }}
                        >
                          <VisibilityIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredTransactions.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{ borderTop: 'none' }}
        />
      </CardContent>
    </Card>
  );
};
