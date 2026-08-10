import React from 'react';
import {
  Paper,
  Box,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import { ExpenseCategory, PaymentMethod, ExpenseStatus } from '../../types/expense';
import { useExpenses } from './ExpensesContext';

export const ExpensesFilterBar: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedMethod,
    setSelectedMethod,
    selectedStatus,
    setSelectedStatus,
  } = useExpenses();

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All Categories');
    setSelectedMethod('All Methods');
    setSelectedStatus('All Statuses');
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedCategory !== 'All Categories' ||
    selectedMethod !== 'All Methods' ||
    selectedStatus !== 'All Statuses';

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        mb: 3,
        borderRadius: '16px',
        bgcolor: '#FFFFFF',
        border: '1px solid #E8DFD5',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        {/* Search */}
        <Box sx={{ flexGrow: 1, minWidth: { xs: '100%', sm: 260 } }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search by expense title, vendor name or notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#6E5C63' }} />
                  </InputAdornment>
                ),
                sx: { borderRadius: '10px', bgcolor: '#F8F4EE' },
              },
            }}
          />
        </Box>

        {/* Category Filter */}
        <FormControl size="small" sx={{ minWidth: 190, flexGrow: { xs: 1, sm: 0 } }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory}
            label="Category"
            onChange={(e) => setSelectedCategory(e.target.value as ExpenseCategory | 'All Categories')}
            sx={{ borderRadius: '10px', bgcolor: '#F8F4EE' }}
          >
            <MenuItem value="All Categories">All Categories</MenuItem>
            <MenuItem value="Utilities & Rent">Utilities & Rent</MenuItem>
            <MenuItem value="Salon Supplies">Salon Supplies</MenuItem>
            <MenuItem value="Staff Welfare & Refreshments">Staff Welfare & Refreshments</MenuItem>
            <MenuItem value="Maintenance & Repairs">Maintenance & Repairs</MenuItem>
            <MenuItem value="Marketing & Ads">Marketing & Ads</MenuItem>
            <MenuItem value="Software & Tech">Software & Tech</MenuItem>
            <MenuItem value="Miscellaneous">Miscellaneous</MenuItem>
          </Select>
        </FormControl>

        {/* Payment Method Filter */}
        <FormControl size="small" sx={{ minWidth: 160, flexGrow: { xs: 1, sm: 0 } }}>
          <InputLabel>Payment Mode</InputLabel>
          <Select
            value={selectedMethod}
            label="Payment Mode"
            onChange={(e) => setSelectedMethod(e.target.value as PaymentMethod | 'All Methods')}
            sx={{ borderRadius: '10px', bgcolor: '#F8F4EE' }}
          >
            <MenuItem value="All Methods">All Payment Modes</MenuItem>
            <MenuItem value="UPI / GPay">UPI / GPay</MenuItem>
            <MenuItem value="Cash">Cash</MenuItem>
            <MenuItem value="Credit Card">Credit Card</MenuItem>
            <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
          </Select>
        </FormControl>

        {/* Approval Status Filter */}
        <FormControl size="small" sx={{ minWidth: 160, flexGrow: { xs: 1, sm: 0 } }}>
          <InputLabel>Approval Status</InputLabel>
          <Select
            value={selectedStatus}
            label="Approval Status"
            onChange={(e) => setSelectedStatus(e.target.value as ExpenseStatus | 'All Statuses')}
            sx={{ borderRadius: '10px', bgcolor: '#F8F4EE' }}
          >
            <MenuItem value="All Statuses">All Statuses</MenuItem>
            <MenuItem value="Approved">Approved</MenuItem>
            <MenuItem value="Pending Approval">Pending Approval</MenuItem>
            <MenuItem value="Reimbursed">Reimbursed</MenuItem>
          </Select>
        </FormControl>

        {/* Reset Filters */}
        {hasActiveFilters && (
          <Button
            variant="text"
            startIcon={<FilterAltOffIcon />}
            onClick={handleResetFilters}
            sx={{ color: '#6E5C63', textTransform: 'none', fontWeight: 700 }}
          >
            Reset
          </Button>
        )}
      </Box>
    </Paper>
  );
};
