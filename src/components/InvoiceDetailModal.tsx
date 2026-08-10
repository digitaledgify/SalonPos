import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Divider,
  Chip,
  Paper,
} from '@mui/material';
import SpaIcon from '@mui/icons-material/Spa';
import PrintIcon from '@mui/icons-material/Print';
import DownloadIcon from '@mui/icons-material/Download';
import { useDashboard } from '../context/DashboardContext';
import { formatCurrency, getTransactionStatusColor } from '../utils/formatters';

export const InvoiceDetailModal: React.FC = () => {
  const { selectedInvoice, setSelectedInvoice, showToast, activeOutlet } = useDashboard();

  if (!selectedInvoice) return null;

  const statusColors = getTransactionStatusColor(selectedInvoice.status);
  const taxAmount = Math.round(selectedInvoice.amount * (activeOutlet.taxRatePercent / 100));
  const baseAmount = selectedInvoice.amount - taxAmount;

  const handlePrint = () => {
    showToast(`Printing Tax Invoice ${selectedInvoice.invoiceNo} for ${activeOutlet.name}...`);
  };

  return (
    <Dialog
      open={Boolean(selectedInvoice)}
      onClose={() => setSelectedInvoice(null)}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: { sx: { borderRadius: '20px', p: 1 } },
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: '10px',
              bgcolor: '#6A3F4D',
              color: '#EBD9DF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <SpaIcon />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#2D1F24', lineHeight: 1.1 }}>
              {activeOutlet.name}
            </Typography>
            <Typography variant="caption" sx={{ color: '#6E5C63' }}>
              Tax Invoice #{selectedInvoice.invoiceNo} • GSTIN: {activeOutlet.gstin}
            </Typography>
          </Box>
        </Box>

        <Chip
          label={selectedInvoice.status}
          size="small"
          sx={{
            fontWeight: 800,
            bgcolor: statusColors.bg,
            color: statusColors.text,
            border: `1px solid ${statusColors.border}`,
          }}
        />
      </DialogTitle>

      <DialogContent dividers sx={{ borderBottom: '1px solid #E8DFD5', borderTop: '1px solid #E8DFD5' }}>
        <Paper elevation={0} sx={{ p: 2.5, bgcolor: '#F8F4EE', border: '1px dashed #A8828F', borderRadius: '14px' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Box>
              <Typography variant="caption" sx={{ color: '#6E5C63', fontWeight: 600 }}>
                CUSTOMER
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 800, color: '#2D1F24' }}>
                {selectedInvoice.customerName}
              </Typography>
              <Typography variant="caption" sx={{ color: '#6E5C63', display: 'block' }}>
                {selectedInvoice.customerPhone}
              </Typography>
            </Box>

            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="caption" sx={{ color: '#6E5C63', fontWeight: 600 }}>
                DATE & TIME
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#2D1F24' }}>
                {selectedInvoice.date}, {selectedInvoice.time}
              </Typography>
              <Typography variant="caption" sx={{ color: '#6A3F4D', fontWeight: 700, display: 'block' }}>
                Stylist: {selectedInvoice.stylistName}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 2, borderColor: '#E8DFD5' }} />

          <Typography variant="caption" sx={{ color: '#6E5C63', fontWeight: 700, textTransform: 'uppercase' }}>
            Services Rendered
          </Typography>

          <Box sx={{ mt: 1, mb: 2 }}>
            {selectedInvoice.services.map((service, idx) => (
              <Box
                key={idx}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  py: 0.5,
                  borderBottom: '1px solid #F0EAE1',
                }}
              >
                <Typography variant="body2" sx={{ color: '#2D1F24', fontWeight: 600 }}>
                  {idx + 1}. {service}
                </Typography>
                <Typography variant="body2" sx={{ color: '#6A3F4D', fontWeight: 700 }}>
                  Included
                </Typography>
              </Box>
            ))}
          </Box>

          <Box sx={{ bgcolor: '#FFFFFF', p: 1.5, borderRadius: '10px', border: '1px solid #E8DFD5', mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.3 }}>
              <Typography variant="caption" color="text.secondary">
                Subtotal
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 700 }}>
                {formatCurrency(baseAmount)}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.3 }}>
              <Typography variant="caption" color="text.secondary">
                GST (18%)
              </Typography>
              <Typography variant="caption" sx={{ fontWeight: 700 }}>
                {formatCurrency(taxAmount)}
              </Typography>
            </Box>
            <Divider sx={{ my: 0.8 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ fontWeight: 800, color: '#2D1F24' }}>
                Total Paid ({selectedInvoice.paymentMethod})
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#6A3F4D' }}>
                {formatCurrency(selectedInvoice.amount)}
              </Typography>
            </Box>
          </Box>
        </Paper>
      </DialogContent>

      <DialogActions sx={{ pt: 2, px: 3 }}>
        <Button
          startIcon={<DownloadIcon />}
          onClick={handlePrint}
          variant="outlined"
          sx={{ borderColor: '#A8828F', color: '#6A3F4D' }}
        >
          Download PDF
        </Button>
        <Button
          startIcon={<PrintIcon />}
          onClick={handlePrint}
          variant="contained"
          sx={{ bgcolor: '#6A3F4D', color: '#FFFFFF' }}
        >
          Print Thermal Receipt
        </Button>
      </DialogActions>
    </Dialog>
  );
};
