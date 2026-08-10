import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  IconButton,
  Button,
  Grid,
  Paper,
  Chip,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CategoryIcon from '@mui/icons-material/Category';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useServices } from '../../context/ServiceContext';
import { ServiceCategory } from '../../types/service';

const CATEGORY_ICONS: { [key in ServiceCategory]: string } = {
  'Hair Care & Cut': '✂️',
  'Skin & Facials': '✨',
  'Beard & Grooming': '🧔',
  'Nails & Beauty': '💅',
  'Spa & Relaxation': '💆',
  'Makeup & Bridal': '💄',
  'Combo Packages': '🎁',
};

export const ServiceCategoryModal: React.FC = () => {
  const {
    isCategoryModalOpen,
    setIsCategoryModalOpen,
    services,
    setFilters,
  } = useServices();

  const handleClose = () => {
    setIsCategoryModalOpen(false);
  };

  const categories: ServiceCategory[] = [
    'Hair Care & Cut',
    'Skin & Facials',
    'Beard & Grooming',
    'Nails & Beauty',
    'Spa & Relaxation',
    'Makeup & Bridal',
    'Combo Packages',
  ];

  const categoryStats = categories.map((cat) => {
    const catServices = services.filter((s) => s.category === cat);
    const count = catServices.length;
    const activeCount = catServices.filter((s) => s.status === 'Active').length;
    const totalRevenue = catServices.reduce((acc, s) => acc + s.totalRevenue, 0);
    const avgPrice = count > 0 ? Math.round(catServices.reduce((acc, s) => acc + s.basePrice, 0) / count) : 0;

    return {
      category: cat,
      icon: CATEGORY_ICONS[cat] || '🏷️',
      count,
      activeCount,
      totalRevenue,
      avgPrice,
    };
  });

  const handleSelectCategory = (cat: ServiceCategory) => {
    setFilters((prev) => ({ ...prev, category: cat }));
    handleClose();
  };

  return (
    <Dialog
      open={isCategoryModalOpen}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: '20px',
            bgcolor: '#F8F4EE',
            p: 1,
          },
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '12px',
              bgcolor: '#6A3F4D',
              color: '#EBD9DF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CategoryIcon />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#2D1F24', fontFamily: '"Playfair Display", serif' }}>
              Service Categories & Packages Breakdown
            </Typography>
            <Typography variant="caption" sx={{ color: '#6E5C63' }}>
              Catalog performance, revenue distribution, and category shortcuts.
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={handleClose} size="small" sx={{ color: '#6A3F4D' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Divider sx={{ mb: 3, borderColor: '#E8DFD5' }} />

        <Grid container spacing={2}>
          {categoryStats.map((stat) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={stat.category}>
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: '16px',
                  bgcolor: '#FFFFFF',
                  border: '1px solid #E8DFD5',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%',
                  transition: 'transform 0.2s ease, boxShadow 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 18px rgba(107, 79, 58, 0.08)',
                    borderColor: '#A8828F',
                  },
                }}
              >
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h5" sx={{ lineHeight: 1 }}>
                      {stat.icon}
                    </Typography>
                    <Chip
                      label={`${stat.activeCount} Active`}
                      size="small"
                      sx={{ bgcolor: '#EBD9DF', color: '#6A3F4D', fontWeight: 800, fontSize: '0.7rem' }}
                    />
                  </Box>

                  <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#2D1F24', mb: 0.5 }}>
                    {stat.category}
                  </Typography>

                  <Typography variant="caption" sx={{ color: '#6E5C63', display: 'block', mb: 2 }}>
                    Avg Price: ₹{stat.avgPrice.toLocaleString('en-IN')}
                  </Typography>

                  <Box sx={{ bgcolor: '#F8F4EE', p: 1.5, borderRadius: '10px', border: '1px solid #E8DFD5', mb: 2 }}>
                    <Typography variant="caption" sx={{ color: '#6E5C63', display: 'block' }}>
                      Revenue Generated
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#2E7D32' }}>
                      ₹{stat.totalRevenue.toLocaleString('en-IN')}
                    </Typography>
                  </Box>
                </Box>

                <Button
                  fullWidth
                  variant="outlined"
                  size="small"
                  endIcon={<ArrowForwardIcon sx={{ fontSize: 14 }} />}
                  onClick={() => handleSelectCategory(stat.category)}
                  sx={{
                    borderColor: '#A8828F',
                    color: '#6A3F4D',
                    borderRadius: '8px',
                    fontWeight: 700,
                    textTransform: 'none',
                    py: 0.8,
                    '&:hover': { borderColor: '#6A3F4D', bgcolor: 'rgba(107, 79, 58, 0.05)' },
                  }}
                >
                  View Category
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 2.5, pt: 1, borderTop: '1px solid #E8DFD5' }}>
        <Button
          onClick={handleClose}
          variant="contained"
          sx={{
            bgcolor: '#6A3F4D',
            color: '#EBD9DF',
            borderRadius: '10px',
            fontWeight: 800,
            px: 3,
            '&:hover': { bgcolor: '#523B2A' },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
