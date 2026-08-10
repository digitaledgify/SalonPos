import React from 'react';
import { Box, Typography, Button, Stack, Chip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import HistoryIcon from '@mui/icons-material/History';
import InventoryIcon from '@mui/icons-material/Inventory';
import { useInventory } from './InventoryContext';
import { useDashboard } from '../../context/DashboardContext';

export const InventoryPageHeader: React.FC = () => {
  const { openAddModal, openRestockModal, openAdjustmentModal, openHistoryDrawer, exportToCSV } =
    useInventory();
  const { role } = useDashboard();

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
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '12px',
              bgcolor: '#6A3F4D',
              color: '#F8F4EE',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(107, 79, 58, 0.2)',
            }}
          >
            <InventoryIcon sx={{ fontSize: 22 }} />
          </Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              color: '#2D1F24',
              fontFamily: '"Playfair Display", serif, "Plus Jakarta Sans"',
              fontSize: { xs: '1.5rem', sm: '1.85rem' },
              letterSpacing: '-0.02em',
            }}
          >
            Salon Inventory Management
          </Typography>
          <Chip
            label={role}
            size="small"
            sx={{
              bgcolor: '#EBD9DF',
              color: '#6A3F4D',
              fontWeight: 700,
              fontSize: '0.75rem',
              height: 24,
            }}
          />
        </Box>
        <Typography variant="body2" sx={{ color: '#6E5C63' }}>
          Real-time tracking for salon products, color tubes, spas, consumables, and supplier orders.
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: 1.5,
          flexWrap: 'wrap',
          width: { xs: '100%', md: 'auto' },
        }}
      >
        <Button
          variant="outlined"
          startIcon={<HistoryIcon />}
          onClick={() => openHistoryDrawer()}
          sx={{
            color: '#6A3F4D',
            borderColor: '#D4C4B0',
            bgcolor: '#FFFFFF',
            fontWeight: 700,
            borderRadius: '10px',
            textTransform: 'none',
            '&:hover': {
              borderColor: '#6A3F4D',
              bgcolor: '#F8F4EE',
            },
          }}
        >
          Audit History
        </Button>

        <Button
          variant="outlined"
          startIcon={<FileDownloadIcon />}
          onClick={exportToCSV}
          sx={{
            color: '#6A3F4D',
            borderColor: '#D4C4B0',
            bgcolor: '#FFFFFF',
            fontWeight: 700,
            borderRadius: '10px',
            textTransform: 'none',
            '&:hover': {
              borderColor: '#6A3F4D',
              bgcolor: '#F8F4EE',
            },
          }}
        >
          Export CSV
        </Button>

        <Button
          variant="outlined"
          startIcon={<RemoveCircleIcon />}
          onClick={() => openAdjustmentModal()}
          sx={{
            color: '#C53030',
            borderColor: '#FED7D7',
            bgcolor: '#FFF5F5',
            fontWeight: 700,
            borderRadius: '10px',
            textTransform: 'none',
            '&:hover': {
              borderColor: '#E53E3E',
              bgcolor: '#FED7D7',
            },
          }}
        >
          Log Usage / Waste
        </Button>

        <Button
          variant="contained"
          startIcon={<AddShoppingCartIcon />}
          onClick={() => openRestockModal()}
          sx={{
            bgcolor: '#A8828F',
            color: '#FFFFFF',
            fontWeight: 700,
            borderRadius: '10px',
            textTransform: 'none',
            boxShadow: 'none',
            '&:hover': {
              bgcolor: '#B29369',
              boxShadow: 'none',
            },
          }}
        >
          Restock Shipment
        </Button>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openAddModal}
          sx={{
            bgcolor: '#6A3F4D',
            color: '#F8F4EE',
            fontWeight: 700,
            borderRadius: '10px',
            textTransform: 'none',
            boxShadow: '0 4px 12px rgba(107, 79, 58, 0.25)',
            '&:hover': {
              bgcolor: '#543D2D',
              boxShadow: '0 6px 16px rgba(107, 79, 58, 0.35)',
            },
          }}
        >
          Add Product
        </Button>
      </Box>
    </Box>
  );
};
