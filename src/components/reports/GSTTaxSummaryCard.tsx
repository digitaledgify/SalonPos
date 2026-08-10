import React from 'react';
import { Paper, Box, Typography, Grid, Button, Divider } from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useDashboard } from '../../context/DashboardContext';

export const GSTTaxSummaryCard: React.FC = () => {
  const { showToast } = useDashboard();

  const totalTaxableServices = 501695;
  const totalTaxableProducts = 50169;
  const totalTaxableValue = totalTaxableServices + totalTaxableProducts;

  const cgstAmount = Math.round(totalTaxableValue * 0.09); // 9%
  const sgstAmount = Math.round(totalTaxableValue * 0.09); // 9%
  const totalGSTCollected = cgstAmount + sgstAmount; // 18%

  const handleDownloadGSTR1 = () => {
    showToast('Downloading GSTR-1 Monthly Return Filing Data (JSON/Excel format)...');
  };

  return (
    <Grid container spacing={2.5}>
      <Grid size={{ xs: 12, md: 8 }}>
        <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', bgcolor: '#FFFFFF', border: '1px solid #E8DFD5' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <ReceiptIcon sx={{ color: '#6A3F4D', fontSize: 28 }} />
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#2D1F24', fontSize: '1.1rem' }}>
                  GST Tax Return Summary (August 2026)
                </Typography>
                <Typography variant="caption" sx={{ color: '#6E5C63' }}>
                  GSTIN: 27AAAAA0000A1Z5 · Bandra West Branch
                </Typography>
              </Box>
            </Box>

            <Button
              variant="contained"
              startIcon={<FileDownloadIcon />}
              onClick={handleDownloadGSTR1}
              sx={{ bgcolor: '#6A3F4D', color: '#F8F4EE', fontWeight: 700, borderRadius: '10px' }}
            >
              Export GSTR-1 File
            </Button>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Box sx={{ p: 2, bgcolor: '#F8F4EE', borderRadius: '12px', border: '1px solid #E8DFD5' }}>
                <Typography variant="caption" sx={{ color: '#6E5C63', fontWeight: 700, textTransform: 'uppercase' }}>
                  Total Taxable Turnover
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#2D1F24', mt: 0.5 }}>
                  ₹{totalTaxableValue.toLocaleString('en-IN')}
                </Typography>
              </Box>
            </Grid>

            <Grid size={{ xs: 6, sm: 4 }}>
              <Box sx={{ p: 2, bgcolor: '#F8F4EE', borderRadius: '12px', border: '1px solid #E8DFD5' }}>
                <Typography variant="caption" sx={{ color: '#6E5C63', fontWeight: 700, textTransform: 'uppercase' }}>
                  CGST (9% Central Tax)
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#6A3F4D', mt: 0.5 }}>
                  ₹{cgstAmount.toLocaleString('en-IN')}
                </Typography>
              </Box>
            </Grid>

            <Grid size={{ xs: 6, sm: 4 }}>
              <Box sx={{ p: 2, bgcolor: '#F8F4EE', borderRadius: '12px', border: '1px solid #E8DFD5' }}>
                <Typography variant="caption" sx={{ color: '#6E5C63', fontWeight: 700, textTransform: 'uppercase' }}>
                  SGST (9% State Tax)
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#6A3F4D', mt: 0.5 }}>
                  ₹{sgstAmount.toLocaleString('en-IN')}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, p: 2, bgcolor: '#F4F9F4', borderRadius: '12px', border: '1px solid #C8E6C9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircleIcon sx={{ color: '#2E7D32' }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1B5E20' }}>
                Total Output GST Liability Collected:
              </Typography>
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#2E7D32' }}>
              ₹{totalGSTCollected.toLocaleString('en-IN')}
            </Typography>
          </Box>
        </Paper>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', bgcolor: '#FFFFFF', border: '1px solid #E8DFD5', height: '100%' }}>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#2D1F24', fontSize: '1.05rem', mb: 1 }}>
            Tax Audit Status
          </Typography>
          <Typography variant="body2" sx={{ color: '#6E5C63', mb: 2 }}>
            Compliance checklist for monthly GST filings and Input Tax Credit (ITC) reconciliation.
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Box sx={{ p: 1.5, bgcolor: '#F8F4EE', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircleIcon sx={{ color: '#2E7D32', fontSize: 18 }} />
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#2D1F24' }}>
                All B2C invoices tagged with 18% SAC Code 999721
              </Typography>
            </Box>
            <Box sx={{ p: 1.5, bgcolor: '#F8F4EE', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircleIcon sx={{ color: '#2E7D32', fontSize: 18 }} />
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#2D1F24' }}>
                B2B Client GSTIN validation passed
              </Typography>
            </Box>
            <Box sx={{ p: 1.5, bgcolor: '#F8F4EE', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircleIcon sx={{ color: '#2E7D32', fontSize: 18 }} />
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#2D1F24' }}>
                Supplier ITC claims reconciled with GSTR-2B
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};
