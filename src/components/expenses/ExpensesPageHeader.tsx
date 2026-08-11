import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import { useExpenses } from './ExpensesContext';
import { useDashboard } from '../../context/DashboardContext';

export const ExpensesPageHeader: React.FC = () => {
  const { setIsAddModalOpen, setEditingExpense } = useExpenses();
  const { showToast } = useDashboard();

  const handleOpenNewModal = () => {
    setEditingExpense(null);
    setIsAddModalOpen(true);
  };

  const handleExportCSV = () => {
    showToast('Exporting monthly expense log statement (CSV format)...');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 2,
        mb: 3,
      }}
    >
      <Box>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            color: '#2D1F24',
            fontFamily: '"Inter", sans-serif',
            fontSize: { xs: '1.5rem', sm: '1.85rem' },
          }}
        >
          Salon Operational Expenses
        </Typography>
        <Typography variant="body2" sx={{ color: '#6E5C63', mt: 0.5 }}>
          Track venue rent, utilities, beauty supplies restocking, maintenance costs, and staff welfare.
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={handleExportCSV}
          sx={{
            borderColor: '#A8828F',
            color: '#6A3F4D',
            fontWeight: 700,
            borderRadius: '10px',
            textTransform: 'none',
            px: 2,
            py: 1,
            '&:hover': { bgcolor: '#F8F4EE', borderColor: '#6A3F4D' },
          }}
        >
          Export CSV Log
        </Button>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenNewModal}
          sx={{
            bgcolor: '#6A3F4D',
            color: '#F8F4EE',
            fontWeight: 700,
            borderRadius: '10px',
            textTransform: 'none',
            px: 2.5,
            py: 1,
            boxShadow: '0 4px 12px rgba(107, 79, 58, 0.2)',
            '&:hover': { bgcolor: '#4A2B35' },
          }}
        >
          Log New Expense
        </Button>
      </Box>
    </Box>
  );
};
