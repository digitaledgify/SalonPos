import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
} from '@mui/material';
import { useExpenses } from './ExpensesContext';

export const ReceiptViewerModal: React.FC = () => {
  const { viewingReceiptUrl, setViewingReceiptUrl } = useExpenses();

  if (!viewingReceiptUrl) return null;

  return (
    <Dialog
      open={Boolean(viewingReceiptUrl)}
      onClose={() => setViewingReceiptUrl(null)}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: { borderRadius: '16px', overflow: 'hidden' },
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 800, color: '#2D1F24', fontFamily: '"Inter", sans-serif' }}>
        Uploaded Invoice & Receipt Document
      </DialogTitle>

      <DialogContent dividers sx={{ textAlign: 'center', bgcolor: '#F8F4EE', p: 3 }}>
        <Box
          component="img"
          src={viewingReceiptUrl}
          alt="Expense Receipt"
          sx={{
            maxWidth: '100%',
            maxHeight: 450,
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            objectFit: 'contain',
          }}
        />
        <Typography variant="caption" sx={{ color: '#6E5C63', display: 'block', mt: 2 }}>
          Document image verified by manager.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={() => setViewingReceiptUrl(null)}
          variant="contained"
          sx={{ bgcolor: '#6A3F4D', color: '#F8F4EE', fontWeight: 700, borderRadius: '8px' }}
        >
          Close Preview
        </Button>
      </DialogActions>
    </Dialog>
  );
};
