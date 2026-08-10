import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
  Box,
  Typography,
  IconButton,
  Chip,
  InputAdornment,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { useInventory } from './InventoryContext';
import { useDashboard } from '../../context/DashboardContext';

export const RestockModal: React.FC = () => {
  const { isRestockModalOpen, restockItemTarget, closeRestockModal, inventory, addStockLog } =
    useInventory();
  const { restockItem } = useDashboard();

  const [selectedId, setSelectedId] = useState('');
  const [addedQty, setAddedQty] = useState(10);
  const [poReference, setPoReference] = useState('');
  const [supplierName, setSupplierName] = useState('');
  const [unitCost, setUnitCost] = useState(0);

  useEffect(() => {
    if (restockItemTarget) {
      setSelectedId(restockItemTarget.id);
      setSupplierName(restockItemTarget.supplier);
      setUnitCost(restockItemTarget.unitPrice);
    } else if (inventory.length > 0) {
      setSelectedId(inventory[0].id);
      setSupplierName(inventory[0].supplier);
      setUnitCost(inventory[0].unitPrice);
    }
    setPoReference(`PO-2026-${Math.floor(100 + Math.random() * 900)}`);
  }, [restockItemTarget, isRestockModalOpen, inventory]);

  const targetItem = inventory.find((i) => i.id === selectedId) || restockItemTarget || inventory[0];

  const handleProductSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = e.target.value;
    setSelectedId(id);
    const item = inventory.find((i) => i.id === id);
    if (item) {
      setSupplierName(item.supplier);
      setUnitCost(item.unitPrice);
    }
  };

  const handlePreset = (amount: number) => {
    setAddedQty((prev) => Math.max(1, prev + amount));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetItem || addedQty <= 0) return;

    restockItem(targetItem.id, addedQty);

    addStockLog({
      itemId: targetItem.id,
      itemName: targetItem.itemName,
      changeQty: addedQty,
      newQty: targetItem.remainingQty + addedQty,
      reason: `Restock Shipment (${poReference}) from ${supplierName || targetItem.supplier}`,
      type: 'Restock',
    });

    closeRestockModal();
  };

  if (!targetItem && inventory.length === 0) return null;

  return (
    <Dialog
      open={isRestockModalOpen}
      onClose={closeRestockModal}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: '20px',
            p: 1,
            bgcolor: '#FFFFFF',
          },
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '12px',
              bgcolor: '#F8F4EE',
              color: '#A8828F',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #E8DFD5',
            }}
          >
            <AddShoppingCartIcon />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#2D1F24', fontSize: '1.15rem' }}>
              Restock Inventory Shipment
            </Typography>
            <Typography variant="caption" sx={{ color: '#6E5C63' }}>
              Receive supplier delivery & increment stock levels.
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={closeRestockModal} size="small" sx={{ color: '#6E5C63' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers sx={{ borderTop: '1px solid #E8DFD5', borderBottom: '1px solid #E8DFD5', py: 2.5 }}>
          <Grid container spacing={2}>
            {/* Select Product */}
            <Grid size={{ xs: 12 }}>
              <TextField
                select
                required
                fullWidth
                label="Select Product to Restock"
                value={selectedId}
                onChange={handleProductSelect}
                size="small"
                slotProps={{
                  input: { sx: { borderRadius: '10px' } },
                }}
              >
                {inventory.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.itemName} (Current: {item.remainingQty} {item.unit})
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Current Stock Snapshot Card */}
            {targetItem && (
              <Grid size={{ xs: 12 }}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: '12px',
                    bgcolor: '#F8F4EE',
                    border: '1px solid #E8DFD5',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Box>
                    <Typography variant="caption" sx={{ color: '#6E5C63', display: 'block' }}>
                      Current Stock Level
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#2D1F24' }}>
                      {targetItem.remainingQty} {targetItem.unit}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="caption" sx={{ color: '#6E5C63', display: 'block' }}>
                      New Level After Restock
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#2E7D32' }}>
                      {targetItem.remainingQty + Number(addedQty || 0)} {targetItem.unit}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            )}

            {/* Quantity Input & Presets */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                required
                fullWidth
                type="number"
                label="Quantity Received"
                value={addedQty}
                onChange={(e) => setAddedQty(Number(e.target.value))}
                size="small"
                slotProps={{
                  htmlInput: { min: 1 },
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">{targetItem?.unit || 'Units'}</InputAdornment>
                    ),
                    sx: { borderRadius: '10px' },
                  },
                }}
              />
            </Grid>

            {/* Quick Presets */}
            <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="caption" sx={{ color: '#6E5C63', fontWeight: 700 }}>
                  Add:
                </Typography>
                {[+5, +10, +25, +50].map((amt) => (
                  <Chip
                    key={amt}
                    label={`+${amt}`}
                    onClick={() => handlePreset(amt)}
                    sx={{
                      bgcolor: '#F8F4EE',
                      color: '#6A3F4D',
                      border: '1px solid #E8DFD5',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      '&:hover': { bgcolor: '#EBD9DF' },
                    }}
                  />
                ))}
              </Box>
            </Grid>

            {/* PO Reference */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="PO / Invoice Reference"
                value={poReference}
                onChange={(e) => setPoReference(e.target.value)}
                size="small"
                slotProps={{
                  input: { sx: { borderRadius: '10px' } },
                }}
              />
            </Grid>

            {/* Supplier */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Supplier / Vendor Name"
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
                size="small"
                slotProps={{
                  input: { sx: { borderRadius: '10px' } },
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={closeRestockModal}
            sx={{
              color: '#6E5C63',
              fontWeight: 700,
              textTransform: 'none',
              borderRadius: '10px',
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={{
              bgcolor: '#6A3F4D',
              color: '#F8F4EE',
              fontWeight: 700,
              borderRadius: '10px',
              px: 3,
              textTransform: 'none',
              boxShadow: '0 4px 12px rgba(107, 79, 58, 0.25)',
              '&:hover': {
                bgcolor: '#543D2D',
              },
            }}
          >
            Confirm Restock
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
