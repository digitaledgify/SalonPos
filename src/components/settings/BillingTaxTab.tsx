import React from 'react';
import {
  Paper,
  Box,
  Typography,
  TextField,
  Grid,
  Switch,
  FormControlLabel,
} from '@mui/material';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { useSettings } from './SettingsContext';

export const BillingTaxTab: React.FC = () => {
  const { billing, setBilling } = useSettings();

  const handleToggle = (field: 'enableAutoPrintInvoice' | 'enableWhatsAppReceipts', checked: boolean) => {
    setBilling((prev) => ({ ...prev, [field]: checked }));
  };

  const handleValueChange = (field: keyof typeof billing, val: any) => {
    setBilling((prev) => ({ ...prev, [field]: val }));
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: '16px',
        bgcolor: '#FFFFFF',
        border: '1px solid #E8DFD5',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
        <ReceiptLongIcon sx={{ color: '#6A3F4D', fontSize: 28 }} />
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#2D1F24', fontSize: '1.1rem' }}>
            GST Tax Rates, POS Printing & Invoice Setup
          </Typography>
          <Typography variant="body2" sx={{ color: '#6E5C63' }}>
            Configure default sales tax percentage, invoice numbering sequences, and thermal printing defaults.
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            required
            label="Default GST Tax Rate (%)"
            type="number"
            fullWidth
            value={billing.gstRatePercent}
            onChange={(e) => handleValueChange('gstRatePercent', Number(e.target.value))}
            helperText="Standard Indian GST rate for salon services (18% = 9% CGST + 9% SGST)"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Service Charge (%)"
            type="number"
            fullWidth
            value={billing.serviceChargePercent}
            onChange={(e) => handleValueChange('serviceChargePercent', Number(e.target.value))}
            helperText="Optional venue service charge added to invoice total"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            required
            label="Invoice Prefix Sequence"
            fullWidth
            value={billing.invoicePrefix}
            onChange={(e) => handleValueChange('invoicePrefix', e.target.value)}
            helperText="Example: BEIGE-INV-1001"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            required
            label="Base Currency Symbol"
            fullWidth
            value={billing.currencySymbol}
            onChange={(e) => handleValueChange('currencySymbol', e.target.value)}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Box sx={{ p: 2, bgcolor: '#F8F4EE', borderRadius: '12px', border: '1px solid #E8DFD5', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={billing.enableAutoPrintInvoice}
                  onChange={(e) => handleToggle('enableAutoPrintInvoice', e.target.checked)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': { color: '#6A3F4D' },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#6A3F4D' },
                  }}
                />
              }
              label={
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#2D1F24' }}>
                    Auto-trigger Thermal Printer on Payment Completion
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#6E5C63' }}>
                    Automatically sends 80mm thermal receipt to POS receipt printer as soon as checkout is paid.
                  </Typography>
                </Box>
              }
            />

            <FormControlLabel
              control={
                <Switch
                  checked={billing.enableWhatsAppReceipts}
                  onChange={(e) => handleToggle('enableWhatsAppReceipts', e.target.checked)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': { color: '#6A3F4D' },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#6A3F4D' },
                  }}
                />
              }
              label={
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#2D1F24' }}>
                    Send Digital WhatsApp Invoice Copy to Client
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#6E5C63' }}>
                    Sends eco-friendly PDF bill link directly to client's registered WhatsApp mobile number.
                  </Typography>
                </Box>
              }
            />
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};
