import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Box,
  Button,
  LinearProgress,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Stack,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import HistoryIcon from '@mui/icons-material/History';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { useInventory } from './InventoryContext';
import { useDashboard } from '../../context/DashboardContext';
import { InventoryItem } from '../../types';

export const InventoryTable: React.FC = () => {
  const {
    filteredInventory,
    openEditModal,
    openRestockModal,
    openAdjustmentModal,
    openHistoryDrawer,
  } = useInventory();
  const { deleteInventoryItem } = useDashboard();

  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, item: InventoryItem) => {
    setMenuAnchorEl(event.currentTarget);
    setSelectedItem(item);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedItem(null);
  };

  if (filteredInventory.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 6,
          borderRadius: '16px',
          bgcolor: '#FFFFFF',
          border: '1px solid #E8DFD5',
          textAlign: 'center',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 800, color: '#2D1F24', mb: 1 }}>
          No Inventory Products Found
        </Typography>
        <Typography variant="body2" sx={{ color: '#6E5C63' }}>
          No salon products match your selected filters. Try broadening your search or category filter.
        </Typography>
      </Paper>
    );
  }

  return (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        borderRadius: '16px',
        border: '1px solid #E8DFD5',
        bgcolor: '#FFFFFF',
        overflow: 'hidden',
      }}
    >
      <Table sx={{ minWidth: 800 }}>
        <TableHead sx={{ bgcolor: '#F8F4EE' }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 800, color: '#6A3F4D', py: 2 }}>Product Name & Category</TableCell>
            <TableCell align="center" sx={{ fontWeight: 800, color: '#6A3F4D', py: 2 }}>Stock Level</TableCell>
            <TableCell align="center" sx={{ fontWeight: 800, color: '#6A3F4D', py: 2 }}>Qty / Unit</TableCell>
            <TableCell align="right" sx={{ fontWeight: 800, color: '#6A3F4D', py: 2 }}>Unit Price</TableCell>
            <TableCell align="right" sx={{ fontWeight: 800, color: '#6A3F4D', py: 2 }}>Total Value</TableCell>
            <TableCell align="center" sx={{ fontWeight: 800, color: '#6A3F4D', py: 2 }}>Status</TableCell>
            <TableCell align="left" sx={{ fontWeight: 800, color: '#6A3F4D', py: 2 }}>Supplier</TableCell>
            <TableCell align="right" sx={{ fontWeight: 800, color: '#6A3F4D', py: 2 }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredInventory.map((item) => {
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
              <TableRow
                key={item.id}
                hover
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                  transition: 'background-color 0.15s ease',
                  bgcolor: item.status === 'Critical' ? 'rgba(255, 245, 245, 0.4)' : 'transparent',
                }}
              >
                {/* Product Name */}
                <TableCell sx={{ py: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#2D1F24', fontSize: '0.925rem' }}>
                    {item.itemName}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                    <Chip
                      label={item.category}
                      size="small"
                      sx={{
                        bgcolor: '#F8F4EE',
                        color: '#6A3F4D',
                        border: '1px solid #E8DFD5',
                        fontWeight: 700,
                        fontSize: '0.7rem',
                        height: 20,
                      }}
                    />
                    <Typography variant="caption" sx={{ color: '#6E5C63' }}>
                      ID: {item.id}
                    </Typography>
                  </Box>
                </TableCell>

                {/* Stock Level Ratio Bar */}
                <TableCell align="center" sx={{ minWidth: 140, py: 2 }}>
                  <Box sx={{ width: '100%', maxW: 130, mx: 'auto' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption" sx={{ color: '#6E5C63', fontWeight: 600 }}>
                        Min: {item.minQty}
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: statusColor }}>
                        {stockPct}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={stockPct}
                      sx={{
                        height: 7,
                        borderRadius: 3.5,
                        bgcolor: '#F8F4EE',
                        '& .MuiLinearProgress-bar': { bgcolor: progressColor },
                      }}
                    />
                  </Box>
                </TableCell>

                {/* Remaining Qty */}
                <TableCell align="center" sx={{ py: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: statusColor, fontSize: '0.95rem' }}>
                    {item.remainingQty} <Typography component="span" variant="caption" sx={{ color: '#6E5C63', fontWeight: 600 }}>{item.unit}</Typography>
                  </Typography>
                </TableCell>

                {/* Unit Price */}
                <TableCell align="right" sx={{ py: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#2D1F24' }}>
                    ₹{item.unitPrice.toLocaleString('en-IN')}
                  </Typography>
                </TableCell>

                {/* Total Value */}
                <TableCell align="right" sx={{ py: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: '#6A3F4D' }}>
                    ₹{totalVal.toLocaleString('en-IN')}
                  </Typography>
                </TableCell>

                {/* Status Badge */}
                <TableCell align="center" sx={{ py: 2 }}>
                  <Chip
                    label={item.status}
                    size="small"
                    sx={{
                      bgcolor: statusBg,
                      color: statusColor,
                      border: `1px solid ${statusBorder}`,
                      fontWeight: 800,
                      fontSize: '0.75rem',
                      px: 0.5,
                    }}
                  />
                </TableCell>

                {/* Supplier */}
                <TableCell align="left" sx={{ py: 2 }}>
                  <Typography variant="body2" sx={{ color: '#2D1F24', fontWeight: 600 }}>
                    {item.supplier}
                  </Typography>
                </TableCell>

                {/* Action Column */}
                <TableCell align="right" sx={{ py: 2 }}>
                  <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end', alignItems: 'center' }}>
                    <Tooltip title="Quick Restock">
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => openRestockModal(item)}
                        sx={{
                          bgcolor: '#F8F4EE',
                          color: '#6A3F4D',
                          border: '1px solid #D4C4B0',
                          minWidth: 32,
                          px: 1,
                          py: 0.5,
                          borderRadius: '8px',
                          textTransform: 'none',
                          fontWeight: 700,
                          boxShadow: 'none',
                          '&:hover': {
                            bgcolor: '#6A3F4D',
                            color: '#FFFFFF',
                            boxShadow: 'none',
                          },
                        }}
                      >
                        <AddShoppingCartIcon sx={{ fontSize: 16, mr: 0.5 }} /> Restock
                      </Button>
                    </Tooltip>

                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, item)}
                      sx={{ color: '#6E5C63', '&:hover': { bgcolor: '#F8F4EE' } }}
                    >
                      <MoreVertIcon sx={{ fontSize: 20 }} />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Row Context Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        slotProps={{
          paper: {
            elevation: 3,
            sx: {
              borderRadius: '12px',
              border: '1px solid #E8DFD5',
              minWidth: 180,
              p: 0.5,
            },
          },
        }}
      >
        {selectedItem && (
          <>
            <MenuItem
              onClick={() => {
                openRestockModal(selectedItem);
                handleMenuClose();
              }}
              sx={{ borderRadius: '8px', py: 1 }}
            >
              <ListItemIcon sx={{ color: '#2E7D32' }}>
                <AddShoppingCartIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Restock Product" slotProps={{ primary: { sx: { fontWeight: 700, fontSize: '0.85rem' } } }} />
            </MenuItem>

            <MenuItem
              onClick={() => {
                openAdjustmentModal(selectedItem);
                handleMenuClose();
              }}
              sx={{ borderRadius: '8px', py: 1 }}
            >
              <ListItemIcon sx={{ color: '#ED6C02' }}>
                <RemoveCircleIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Log Usage / Waste" slotProps={{ primary: { sx: { fontWeight: 700, fontSize: '0.85rem' } } }} />
            </MenuItem>

            <MenuItem
              onClick={() => {
                openHistoryDrawer(selectedItem);
                handleMenuClose();
              }}
              sx={{ borderRadius: '8px', py: 1 }}
            >
              <ListItemIcon sx={{ color: '#6A3F4D' }}>
                <HistoryIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Movement Logs" slotProps={{ primary: { sx: { fontWeight: 700, fontSize: '0.85rem' } } }} />
            </MenuItem>

            <MenuItem
              onClick={() => {
                openEditModal(selectedItem);
                handleMenuClose();
              }}
              sx={{ borderRadius: '8px', py: 1 }}
            >
              <ListItemIcon sx={{ color: '#2D1F24' }}>
                <EditIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Edit Product Details" slotProps={{ primary: { sx: { fontWeight: 700, fontSize: '0.85rem' } } }} />
            </MenuItem>

            <MenuItem
              onClick={() => {
                deleteInventoryItem(selectedItem.id);
                handleMenuClose();
              }}
              sx={{ borderRadius: '8px', py: 1, color: '#D32F2F' }}
            >
              <ListItemIcon sx={{ color: '#D32F2F' }}>
                <DeleteIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Delete Product" slotProps={{ primary: { sx: { fontWeight: 700, fontSize: '0.85rem' } } }} />
            </MenuItem>
          </>
        )}
      </Menu>
    </TableContainer>
  );
};
