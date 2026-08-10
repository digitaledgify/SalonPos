import React, { useState } from 'react';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  IconButton,
  Button,
  Box,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PrintIcon from '@mui/icons-material/Print';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import PhoneIcon from '@mui/icons-material/Phone';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ReplayIcon from '@mui/icons-material/Replay';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import PaymentsIcon from '@mui/icons-material/Payments';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import CallSplitIcon from '@mui/icons-material/CallSplit';
import { Transaction, PaymentMethod } from '../../types';
import { useDashboard } from '../../context/DashboardContext';

interface Props {
  transactions: Transaction[];
  onSelectInvoice: (tx: Transaction) => void;
}

export const BillingTable: React.FC<Props> = ({ transactions, onSelectInvoice }) => {
  const { showToast, setSelectedInvoice } = useDashboard();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [activeTx, setActiveTx] = useState<Transaction | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, tx: Transaction) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setActiveTx(tx);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setActiveTx(null);
  };

  const handleSendWhatsApp = (tx: Transaction) => {
    showToast(`Sending Tax Invoice PDF link via WhatsApp to ${tx.customerName} (${tx.customerPhone})...`);
    handleMenuClose();
  };

  const handlePrintThermal = (tx: Transaction) => {
    showToast(`Printing Thermal Receipt for Invoice ${tx.invoiceNo}...`);
    handleMenuClose();
  };

  const getPaymentIcon = (method: PaymentMethod) => {
    switch (method) {
      case 'UPI':
        return <QrCode2Icon sx={{ fontSize: 16 }} />;
      case 'Card':
        return <CreditCardIcon sx={{ fontSize: 16 }} />;
      case 'Cash':
        return <PaymentsIcon sx={{ fontSize: 16 }} />;
      case 'Split':
      default:
        return <CallSplitIcon sx={{ fontSize: 16 }} />;
    }
  };

  const getPaymentChip = (method: PaymentMethod) => {
    return (
      <Chip
        icon={getPaymentIcon(method)}
        label={method}
        size="small"
        sx={{
          bgcolor: '#F8F4EE',
          color: '#6A3F4D',
          border: '1px solid #E8DFD5',
          fontWeight: 700,
          fontSize: '0.72rem',
        }}
      />
    );
  };

  if (transactions.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 6,
          textAlign: 'center',
          borderRadius: '16px',
          bgcolor: '#FFFFFF',
          border: '1px solid #E8DFD5',
          mb: 3,
        }}
      >
        <ReceiptIcon sx={{ fontSize: 48, color: '#A8828F', mb: 1.5 }} />
        <Typography variant="h6" sx={{ fontWeight: 800, color: '#2D1F24' }}>
          No Bills Found
        </Typography>
        <Typography variant="body2" sx={{ color: '#6E5C63', mt: 0.5 }}>
          No invoices or transactions match your selected search or filter parameters.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: '16px',
        bgcolor: '#FFFFFF',
        border: '1px solid #E8DFD5',
        overflow: 'hidden',
        boxShadow: '0 2px 10px rgba(107, 79, 58, 0.04)',
        mb: 3,
      }}
    >
      <TableContainer>
        <Table sx={{ minWidth: 850 }}>
          <TableHead sx={{ bgcolor: '#F8F4EE' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 800, color: '#6A3F4D', fontSize: '0.8rem' }}>Invoice #</TableCell>
              <TableCell sx={{ fontWeight: 800, color: '#6A3F4D', fontSize: '0.8rem' }}>Customer Details</TableCell>
              <TableCell sx={{ fontWeight: 800, color: '#6A3F4D', fontSize: '0.8rem' }}>Services & Items</TableCell>
              <TableCell sx={{ fontWeight: 800, color: '#6A3F4D', fontSize: '0.8rem' }}>Stylist</TableCell>
              <TableCell sx={{ fontWeight: 800, color: '#6A3F4D', fontSize: '0.8rem' }}>Amount (Incl GST)</TableCell>
              <TableCell sx={{ fontWeight: 800, color: '#6A3F4D', fontSize: '0.8rem' }}>Payment Mode</TableCell>
              <TableCell sx={{ fontWeight: 800, color: '#6A3F4D', fontSize: '0.8rem' }}>Status</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800, color: '#6A3F4D', fontSize: '0.8rem' }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {transactions.map((tx) => {
              const tax = Math.round(tx.amount * 0.18);
              return (
                <TableRow
                  key={tx.id}
                  hover
                  onClick={() => onSelectInvoice(tx)}
                  sx={{
                    cursor: 'pointer',
                    '&:last-child td, &:last-child th': { border: 0 },
                  }}
                >
                  {/* Invoice # */}
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 800, color: '#6A3F4D', fontFamily: 'monospace' }}
                    >
                      {tx.invoiceNo}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#6E5C63', display: 'block' }}>
                      {tx.time} ({tx.date})
                    </Typography>
                  </TableCell>

                  {/* Customer Details */}
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 800, color: '#2D1F24' }}>
                      {tx.customerName}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.2 }}>
                      <PhoneIcon sx={{ fontSize: 12, color: '#6E5C63' }} />
                      <Typography variant="caption" sx={{ color: '#6E5C63', fontWeight: 600 }}>
                        {tx.customerPhone}
                      </Typography>
                    </Box>
                  </TableCell>

                  {/* Services & Items */}
                  <TableCell>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {tx.services.map((svc, i) => (
                        <Chip
                          key={i}
                          label={svc}
                          size="small"
                          sx={{
                            bgcolor: '#F8F4EE',
                            color: '#2D1F24',
                            fontWeight: 600,
                            fontSize: '0.7rem',
                            height: 20,
                            border: '1px solid #E8DFD5',
                          }}
                        />
                      ))}
                    </Box>
                  </TableCell>

                  {/* Stylist */}
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#2D1F24' }}>
                      {tx.stylistName}
                    </Typography>
                  </TableCell>

                  {/* Amount with GST Note */}
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 800, color: '#2D1F24' }}>
                      ₹{tx.amount.toLocaleString()}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#6E5C63', fontSize: '0.68rem', display: 'block' }}>
                      (GST ₹{tax})
                    </Typography>
                  </TableCell>

                  {/* Payment Mode */}
                  <TableCell>{getPaymentChip(tx.paymentMethod)}</TableCell>

                  {/* Status Badge */}
                  <TableCell>
                    <Chip
                      label={tx.status}
                      size="small"
                      sx={{
                        bgcolor:
                          tx.status === 'Paid'
                            ? '#E8F5E9'
                            : tx.status === 'Pending'
                            ? '#FFF8E1'
                            : '#FFEBEE',
                        color:
                          tx.status === 'Paid'
                            ? '#2E7D32'
                            : tx.status === 'Pending'
                            ? '#F57F17'
                            : '#C62828',
                        fontWeight: 800,
                        fontSize: '0.72rem',
                      }}
                    />
                  </TableCell>

                  {/* Actions */}
                  <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<ReceiptIcon sx={{ fontSize: 14 }} />}
                        onClick={() => setSelectedInvoice(tx)}
                        sx={{
                          borderColor: '#E8DFD5',
                          color: '#6A3F4D',
                          borderRadius: '8px',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          textTransform: 'none',
                          py: 0.4,
                        }}
                      >
                        View Tax Bill
                      </Button>

                      <IconButton size="small" onClick={(e) => handleMenuOpen(e, tx)}>
                        <MoreVertIcon sx={{ fontSize: 18, color: '#6A3F4D' }} />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Row Context Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => activeTx && handlePrintThermal(activeTx)}>
          <PrintIcon sx={{ fontSize: 18, color: '#6A3F4D', mr: 1 }} />
          Print Thermal Receipt
        </MenuItem>
        <MenuItem onClick={() => activeTx && handleSendWhatsApp(activeTx)}>
          <WhatsAppIcon sx={{ fontSize: 18, color: '#25D366', mr: 1 }} />
          Send WhatsApp Tax Bill
        </MenuItem>
        <MenuItem onClick={() => showToast('Refunding Invoice / Payment reversal requested...')}>
          <ReplayIcon sx={{ fontSize: 18, color: '#C62828', mr: 1 }} />
          Issue Tax Credit Note / Refund
        </MenuItem>
      </Menu>
    </Paper>
  );
};
