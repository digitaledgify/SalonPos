import React, { useState } from 'react';
import { Box, Paper, Typography, LinearProgress, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import LoyaltyIcon from '@mui/icons-material/Loyalty';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutlined';
import RedeemIcon from '@mui/icons-material/Redeem';
import { Customer } from '../../types/customer';
import { useCustomers } from '../../context/CustomerContext';

interface Props {
  customer: Customer;
}

export const LoyaltyCard: React.FC<Props> = ({ customer }) => {
  const { addLoyaltyPoints, redeemLoyaltyPoints } = useCustomers();

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [redeemDialogOpen, setRedeemDialogOpen] = useState(false);
  const [pointsInput, setPointsInput] = useState('100');

  const { availablePoints, lifetimePoints, redeemedPoints } = customer.loyalty;

  // Next reward threshold (multiples of 100 points)
  const nextMilestone = Math.ceil((availablePoints + 1) / 100) * 100 || 100;
  const progressPercent = Math.min(100, Math.round((availablePoints / nextMilestone) * 100));
  const pointsNeeded = nextMilestone - availablePoints;

  const handleAdd = () => {
    const pts = parseInt(pointsInput, 10);
    if (!isNaN(pts) && pts > 0) {
      addLoyaltyPoints(customer.id, pts);
      setAddDialogOpen(false);
      setPointsInput('100');
    }
  };

  const handleRedeem = () => {
    const pts = parseInt(pointsInput, 10);
    if (!isNaN(pts) && pts > 0) {
      const ok = redeemLoyaltyPoints(customer.id, pts);
      if (ok) {
        setRedeemDialogOpen(false);
        setPointsInput('100');
      }
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: '16px',
        background: 'linear-gradient(135deg, #6A3F4D 0%, #4A2B35 100%)',
        color: '#FFFFFF',
        boxShadow: '0 8px 24px rgba(107, 79, 58, 0.25)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative Background Circles */}
      <Box
        sx={{
          position: 'absolute',
          top: -20,
          right: -20,
          width: 140,
          height: 140,
          borderRadius: '50%',
          bgcolor: 'rgba(231, 214, 187, 0.08)',
          pointerEvents: 'none',
        }}
      />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LoyaltyIcon sx={{ color: '#EBD9DF', fontSize: 24 }} />
          <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: '"Playfair Display", serif', color: '#EBD9DF' }}>
            Loyalty Rewards Program
          </Typography>
        </Box>
        <Typography variant="caption" sx={{ bgcolor: 'rgba(231, 214, 187, 0.18)', color: '#EBD9DF', px: 1.5, py: 0.5, borderRadius: '20px', fontWeight: 700 }}>
          Rule: ₹100 = 1 Point
        </Typography>
      </Box>

      {/* Grid Stats */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' },
          gap: 2,
          my: 2,
          p: 2,
          borderRadius: '12px',
          bgcolor: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(4px)',
        }}
      >
        <Box>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
            Available Points
          </Typography>
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#EBD9DF', fontFamily: '"Poppins", sans-serif' }}>
            {availablePoints}
          </Typography>
          <Typography variant="caption" sx={{ color: '#EBD9DF', fontSize: '0.7rem' }}>
            Worth ₹{availablePoints}
          </Typography>
        </Box>

        <Box>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
            Lifetime Earned
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 700, mt: 0.5 }}>
            {lifetimePoints}
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.7rem' }}>
            Points total
          </Typography>
        </Box>

        <Box>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
            Redeemed Points
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 700, mt: 0.5 }}>
            {redeemedPoints}
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.7rem' }}>
            Saved ₹{redeemedPoints}
          </Typography>
        </Box>

        <Box>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
            Redemption Value
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 700, mt: 0.5, color: '#A5D6A7' }}>
            100 Pts = ₹100
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.7rem' }}>
            Instant discount
          </Typography>
        </Box>
      </Box>

      {/* Progress Bar to next reward */}
      <Box sx={{ mt: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.8 }}>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>
            Progress to Next Reward ({nextMilestone} Points = ₹{nextMilestone} Voucher)
          </Typography>
          <Typography variant="caption" sx={{ color: '#EBD9DF', fontWeight: 700 }}>
            {pointsNeeded > 0 ? `${pointsNeeded} points needed` : 'Reward Unlocked!'}
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={progressPercent}
          sx={{
            height: 8,
            borderRadius: 4,
            bgcolor: 'rgba(255,255,255,0.15)',
            '& .MuiLinearProgress-bar': {
              bgcolor: '#EBD9DF',
              borderRadius: 4,
            },
          }}
        />
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end', mt: 2 }}>
        <Button
          variant="outlined"
          startIcon={<AddCircleOutlineIcon />}
          onClick={() => setAddDialogOpen(true)}
          sx={{
            borderColor: '#EBD9DF',
            color: '#EBD9DF',
            fontWeight: 700,
            borderRadius: '10px',
            fontSize: '0.82rem',
            '&:hover': {
              borderColor: '#FFFFFF',
              bgcolor: 'rgba(231, 214, 187, 0.15)',
            },
          }}
        >
          + Add Points
        </Button>

        <Button
          variant="contained"
          startIcon={<RedeemIcon />}
          onClick={() => setRedeemDialogOpen(true)}
          disabled={availablePoints < 100}
          sx={{
            bgcolor: '#EBD9DF',
            color: '#2D1F24',
            fontWeight: 800,
            borderRadius: '10px',
            fontSize: '0.82rem',
            '&:hover': {
              bgcolor: '#FFFFFF',
            },
            '&.Mui-disabled': {
              bgcolor: 'rgba(231, 214, 187, 0.3)',
              color: 'rgba(255,255,255,0.4)',
            },
          }}
        >
          Redeem Points (₹{availablePoints})
        </Button>
      </Box>

      {/* Add Points Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)}>
        <DialogTitle sx={{ fontWeight: 800, color: '#2D1F24' }}>Add Loyalty Points</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: '#6E5C63', mb: 2 }}>
            Manually add promotional or bonus loyalty points to {customer.fullName}.
          </Typography>
          <TextField
            fullWidth
            label="Points to Add"
            type="number"
            value={pointsInput}
            onChange={(e) => setPointsInput(e.target.value)}
            slotProps={{ input: { inputProps: { min: 1 } } }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAdd} sx={{ bgcolor: '#6A3F4D' }}>
            Add Points
          </Button>
        </DialogActions>
      </Dialog>

      {/* Redeem Points Dialog */}
      <Dialog open={redeemDialogOpen} onClose={() => setRedeemDialogOpen(false)}>
        <DialogTitle sx={{ fontWeight: 800, color: '#2D1F24' }}>Redeem Loyalty Points</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: '#6E5C63', mb: 2 }}>
            Available Points: <strong>{availablePoints}</strong> (100 Points = ₹100 discount).
          </Typography>
          <TextField
            fullWidth
            label="Points to Redeem"
            type="number"
            value={pointsInput}
            onChange={(e) => setPointsInput(e.target.value)}
            slotProps={{ input: { inputProps: { min: 100, max: availablePoints, step: 100 } } }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setRedeemDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleRedeem} sx={{ bgcolor: '#2E7D32' }}>
            Confirm Redemption
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};
