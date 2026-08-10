import React from 'react';
import { Paper, Box, Typography, TextField, Grid, Avatar } from '@mui/material';
import StoreIcon from '@mui/icons-material/Store';
import { useSettings } from './SettingsContext';

export const SalonProfileTab: React.FC = () => {
  const { profile, setProfile } = useSettings();

  const handleChange = (field: keyof typeof profile, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
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
        <StoreIcon sx={{ color: '#6A3F4D', fontSize: 28 }} />
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#2D1F24', fontSize: '1.1rem' }}>
            Salon Identity & Contact Info
          </Typography>
          <Typography variant="body2" sx={{ color: '#6E5C63' }}>
            This branding and contact information appears on printed customer invoices, SMS receipts, and online booking.
          </Typography>
        </Box>
      </Box>

      {/* Avatar / Logo Section */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3, p: 2, bgcolor: '#F8F4EE', borderRadius: '12px', border: '1px solid #E8DFD5' }}>
        <Avatar
          src={profile.logoUrl}
          alt={profile.name}
          sx={{ width: 80, height: 80, border: '3px solid #EBD9DF', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
        />
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#2D1F24', mb: 0.5 }}>
            Salon Brand Logo URL
          </Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="https://images.unsplash.com/..."
            value={profile.logoUrl}
            onChange={(e) => handleChange('logoUrl', e.target.value)}
            sx={{ bgcolor: '#FFFFFF', borderRadius: '8px' }}
          />
        </Box>
      </Box>

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            required
            label="Salon Brand Name"
            fullWidth
            value={profile.name}
            onChange={(e) => handleChange('name', e.target.value)}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Brand Tagline / Subtitle"
            fullWidth
            value={profile.tagline}
            onChange={(e) => handleChange('tagline', e.target.value)}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            required
            label="Primary Contact Phone"
            fullWidth
            value={profile.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            required
            label="Official Contact Email"
            type="email"
            fullWidth
            value={profile.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            label="Website Domain"
            fullWidth
            value={profile.website}
            onChange={(e) => handleChange('website', e.target.value)}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            required
            label="GSTIN / Tax Identification No."
            fullWidth
            value={profile.gstin}
            onChange={(e) => handleChange('gstin', e.target.value)}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 8 }}>
          <TextField
            required
            label="Physical Street Address"
            fullWidth
            value={profile.address}
            onChange={(e) => handleChange('address', e.target.value)}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            required
            label="City, State & Pincode"
            fullWidth
            value={profile.city}
            onChange={(e) => handleChange('city', e.target.value)}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};
