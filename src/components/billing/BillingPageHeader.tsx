import React from 'react';
import {
  Box,
  Typography,
  Button,
  Chip,
  Paper,
  Tooltip,
} from '@mui/material';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import DownloadIcon from '@mui/icons-material/Download';
import { useDashboard } from '../../context/DashboardContext';

interface Props {
  onOpenPOS: () => void;
  onOpenCashDrawer: () => void;
}

export const BillingPageHeader: React.FC<Props> = ({
  onOpenPOS,
  onOpenCashDrawer,
}) => {
  const { showToast } = useDashboard();

  const handleExportLedger = () => {
    showToast('Exporting Sales Ledger and GST Tax Report (PDF/Excel)...');
  };

  return (
    <Box sx={{ mb: 3 }}>
      {/* Top Title & Main Action Buttons */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
          gap: 2,
          mb: 2.5,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 46,
              height: 46,
              borderRadius: '12px',
              bgcolor: '#6A3F4D',
              color: '#EBD9DF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(107, 79, 58, 0.25)',
            }}
          >
            <PointOfSaleIcon sx={{ fontSize: 26 }} />
          </Box>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  color: '#2D1F24',
                  fontFamily: '"Playfair Display", serif',
                  fontSize: { xs: '1.5rem', sm: '1.85rem' },
                  letterSpacing: '-0.01em',
                }}
              >
                Billing & Point of Sale (POS)
              </Typography>
              <Chip
                label="GST Compliant"
                size="small"
                sx={{
                  bgcolor: '#6A3F4D',
                  color: '#EBD9DF',
                  fontWeight: 800,
                  fontSize: '0.68rem',
                  height: 22,
                }}
              />
            </Box>
            <Typography variant="body2" sx={{ color: '#6E5C63', fontWeight: 500, mt: 0.2 }}>
              Generate instant invoices, manage payment gateways, daily cash drawers, and tax receipts.
            </Typography>
          </Box>
        </Box>

        {/* Primary Header Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            startIcon={<AccountBalanceWalletIcon sx={{ color: '#A8828F' }} />}
            onClick={onOpenCashDrawer}
            sx={{
              borderColor: '#A8828F',
              color: '#6A3F4D',
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: 800,
              fontSize: '0.85rem',
              py: 1,
              px: 2,
              bgcolor: '#FFFFFF',
              '&:hover': {
                borderColor: '#6A3F4D',
                bgcolor: '#F8F4EE',
              },
            }}
          >
            Daily Cash Register
          </Button>

          <Button
            variant="contained"
            startIcon={<AddCircleIcon />}
            onClick={onOpenPOS}
            sx={{
              bgcolor: '#6A3F4D',
              color: '#EBD9DF',
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: 800,
              fontSize: '0.88rem',
              py: 1,
              px: 2.5,
              boxShadow: '0 4px 12px rgba(107, 79, 58, 0.25)',
              '&:hover': {
                bgcolor: '#523B2A',
              },
            }}
          >
            Create New Bill (POS)
          </Button>

          <Tooltip title="Export Sales & Tax Ledger">
            <Button
              variant="outlined"
              size="small"
              onClick={handleExportLedger}
              startIcon={<DownloadIcon sx={{ fontSize: 18 }} />}
              sx={{
                borderColor: '#E8DFD5',
                color: '#6A3F4D',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.82rem',
                textTransform: 'none',
                py: 1,
                px: 1.5,
                bgcolor: '#FFFFFF',
              }}
            >
              Ledger
            </Button>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
};
