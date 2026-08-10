import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Chip,
  Button,
  Divider,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EditIcon from '@mui/icons-material/Edit';
import StarIcon from '@mui/icons-material/Star';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import BadgeIcon from '@mui/icons-material/Badge';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import { useServices } from '../../context/ServiceContext';

export const ServiceDetailModal: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const {
    selectedService,
    setSelectedService,
    setServiceToEdit,
    setIsServiceFormOpen,
    setServiceForBooking,
  } = useServices();

  const handleClose = () => {
    setSelectedService(null);
  };

  if (!selectedService) return null;

  const handleEdit = () => {
    setServiceToEdit(selectedService);
    setIsServiceFormOpen(true);
    handleClose();
  };

  const handleBook = () => {
    setServiceForBooking(selectedService);
    handleClose();
  };

  const silverPrice = Math.round(selectedService.basePrice * 0.9);
  const goldPrice = Math.round(selectedService.basePrice * 0.85);
  const platinumPrice = Math.round(selectedService.basePrice * 0.8);

  return (
    <Drawer
      anchor="right"
      open={Boolean(selectedService)}
      onClose={handleClose}
      slotProps={{
        paper: {
          sx: {
            width: isMobile ? '100vw' : { sm: 540, md: 620 },
            maxWidth: '100vw',
            bgcolor: '#F8F4EE',
          },
        },
      }}
    >
      <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header Bar */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '10px',
                bgcolor: '#6A3F4D',
                color: '#EBD9DF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ContentCutIcon sx={{ fontSize: 20 }} />
            </Box>
            <Box>
              <Typography variant="caption" sx={{ fontWeight: 800, color: '#6A3F4D' }}>
                SERVICE SPECIFICATION
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#2D1F24', fontFamily: '"Playfair Display", serif', lineHeight: 1 }}>
                {selectedService.code}
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={handleClose} size="small" sx={{ color: '#6A3F4D' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 2.5, borderColor: '#E8DFD5' }} />

        {/* Scrollable Content Body */}
        <Box sx={{ flexGrow: 1, overflowY: 'auto', pr: 1 }}>
          {/* Main Hero Banner */}
          <Paper
            elevation={0}
            sx={{
              position: 'relative',
              borderRadius: '16px',
              overflow: 'hidden',
              height: 200,
              mb: 3,
            }}
          >
            <Box
              component="img"
              src={selectedService.imageUrl}
              alt={selectedService.name}
              sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.75) 100%)',
              }}
            />

            <Box sx={{ position: 'absolute', bottom: 16, left: 16, right: 16, color: '#FFFFFF' }}>
              <Box sx={{ display: 'flex', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
                <Chip label={selectedService.category} size="small" sx={{ bgcolor: '#6A3F4D', color: '#EBD9DF', fontWeight: 800, fontSize: '0.7rem' }} />
                <Chip label={`Target: ${selectedService.genderTarget}`} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.85)', color: '#2D1F24', fontWeight: 800, fontSize: '0.7rem' }} />
                {selectedService.isPopular && (
                  <Chip icon={<LocalOfferIcon sx={{ fontSize: 12, color: '#FFF !important' }} />} label="Popular Treatment" size="small" sx={{ bgcolor: '#A8828F', color: '#FFF', fontWeight: 800, fontSize: '0.7rem' }} />
                )}
              </Box>

              <Typography variant="h5" sx={{ fontWeight: 800, fontFamily: '"Playfair Display", serif' }}>
                {selectedService.name}
              </Typography>
            </Box>
          </Paper>

          {/* Key Parameters Cards */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={4}>
              <Paper elevation={0} sx={{ p: 2, borderRadius: '12px', bgcolor: '#FFFFFF', border: '1px solid #E8DFD5', textAlign: 'center' }}>
                <AccessTimeIcon sx={{ color: '#6A3F4D', mb: 0.5 }} />
                <Typography variant="caption" sx={{ color: '#6E5C63', display: 'block' }}>
                  Duration
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#2D1F24' }}>
                  {selectedService.durationMinutes} mins
                </Typography>
              </Paper>
            </Grid>

            <Grid size={4}>
              <Paper elevation={0} sx={{ p: 2, borderRadius: '12px', bgcolor: '#FFFFFF', border: '1px solid #E8DFD5', textAlign: 'center' }}>
                <CurrencyRupeeIcon sx={{ color: '#2E7D32', mb: 0.5 }} />
                <Typography variant="caption" sx={{ color: '#6E5C63', display: 'block' }}>
                  Standard Price
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#2E7D32' }}>
                  ₹{selectedService.basePrice.toLocaleString('en-IN')}
                </Typography>
              </Paper>
            </Grid>

            <Grid size={4}>
              <Paper elevation={0} sx={{ p: 2, borderRadius: '12px', bgcolor: '#FFFFFF', border: '1px solid #E8DFD5', textAlign: 'center' }}>
                <StarIcon sx={{ color: '#FFB300', mb: 0.5 }} />
                <Typography variant="caption" sx={{ color: '#6E5C63', display: 'block' }}>
                  Rating
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#2D1F24' }}>
                  {selectedService.rating.toFixed(1)} / 5.0
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Service Description */}
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: '14px', bgcolor: '#FFFFFF', border: '1px solid #E8DFD5', mb: 3 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#6A3F4D', mb: 1, textTransform: 'uppercase' }}>
              Service Overview & Protocol
            </Typography>
            <Typography variant="body2" sx={{ color: '#4A3E36', lineHeight: 1.6 }}>
              {selectedService.description}
            </Typography>
            <Box sx={{ mt: 2, pt: 2, borderTop: '1px dashed #E8DFD5', display: 'flex', alignItems: 'center', gap: 1 }}>
              <BadgeIcon sx={{ color: '#6A3F4D', fontSize: 18 }} />
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#6A3F4D' }}>
                Recommended Specialist: {selectedService.recommendedStylistRole}
              </Typography>
            </Box>
          </Paper>

          {/* Membership Tier Price Breakdown */}
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: '14px', bgcolor: '#FFFFFF', border: '1px solid #E8DFD5', mb: 3 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#6A3F4D', mb: 1.5, textTransform: 'uppercase' }}>
              Membership Tier Pricing Matrix
            </Typography>
            <Grid container spacing={1.5}>
              <Grid size={4}>
                <Box sx={{ p: 1.5, borderRadius: '10px', bgcolor: '#F5F5F5', textAlign: 'center', border: '1px solid #E0E0E0' }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#616161' }}>Silver (10% OFF)</Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#212121' }}>₹{silverPrice.toLocaleString('en-IN')}</Typography>
                </Box>
              </Grid>
              <Grid size={4}>
                <Box sx={{ p: 1.5, borderRadius: '10px', bgcolor: '#FFF8E1', textAlign: 'center', border: '1px solid #FFE082' }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#F57F17' }}>Gold (15% OFF)</Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#E65100' }}>₹{goldPrice.toLocaleString('en-IN')}</Typography>
                </Box>
              </Grid>
              <Grid size={4}>
                <Box sx={{ p: 1.5, borderRadius: '10px', bgcolor: '#ECEFF1', textAlign: 'center', border: '1px solid #CFD8DC' }}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: '#37474F' }}>Platinum (20% OFF)</Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#263238' }}>₹{platinumPrice.toLocaleString('en-IN')}</Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Required Inventory Consumables */}
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: '14px', bgcolor: '#FFFFFF', border: '1px solid #E8DFD5', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
              <Inventory2Icon sx={{ color: '#6A3F4D', fontSize: 20 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#6A3F4D', textTransform: 'uppercase' }}>
                Inventory Consumables Per Treatment
              </Typography>
            </Box>

            {selectedService.requiredConsumables.length === 0 ? (
              <Typography variant="caption" sx={{ color: '#6E5C63' }}>
                No direct raw materials or inventory consumables logged.
              </Typography>
            ) : (
              <List disablePadding>
                {selectedService.requiredConsumables.map((item, idx) => (
                  <ListItem key={idx} disablePadding sx={{ py: 0.8, borderBottom: '1px solid #F8F5F0' }}>
                    <ListItemIcon sx={{ minWidth: 28, color: '#A8828F' }}>•</ListItemIcon>
                    <ListItemText
                      primary={item.itemName}
                      secondary={`Quantity: ${item.qtyPerSession}`}
                      slotProps={{
                        primary: { sx: { fontSize: '0.85rem', fontWeight: 700, color: '#2D1F24' } },
                        secondary: { sx: { fontSize: '0.75rem', color: '#6E5C63' } },
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>

          {/* Lifetime Analytics */}
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: '14px', bgcolor: '#6A3F4D', color: '#FFFFFF', mb: 2 }}>
            <Typography variant="caption" sx={{ color: '#EBD9DF', fontWeight: 800, textTransform: 'uppercase' }}>
              Lifetime Performance Analytics
            </Typography>
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              <Grid size={6}>
                <Typography variant="caption" sx={{ color: '#EBD9DF' }}>Total Appointments</Typography>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#FFFFFF' }}>{selectedService.totalBookings} Sessions</Typography>
              </Grid>
              <Grid size={6}>
                <Typography variant="caption" sx={{ color: '#EBD9DF' }}>Generated Revenue</Typography>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#FFFFFF' }}>₹{selectedService.totalRevenue.toLocaleString('en-IN')}</Typography>
              </Grid>
            </Grid>
          </Paper>
        </Box>

        {/* Footer Actions */}
        <Box sx={{ pt: 2, borderTop: '1px solid #E8DFD5', display: 'flex', gap: 1.5 }}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={handleEdit}
            sx={{
              borderColor: '#A8828F',
              color: '#6A3F4D',
              borderRadius: '10px',
              fontWeight: 800,
              py: 1.2,
              '&:hover': { borderColor: '#6A3F4D', bgcolor: 'rgba(107, 79, 58, 0.05)' },
            }}
          >
            Edit
          </Button>
          <Button
            fullWidth
            variant="contained"
            startIcon={<CalendarMonthIcon />}
            onClick={handleBook}
            sx={{
              bgcolor: '#6A3F4D',
              color: '#EBD9DF',
              borderRadius: '10px',
              fontWeight: 800,
              py: 1.2,
              boxShadow: '0 4px 12px rgba(107, 79, 58, 0.25)',
              '&:hover': { bgcolor: '#523B2A' },
            }}
          >
            Quick Book
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
};
