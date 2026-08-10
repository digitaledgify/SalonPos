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
  InputAdornment,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import InventoryIcon from '@mui/icons-material/Inventory';
import { useInventory } from './InventoryContext';
import { useDashboard } from '../../context/DashboardContext';

const UNIT_OPTIONS = [
  'Tubes',
  'Bottles',
  'Kg',
  'Packs',
  'Tubs',
  'Jars',
  'Kits',
  'Units',
  'Boxes',
  'Liters',
];

const COMMON_CATEGORIES = [
  'Hair Care',
  'Skin Care',
  'Hair Color',
  'Hair Treatment',
  'Consumables',
  'Aesthetics',
  'Grooming',
  'Spa Care',
  'Nail Care',
];

export const AddEditProductModal: React.FC = () => {
  const { isAddEditModalOpen, editingItem, closeAddEditModal, addStockLog } = useInventory();
  const { addInventoryItem, updateInventoryItem } = useDashboard();

  const [formData, setFormData] = useState({
    itemName: '',
    category: 'Hair Care',
    customCategory: '',
    remainingQty: 10,
    minQty: 5,
    unit: 'Bottles',
    unitPrice: 500,
    supplier: '',
  });

  useEffect(() => {
    if (editingItem) {
      setFormData({
        itemName: editingItem.itemName,
        category: COMMON_CATEGORIES.includes(editingItem.category) ? editingItem.category : 'Other',
        customCategory: COMMON_CATEGORIES.includes(editingItem.category) ? '' : editingItem.category,
        remainingQty: editingItem.remainingQty,
        minQty: editingItem.minQty,
        unit: editingItem.unit,
        unitPrice: editingItem.unitPrice,
        supplier: editingItem.supplier,
      });
    } else {
      setFormData({
        itemName: '',
        category: 'Hair Care',
        customCategory: '',
        remainingQty: 10,
        minQty: 5,
        unit: 'Bottles',
        unitPrice: 500,
        supplier: '',
      });
    }
  }, [editingItem, isAddEditModalOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'remainingQty' || name === 'minQty' || name === 'unitPrice' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.itemName.trim()) return;

    const finalCategory =
      formData.category === 'Other' && formData.customCategory.trim()
        ? formData.customCategory.trim()
        : formData.category;

    if (editingItem) {
      updateInventoryItem(editingItem.id, {
        itemName: formData.itemName,
        category: finalCategory,
        remainingQty: formData.remainingQty,
        minQty: formData.minQty,
        unit: formData.unit,
        unitPrice: formData.unitPrice,
        supplier: formData.supplier || 'General Supplier',
      });
    } else {
      addInventoryItem({
        itemName: formData.itemName,
        category: finalCategory,
        remainingQty: formData.remainingQty,
        minQty: formData.minQty,
        unit: formData.unit,
        supplier: formData.supplier || 'General Supplier',
        unitPrice: formData.unitPrice,
      });

      addStockLog({
        itemId: `inv-${Date.now()}`,
        itemName: formData.itemName,
        changeQty: formData.remainingQty,
        newQty: formData.remainingQty,
        reason: 'Initial stock entry registered',
        type: 'Initial',
      });
    }

    closeAddEditModal();
  };

  return (
    <Dialog
      open={isAddEditModalOpen}
      onClose={closeAddEditModal}
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
              color: '#6A3F4D',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #E8DFD5',
            }}
          >
            <InventoryIcon />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#2D1F24', fontSize: '1.15rem' }}>
              {editingItem ? 'Edit Product Details' : 'Add New Inventory Item'}
            </Typography>
            <Typography variant="caption" sx={{ color: '#6E5C63' }}>
              {editingItem ? 'Update stock parameters or details.' : 'Register new stock for your salon salon catalog.'}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={closeAddEditModal} size="small" sx={{ color: '#6E5C63' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers sx={{ borderTop: '1px solid #E8DFD5', borderBottom: '1px solid #E8DFD5', py: 2.5 }}>
          <Grid container spacing={2}>
            {/* Item Name */}
            <Grid size={{ xs: 12 }}>
              <TextField
                required
                fullWidth
                label="Product Name"
                name="itemName"
                value={formData.itemName}
                onChange={handleChange}
                placeholder="e.g. L’Oréal Professional Hair Shampoo 1000ml"
                size="small"
                slotProps={{
                  input: {
                    sx: { borderRadius: '10px' },
                  },
                }}
              />
            </Grid>

            {/* Category Select */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                fullWidth
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                size="small"
                slotProps={{
                  input: {
                    sx: { borderRadius: '10px' },
                  },
                }}
              >
                {COMMON_CATEGORIES.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
                <MenuItem value="Other">Other (Custom)</MenuItem>
              </TextField>
            </Grid>

            {/* Custom Category input if selected */}
            {formData.category === 'Other' && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  required
                  fullWidth
                  label="Specify Custom Category"
                  name="customCategory"
                  value={formData.customCategory}
                  onChange={handleChange}
                  size="small"
                  slotProps={{
                    input: {
                      sx: { borderRadius: '10px' },
                    },
                  }}
                />
              </Grid>
            )}

            {/* Unit type */}
            <Grid size={{ xs: 12, sm: formData.category === 'Other' ? 12 : 6 }}>
              <TextField
                select
                fullWidth
                label="Unit Measurement"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                size="small"
                slotProps={{
                  input: {
                    sx: { borderRadius: '10px' },
                  },
                }}
              >
                {UNIT_OPTIONS.map((u) => (
                  <MenuItem key={u} value={u}>
                    {u}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Initial / Remaining Qty */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                required
                fullWidth
                type="number"
                label="Current Stock Qty"
                name="remainingQty"
                value={formData.remainingQty}
                onChange={handleChange}
                size="small"
                slotProps={{
                  htmlInput: { min: 0 },
                  input: { sx: { borderRadius: '10px' } },
                }}
              />
            </Grid>

            {/* Min Threshold Qty */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                required
                fullWidth
                type="number"
                label="Low Stock Threshold (Min Qty)"
                name="minQty"
                value={formData.minQty}
                onChange={handleChange}
                size="small"
                helperText="Triggers reorder warning when stock drops below this"
                slotProps={{
                  htmlInput: { min: 1 },
                  input: { sx: { borderRadius: '10px' } },
                }}
              />
            </Grid>

            {/* Unit Price (₹) */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                required
                fullWidth
                type="number"
                label="Unit Price (₹)"
                name="unitPrice"
                value={formData.unitPrice}
                onChange={handleChange}
                size="small"
                slotProps={{
                  htmlInput: { min: 0, step: 10 },
                  input: {
                    startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                    sx: { borderRadius: '10px' },
                  },
                }}
              />
            </Grid>

            {/* Supplier Name */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Supplier / Vendor"
                name="supplier"
                value={formData.supplier}
                onChange={handleChange}
                placeholder="e.g. BeautySupplies Co."
                size="small"
                slotProps={{
                  input: {
                    sx: { borderRadius: '10px' },
                  },
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={closeAddEditModal}
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
            {editingItem ? 'Save Changes' : 'Create Product'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
