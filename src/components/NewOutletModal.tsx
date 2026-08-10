import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  Typography,
  Grid,
} from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import { useDashboard } from '../context/DashboardContext';

export const NewOutletModal: React.FC = () => {
  const { isNewOutletModalOpen, setIsNewOutletModalOpen, addOutlet } = useDashboard();

  const [name, setName] = useState('');
  const [type, setType] = useState<'Hair & Beauty' | 'Barber Shop' | 'Luxury Spa' | 'Nail Bar' | 'MedSpa' | 'Unisex Studio'>('Hair & Beauty');
  const [tagline, setTagline] = useState('Premium Salon, Beauty & Styling Studio');
  const [code, setCode] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [gstin, setGstin] = useState('27AAAAA0000A1Z5');
  const [currencySymbol, setCurrencySymbol] = useState('₹');
  const [taxRatePercent, setTaxRatePercent] = useState(18);
  const [invoicePrefix, setInvoicePrefix] = useState('POS-INV-');
  const [primaryColor, setPrimaryColor] = useState('#6A3F4D');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code) return;

    addOutlet({
      name,
      type,
      tagline,
      code: code.toUpperCase(),
      address: address || '123 Main Salon Street',
      city: city || 'Central District',
      phone: phone || '+91 98000 11111',
      email: email || `contact@${code.toLowerCase()}salon.com`,
      gstin,
      currencySymbol,
      taxRatePercent: Number(taxRatePercent),
      invoicePrefix: invoicePrefix.toUpperCase(),
      logoUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=250',
      primaryColor,
    });

    setIsNewOutletModalOpen(false);
    // Reset form
    setName('');
    setCode('');
    setAddress('');
    setPhone('');
  };

  return (
    <Dialog
      open={isNewOutletModalOpen}
      onClose={() => setIsNewOutletModalOpen(false)}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: { sx: { borderRadius: '20px', p: 1 } },
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 1 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '10px',
            bgcolor: '#6A3F4D',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <AddBusinessIcon />
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#2D1F24', lineHeight: 1.1 }}>
            Register New Salon Client / Outlet
          </Typography>
          <Typography variant="caption" sx={{ color: '#6E5C63' }}>
            Multi-Tenant Salon POS Setup — Add a new salon location or SaaS account
          </Typography>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers sx={{ borderBottom: '1px solid #E8DFD5', borderTop: '1px solid #E8DFD5' }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 8 }}>
              <TextField
                label="Salon Business / Client Name"
                fullWidth
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!code && e.target.value) {
                    setCode(e.target.value.substring(0, 4).toUpperCase() + '-01');
                    setInvoicePrefix(e.target.value.substring(0, 3).toUpperCase() + '-INV-');
                  }
                }}
                placeholder="e.g. Velvet Beauty Lounge"
                size="small"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="Branch Code / Tenant ID"
                fullWidth
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. VEL-01"
                size="small"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Salon Category / Type"
                select
                fullWidth
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                size="small"
              >
                <MenuItem value="Hair & Beauty">Hair & Beauty Salon</MenuItem>
                <MenuItem value="Barber Shop">Men's Barber Shop</MenuItem>
                <MenuItem value="Luxury Spa">Luxury Aesthetics & Spa</MenuItem>
                <MenuItem value="Nail Bar">Nail Art & Lash Bar</MenuItem>
                <MenuItem value="MedSpa">Clinical MedSpa</MenuItem>
                <MenuItem value="Unisex Studio">Unisex Salon Studio</MenuItem>
              </TextField>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Tagline / Description"
                fullWidth
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. Unisex Hair & Aesthetics"
                size="small"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Phone Number"
                fullWidth
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 00000"
                size="small"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Contact Email"
                type="email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contact@salon.com"
                size="small"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 8 }}>
              <TextField
                label="Street Address"
                fullWidth
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="12 Link Road, Bandra"
                size="small"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="City & State"
                fullWidth
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Mumbai"
                size="small"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="Currency Symbol"
                fullWidth
                value={currencySymbol}
                onChange={(e) => setCurrencySymbol(e.target.value)}
                size="small"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="Default Tax Rate (%)"
                type="number"
                fullWidth
                value={taxRatePercent}
                onChange={(e) => setTaxRatePercent(Number(e.target.value))}
                size="small"
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                label="Invoice Prefix"
                fullWidth
                value={invoicePrefix}
                onChange={(e) => setInvoicePrefix(e.target.value)}
                size="small"
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ pt: 2, px: 3 }}>
          <Button onClick={() => setIsNewOutletModalOpen(false)} sx={{ color: '#6E5C63' }}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" sx={{ bgcolor: '#6A3F4D', color: '#FFFFFF', fontWeight: 700 }}>
            Register Salon Tenant & Launch POS
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
