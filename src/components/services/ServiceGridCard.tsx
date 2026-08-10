import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  Button,
  IconButton,
  Switch,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import StarIcon from '@mui/icons-material/Star';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { SalonService } from '../../types/service';
import { useServices } from '../../context/ServiceContext';

interface Props {
  service: SalonService;
}

export const ServiceGridCard: React.FC<Props> = ({ service }) => {
  const {
    setSelectedService,
    setServiceToEdit,
    setIsServiceFormOpen,
    deleteService,
    toggleServiceStatus,
    setServiceForBooking,
  } = useServices();

  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpenMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setMenuAnchorEl(e.currentTarget);
  };

  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
  };

  const memberPrice = Math.round(
    service.basePrice * (1 - service.memberDiscountPercent / 100)
  );

  const handleQuickBook = (e: React.MouseEvent) => {
    e.stopPropagation();
    setServiceForBooking(service);
  };

  const handleViewDetails = () => {
    setSelectedService(service);
  };

  const handleEdit = () => {
    handleCloseMenu();
    setServiceToEdit(service);
    setIsServiceFormOpen(true);
  };

  const handleDelete = () => {
    handleCloseMenu();
    if (window.confirm(`Are you sure you want to delete "${service.name}"?`)) {
      deleteService(service.id);
    }
  };

  const genderBadge = () => {
    if (service.genderTarget === 'Female') return { label: 'Women', emoji: '👩', color: '#E91E63' };
    if (service.genderTarget === 'Male') return { label: 'Men', emoji: '👨', color: '#1976D2' };
    return { label: 'Unisex', emoji: '✨', color: '#6A3F4D' };
  };

  const gBadge = genderBadge();

  return (
    <Paper
      elevation={0}
      onClick={handleViewDetails}
      sx={{
        borderRadius: '16px',
        bgcolor: '#FFFFFF',
        border: '1px solid #E8DFD5',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        cursor: 'pointer',
        transition: 'transform 0.2s ease, boxShadow 0.2s ease, borderColor 0.2s ease',
        boxShadow: '0 2px 10px rgba(107, 79, 58, 0.04)',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: '0 8px 24px rgba(107, 79, 58, 0.12)',
          borderColor: '#A8828F',
        },
      }}
    >
      {/* Service Header Image & Badges */}
      <Box sx={{ position: 'relative', height: 160, bgcolor: '#F8F4EE' }}>
        <Box
          component="img"
          src={service.imageUrl}
          alt={service.name}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: service.status === 'Inactive' ? 'grayscale(80%)' : 'none',
          }}
        />
        {/* Dark overlay gradient */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 100%)',
          }}
        />

        {/* Top Badges */}
        <Box sx={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 0.8, flexWrap: 'wrap' }}>
          <Chip
            label={service.code}
            size="small"
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(4px)',
              color: '#2D1F24',
              fontWeight: 800,
              fontSize: '0.72rem',
              height: 22,
            }}
          />
          {service.isPopular && (
            <Chip
              icon={<LocalOfferIcon sx={{ fontSize: 12, color: '#FFFFFF !important' }} />}
              label="Popular"
              size="small"
              sx={{
                bgcolor: '#A8828F',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '0.7rem',
                height: 22,
              }}
            />
          )}
        </Box>

        {/* Top Right Action Menu */}
        <Box
          sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(255,255,255,0.85)', borderRadius: '50%' }}
          onClick={(e) => e.stopPropagation()}
        >
          <IconButton size="small" onClick={handleOpenMenu} sx={{ color: '#2D1F24' }}>
            <MoreVertIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>

        {/* Bottom Image Info: Category & Duration */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 10,
            left: 12,
            right: 12,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Chip
            label={`${gBadge.emoji} ${service.category}`}
            size="small"
            sx={{
              bgcolor: 'rgba(107, 79, 58, 0.85)',
              color: '#EBD9DF',
              fontWeight: 700,
              fontSize: '0.7rem',
              height: 22,
            }}
          />
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              bgcolor: 'rgba(0,0,0,0.6)',
              px: 1,
              py: 0.3,
              borderRadius: '6px',
              color: '#FFFFFF',
            }}
          >
            <AccessTimeIcon sx={{ fontSize: 13 }} />
            <Typography variant="caption" sx={{ fontWeight: 700, fontSize: '0.7rem' }}>
              {service.durationMinutes} mins
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Card Content Body */}
      <Box sx={{ p: 2.5, flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Box>
          {/* Service Title */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              color: '#2D1F24',
              fontSize: '1.05rem',
              fontFamily: '"Playfair Display", serif',
              lineHeight: 1.3,
              mb: 0.8,
            }}
          >
            {service.name}
          </Typography>

          {/* Description Excerpt */}
          <Typography
            variant="body2"
            sx={{
              color: '#6E5C63',
              fontSize: '0.82rem',
              lineHeight: 1.4,
              mb: 1.5,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {service.description}
          </Typography>

          {/* Stylist Role Tag & Ratings */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="caption" sx={{ color: '#6E5C63', fontWeight: 600 }}>
              💈 {service.recommendedStylistRole}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
              <StarIcon sx={{ fontSize: 15, color: '#FFB300' }} />
              <Typography variant="caption" sx={{ fontWeight: 800, color: '#2D1F24' }}>
                {service.rating.toFixed(1)}
              </Typography>
              <Typography variant="caption" sx={{ color: '#6E5C63', fontSize: '0.7rem' }}>
                ({service.totalBookings})
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Pricing & Discounts Box */}
        <Box
          sx={{
            p: 1.5,
            borderRadius: '12px',
            bgcolor: '#F8F4EE',
            border: '1px solid #E8DFD5',
            mb: 2,
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <Box>
              <Typography variant="caption" sx={{ color: '#6E5C63', display: 'block', fontSize: '0.7rem' }}>
                Standard Price
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#2D1F24', fontSize: '1.1rem', fontFamily: '"Poppins", sans-serif' }}>
                ₹{service.basePrice.toLocaleString('en-IN')}
              </Typography>
            </Box>

            <Box sx={{ textAlign: 'right' }}>
              <Chip
                label={`Member ${service.memberDiscountPercent}% OFF`}
                size="small"
                sx={{
                  bgcolor: '#EBD9DF',
                  color: '#6A3F4D',
                  fontWeight: 800,
                  fontSize: '0.68rem',
                  height: 18,
                  mb: 0.3,
                  fontFamily: '"Poppins", sans-serif',
                }}
              />
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#2E7D32', fontSize: '1rem', fontFamily: '"Poppins", sans-serif' }}>
                ₹{memberPrice.toLocaleString('en-IN')}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Card Footer Actions */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1,
            pt: 1,
            borderTop: '1px solid #F0E8DC',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Tooltip title={service.status === 'Active' ? 'Deactivate Service' : 'Activate Service'}>
              <Switch
                size="small"
                checked={service.status === 'Active'}
                onChange={() => toggleServiceStatus(service.id)}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: '#6A3F4D',
                    '& + .MuiSwitch-track': { bgcolor: '#6A3F4D' },
                  },
                }}
              />
            </Tooltip>
            <Typography variant="caption" sx={{ fontWeight: 700, color: service.status === 'Active' ? '#2E7D32' : '#D32F2F', fontSize: '0.72rem' }}>
              {service.status}
            </Typography>
          </Box>

          <Button
            variant="contained"
            size="small"
            startIcon={<CalendarMonthIcon sx={{ fontSize: 15 }} />}
            onClick={handleQuickBook}
            sx={{
              bgcolor: '#6A3F4D',
              color: '#EBD9DF',
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 800,
              fontSize: '0.78rem',
              py: 0.6,
              px: 1.5,
              '&:hover': { bgcolor: '#523B2A' },
            }}
          >
            Quick Book
          </Button>
        </Box>
      </Box>

      {/* Action Popup Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleCloseMenu}
        slotProps={{ paper: { sx: { borderRadius: '12px', minWidth: 160 } } }}
      >
        <MenuItem onClick={() => { handleCloseMenu(); handleViewDetails(); }}>
          <VisibilityIcon sx={{ fontSize: 18, mr: 1, color: '#6A3F4D' }} />
          View Full Details
        </MenuItem>
        <MenuItem onClick={handleEdit}>
          <EditIcon sx={{ fontSize: 18, mr: 1, color: '#1565C0' }} />
          Edit Service
        </MenuItem>
        <MenuItem onClick={() => { handleCloseMenu(); toggleServiceStatus(service.id); }}>
          {service.status === 'Active' ? (
            <>
              <CancelIcon sx={{ fontSize: 18, mr: 1, color: '#D32F2F' }} />
              Mark Inactive
            </>
          ) : (
            <>
              <CheckCircleIcon sx={{ fontSize: 18, mr: 1, color: '#2E7D32' }} />
              Mark Active
            </>
          )}
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: '#D32F2F' }}>
          <DeleteIcon sx={{ fontSize: 18, mr: 1 }} />
          Delete Service
        </MenuItem>
      </Menu>
    </Paper>
  );
};
