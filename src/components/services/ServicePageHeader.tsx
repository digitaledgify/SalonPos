import React from 'react';
import { Box, Typography, Button, Chip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CategoryIcon from '@mui/icons-material/Category';
import ContentCutIcon from '@mui/icons-material/ContentCut';
import { useServices } from '../../context/ServiceContext';
import { useDashboard } from '../../context/DashboardContext';

export const ServicePageHeader: React.FC = () => {
  const { setIsServiceFormOpen, setServiceToEdit, setIsCategoryModalOpen } = useServices();
  const { role } = useDashboard();

  const handleOpenAdd = () => {
    setServiceToEdit(null);
    setIsServiceFormOpen(true);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', md: 'center' },
        gap: 2,
        mb: 3,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: '14px',
            bgcolor: '#6A3F4D',
            color: '#EBD9DF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(107, 79, 58, 0.25)',
          }}
        >
          <ContentCutIcon sx={{ fontSize: 26 }} />
        </Box>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                color: '#2D1F24',
                fontFamily: '"Playfair Display", serif',
                letterSpacing: '-0.01em',
              }}
            >
              Services Catalog & Pricing
            </Typography>
            <Chip
              label={`${role} View`}
              size="small"
              sx={{
                bgcolor: '#EBD9DF',
                color: '#6A3F4D',
                fontWeight: 700,
                fontSize: '0.7rem',
                height: 22,
              }}
            />
          </Box>
          <Typography variant="body2" sx={{ color: '#6E5C63', mt: 0.2 }}>
            Manage unisex salon treatments, pricing, member discounts, and duration defaults.
          </Typography>
        </Box>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
        <Button
          variant="outlined"
          startIcon={<CategoryIcon />}
          onClick={() => setIsCategoryModalOpen(true)}
          sx={{
            borderColor: '#A8828F',
            color: '#6A3F4D',
            borderRadius: '10px',
            textTransform: 'none',
            fontWeight: 700,
            px: 2,
            py: 1,
            '&:hover': {
              borderColor: '#6A3F4D',
              bgcolor: 'rgba(107, 79, 58, 0.05)',
            },
          }}
        >
          Categories Summary
        </Button>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAdd}
          sx={{
            bgcolor: '#6A3F4D',
            color: '#EBD9DF',
            borderRadius: '10px',
            textTransform: 'none',
            fontWeight: 800,
            px: 2.5,
            py: 1,
            boxShadow: '0 4px 12px rgba(107, 79, 58, 0.25)',
            '&:hover': {
              bgcolor: '#523B2A',
            },
          }}
        >
          Add New Service
        </Button>
      </Box>
    </Box>
  );
};
