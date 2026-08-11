import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Avatar,
  Paper,
  Divider,
} from '@mui/material';
import PercentIcon from '@mui/icons-material/Percent';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import { useEmployees } from './EmployeesContext';

export const AdjustCommissionModal: React.FC = () => {
  const {
    isAdjustCommissionModalOpen,
    setIsAdjustCommissionModalOpen,
    commissionEmployee,
    updateCommissionRate,
  } = useEmployees();

  const [rate, setRate] = useState(15);

  useEffect(() => {
    if (commissionEmployee) {
      setRate(commissionEmployee.commissionRate);
    }
  }, [commissionEmployee, isAdjustCommissionModalOpen]);

  if (!commissionEmployee) return null;

  const estimatedTodayComm = Math.round((commissionEmployee.todaySales * rate) / 100);
  const estimatedMonthComm = Math.round((commissionEmployee.monthlySales * rate) / 100);

  const handleSave = () => {
    updateCommissionRate(commissionEmployee.id, rate);
    setIsAdjustCommissionModalOpen(false);
  };

  return (
    <Dialog
      open={isAdjustCommissionModalOpen}
      onClose={() => setIsAdjustCommissionModalOpen(false)}
      maxWidth="xs"
      fullWidth
      slotProps={{
        paper: {
          sx: { borderRadius: '16px', p: 1 },
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 800, color: '#2D1F24', fontFamily: '"Inter", sans-serif' }}>
        Adjust Commission Rate
      </DialogTitle>

      <DialogContent dividers sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Employee Header */}
        <Paper elevation={0} sx={{ p: 2, bgcolor: '#F8F4EE', borderRadius: '12px', border: '1px solid #E8DFD5', display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar src={commissionEmployee.avatarUrl} alt={commissionEmployee.name} sx={{ width: 48, height: 48, border: '2px solid #EBD9DF' }} />
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#2D1F24' }}>
              {commissionEmployee.name}
            </Typography>
            <Typography variant="body2" sx={{ color: '#6E5C63' }}>
              {commissionEmployee.roleTitle}
            </Typography>
          </Box>
        </Paper>

        <TextField
          label="Base Commission Percentage (%)"
          type="number"
          fullWidth
          value={rate}
          onChange={(e) => setRate(Number(e.target.value))}
          slotProps={{
            input: { endAdornment: <Typography variant="caption">%</Typography> },
          }}
        />

        <Divider />

        {/* Live Calculation Preview */}
        <Box sx={{ bgcolor: '#FFFDF9', p: 2, borderRadius: '12px', border: '1px solid #EBD9DF' }}>
          <Typography variant="caption" sx={{ fontWeight: 800, color: '#6A3F4D', textTransform: 'uppercase', display: 'block', mb: 1 }}>
            Live Calculation Projection
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2" sx={{ color: '#6E5C63' }}>Today's Sales Revenue:</Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, color: '#2D1F24' }}>₹{commissionEmployee.todaySales.toLocaleString('en-IN')}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" sx={{ color: '#6E5C63' }}>Projected Today's Comm.:</Typography>
            <Typography variant="body2" sx={{ fontWeight: 800, color: '#2E7D32' }}>₹{estimatedTodayComm.toLocaleString('en-IN')}</Typography>
          </Box>

          <Divider sx={{ my: 1 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" sx={{ color: '#6E5C63' }}>Projected Month's Comm.:</Typography>
            <Typography variant="body2" sx={{ fontWeight: 800, color: '#6A3F4D' }}>₹{estimatedMonthComm.toLocaleString('en-IN')}</Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={() => setIsAdjustCommissionModalOpen(false)} sx={{ color: '#6E5C63', fontWeight: 700 }}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          sx={{ bgcolor: '#6A3F4D', color: '#F8F4EE', fontWeight: 700, borderRadius: '8px', '&:hover': { bgcolor: '#4A2B35' } }}
        >
          Update Rate
        </Button>
      </DialogActions>
    </Dialog>
  );
};
