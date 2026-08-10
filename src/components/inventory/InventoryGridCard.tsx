import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  Stack,
  LinearProgress,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import HistoryIcon from '@mui/icons-material/History';
import StoreIcon from '@mui/icons-material/Store';
import { InventoryItem } from '../../types';
import { useInventory } from './InventoryContext';
import { useDashboard } from '../../context/DashboardContext';

interface InventoryGridCardProps {
  item: InventoryItem;
}

export const InventoryGridCard: React.FC<InventoryGridCardProps> = ({ item }) => {
  const { openEditModal, openRestockModal, openAdjustmentModal, openHistoryDrawer } = useInventory();
  const { deleteInventoryItem } = useDashboard();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const stockPct = Math.min(100, Math.round((item.remainingQty / (item.minQty * 2.5)) * 100));
  const totalVal = item.remainingQty * item.unitPrice;

  let statusBg = '#E8F5E9';
  let statusColor = '#2E7D32';
  let statusBorder = '#C8E6C9';
  let progressColor = '#2E7D32';

  if (item.status === 'Critical') {
    statusBg = '#FFF5F5';
    statusColor = '#D32F2F';
    statusBorder = '#FFCDD2';
    progressColor = '#D32F2F';
  } else if (item.status === 'Low') {
    statusBg = '#FFF8F0';
    statusColor = '#ED6C02';
    statusBorder = '#FFE0B2';
    progressColor = '#ED6C02';
  }

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: '16px',
        border: '1px solid #E8DFD5',
        bgcolor: '#FFFFFF',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'all 0.2s ease',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: '0 8px 24px rgba(107, 79, 58, 0.08)',
          borderColor: '#D4C4B0',
        },
      }}
    >
      <CardContent sx={{ p: 2.5, flexGrow: 1 }}>
        {/* Top Header: Category & Status Badge & Menu */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              label={item.category}
              size="small"
              sx={{
                bgcolor: '#F8F4EE',
                color: '#6A3F4D',
                border: '1px solid #E8DFD5',
                fontWeight: 700,
                fontSize: '0.7rem',
                height: 22,
              }}
            />
            <Chip
              label={item.status}
              size="small"
              sx={{
                bgcolor: statusBg,
                color: statusColor,
                border: `1px solid ${statusBorder}`,
                fontWeight: 800,
                fontSize: '0.7rem',
                height: 22,
              }}
            />
          </Box>

          <IconButton
            size="small"
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{ color: '#6E5C63', ml: 1 }}
          >
            <MoreVertIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>

        {/* Product Title */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 800,
            color: '#2D1F24',
            fontSize: '1.05rem',
            lineHeight: 1.3,
            mb: 0.5,
            minHeight: 44,
          }}
        >
          {item.itemName}
        </Typography>

        {/* Supplier Info */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2 }}>
          <StoreIcon sx={{ fontSize: 14, color: '#6E5C63' }} />
          <Typography variant="caption" sx={{ color: '#6E5C63', fontWeight: 600 }}>
            {item.supplier}
          </Typography>
        </Box>

        {/* Stock Level Bar */}
        <Box sx={{ p: 1.5, borderRadius: '12px', bgcolor: '#F8F4EE', border: '1px solid #F0E8DC', mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.75 }}>
            <Typography variant="caption" sx={{ color: '#6E5C63', fontWeight: 600 }}>
              Remaining Quantity
            </Typography>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: statusColor }}>
              {item.remainingQty} {item.unit}
            </Typography>
          </Box>

          <LinearProgress
            variant="determinate"
            value={stockPct}
            sx={{
              height: 7,
              borderRadius: 3.5,
              bgcolor: '#E8DFD5',
              mb: 0.75,
              '& .MuiLinearProgress-bar': { bgcolor: progressColor },
            }}
          />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption" sx={{ color: '#6E5C63', fontSize: '0.7rem' }}>
              Min Threshold: {item.minQty} {item.unit}
            </Typography>
            <Typography variant="caption" sx={{ color: statusColor, fontWeight: 700, fontSize: '0.7rem' }}>
              {stockPct}% level
            </Typography>
          </Box>
        </Box>

        {/* Pricing Metrics */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="caption" sx={{ color: '#6E5C63', display: 'block', fontSize: '0.7rem' }}>
              Unit Price
            </Typography>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#2D1F24' }}>
              ₹{item.unitPrice.toLocaleString('en-IN')}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="caption" sx={{ color: '#6E5C63', display: 'block', fontSize: '0.7rem' }}>
              Total Valuation
            </Typography>
            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#6A3F4D' }}>
              ₹{totalVal.toLocaleString('en-IN')}
            </Typography>
          </Box>
        </Box>
      </CardContent>

      <Divider sx={{ borderColor: '#F0E8DC' }} />

      {/* Card Footer Actions */}
      <Box sx={{ p: 1.5, px: 2, bgcolor: '#F8F4EE', display: 'flex', gap: 1 }}>
        <Button
          fullWidth
          size="small"
          variant="contained"
          startIcon={<AddShoppingCartIcon />}
          onClick={() => openRestockModal(item)}
          sx={{
            bgcolor: '#6A3F4D',
            color: '#F8F4EE',
            fontWeight: 700,
            borderRadius: '8px',
            textTransform: 'none',
            fontSize: '0.8rem',
            boxShadow: 'none',
            '&:hover': {
              bgcolor: '#543D2D',
              boxShadow: 'none',
            },
          }}
        >
          Restock
        </Button>

        <Button
          size="small"
          variant="outlined"
          startIcon={<RemoveCircleIcon />}
          onClick={() => openAdjustmentModal(item)}
          sx={{
            color: '#C53030',
            borderColor: '#FED7D7',
            bgcolor: '#FFF5F5',
            fontWeight: 700,
            borderRadius: '8px',
            textTransform: 'none',
            fontSize: '0.8rem',
            '&:hover': {
              borderColor: '#E53E3E',
              bgcolor: '#FED7D7',
            },
          }}
        >
          Use
        </Button>
      </Box>

      {/* Options Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        slotProps={{
          paper: {
            elevation: 3,
            sx: { borderRadius: '12px', border: '1px solid #E8DFD5', minWidth: 160 },
          },
        }}
      >
        <MenuItem
          onClick={() => {
            openHistoryDrawer(item);
            setAnchorEl(null);
          }}
        >
          <ListItemIcon sx={{ color: '#6A3F4D' }}>
            <HistoryIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Logs" slotProps={{ primary: { sx: { fontWeight: 700, fontSize: '0.85rem' } } }} />
        </MenuItem>

        <MenuItem
          onClick={() => {
            openEditModal(item);
            setAnchorEl(null);
          }}
        >
          <ListItemIcon sx={{ color: '#2D1F24' }}>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Edit Details" slotProps={{ primary: { sx: { fontWeight: 700, fontSize: '0.85rem' } } }} />
        </MenuItem>

        <MenuItem
          onClick={() => {
            deleteInventoryItem(item.id);
            setAnchorEl(null);
          }}
          sx={{ color: '#D32F2F' }}
        >
          <ListItemIcon sx={{ color: '#D32F2F' }}>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Delete" slotProps={{ primary: { sx: { fontWeight: 700, fontSize: '0.85rem' } } }} />
        </MenuItem>
      </Menu>
    </Card>
  );
};
