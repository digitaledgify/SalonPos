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
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { useInventory } from './InventoryContext';
import { useDashboard } from '../../context/DashboardContext';

const REASON_OPTIONS = [
  'Salon Internal Usage (Client Treatment)',
  'Damaged / Leaked Container',
  'Expired Product Disposal',
  'Audit Adjustment (Discrepancy Correction)',
  'Transferred / Gifted Sample',
];

export const StockAdjustmentModal: React.FC = () => {
  const {
    isAdjustmentModalOpen,
    adjustmentItemTarget,
    closeAdjustmentModal,
    inventory,
    addStockLog,
  } = useInventory();
  const { adjustInventoryStock, stylists, role } = useDashboard();

  const [selectedId, setSelectedId] = useState('');
  const [deductQty, setDeductQty] = useState(1);
  const [reasonCategory, setReasonCategory] = useState(REASON_OPTIONS[0]);
  const [assignedStylist, setAssignedStylist] = useState('');
  const [customNotes, setCustomNotes] = useState('');

  useEffect(() => {
    if (adjustmentItemTarget) {
      setSelectedId(adjustmentItemTarget.id);
    } else if (inventory.length > 0) {
      setSelectedId(inventory[0].id);
    }
  }, [adjustmentItemTarget, isAdjustmentModalOpen, inventory]);

  const targetItem = inventory.find((i) => i.id === selectedId) || adjustmentItemTarget || inventory[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetItem || deductQty <= 0) return;

    const delta = -deductQty;
    const finalReason = `${reasonCategory} ${assignedStylist ? `(By ${assignedStylist})` : ''} ${customNotes ? `- ${customNotes}` : ''}`;

    adjustInventoryStock(targetItem.id, delta, finalReason);

    addStockLog({
      itemId: targetItem.id,
      itemName: targetItem.itemName,
      changeQty: delta,
      newQty: Math.max(0, targetItem.remainingQty - deductQty),
      reason: finalReason,
      type: reasonCategory.includes('Usage') ? 'Salon Use' : 'Adjustment',
    });

    closeAdjustmentModal();
  };

  if (!targetItem && inventory.length === 0) return null;

  return (
    <Dialog
      open={isAdjustmentModalOpen}
      onClose={closeAdjustmentModal}
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
              bgcolor: '#FFF5F5',
              color: '#C53030',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid #FED7D7',
            }}
          >
            <RemoveCircleIcon />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#2D1F24', fontSize: '1.15rem' }}>
              Log Stock Usage or Wastage
            </Typography>
            <Typography variant="caption" sx={{ color: '#6E5C63' }}>
              Deduct inventory used during client services or discarded items.
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={closeAdjustmentModal} size="small" sx={{ color: '#6E5C63' }}>
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
                label="Select Inventory Product"
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                size="small"
                slotProps={{
                  input: { sx: { borderRadius: '10px' } },
                }}
              >
                {inventory.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.itemName} (Available: {item.remainingQty} {item.unit})
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Current Level Preview */}
            {targetItem && (
              <Grid size={{ xs: 12 }}>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: '12px',
                    bgcolor: '#FFF5F5',
                    border: '1px solid #FED7D7',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Box>
                    <Typography variant="caption" sx={{ color: '#C53030', display: 'block', fontWeight: 600 }}>
                      Current Stock
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#2D1F24' }}>
                      {targetItem.remainingQty} {targetItem.unit}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="caption" sx={{ color: '#C53030', display: 'block', fontWeight: 600 }}>
                      Remaining After Deduction
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#C53030' }}>
                      {Math.max(0, targetItem.remainingQty - Number(deductQty || 0))} {targetItem.unit}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            )}

            {/* Deduct Quantity */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                required
                fullWidth
                type="number"
                label="Quantity Used / Deducted"
                value={deductQty}
                onChange={(e) => setDeductQty(Number(e.target.value))}
                size="small"
                slotProps={{
                  htmlInput: { min: 1, max: targetItem?.remainingQty || 9999 },
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">{targetItem?.unit || 'Units'}</InputAdornment>
                    ),
                    sx: { borderRadius: '10px' },
                  },
                }}
              />
            </Grid>

            {/* Reason Category */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                required
                fullWidth
                label="Reason Category"
                value={reasonCategory}
                onChange={(e) => setReasonCategory(e.target.value)}
                size="small"
                slotProps={{
                  input: { sx: { borderRadius: '10px' } },
                }}
              >
                {REASON_OPTIONS.map((opt) => (
                  <MenuItem key={opt} value={opt}>
                    {opt}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Stylist / Staff Member */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                fullWidth
                label="Stylist / Staff Responsible"
                value={assignedStylist}
                onChange={(e) => setAssignedStylist(e.target.value)}
                size="small"
                slotProps={{
                  input: { sx: { borderRadius: '10px' } },
                }}
              >
                <MenuItem value="">Unassigned / Store</MenuItem>
                {stylists.map((st) => (
                  <MenuItem key={st.id} value={st.name}>
                    {st.name} ({st.roleTitle})
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Additional Notes */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Additional Notes / Ref"
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                placeholder="e.g. Appointment with Ananya"
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
            onClick={closeAdjustmentModal}
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
              bgcolor: '#C53030',
              color: '#FFFFFF',
              fontWeight: 700,
              borderRadius: '10px',
              px: 3,
              textTransform: 'none',
              boxShadow: '0 4px 12px rgba(197, 48, 48, 0.25)',
              '&:hover': {
                bgcolor: '#9B2C2C',
              },
            }}
          >
            Log Deduction
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
