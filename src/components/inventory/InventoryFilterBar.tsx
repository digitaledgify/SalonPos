import React from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  ToggleButtonGroup,
  ToggleButton,
  Chip,
  Stack,
  Paper,
  Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TableRowsIcon from '@mui/icons-material/TableRows';
import GridViewIcon from '@mui/icons-material/GridView';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import SortIcon from '@mui/icons-material/Sort';
import { useInventory } from './InventoryContext';

export const InventoryFilterBar: React.FC = () => {
  const { filters, setFilters, categories, suppliers } = useInventory();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, search: e.target.value }));
  };

  const handleCategoryChange = (e: any) => {
    setFilters((prev) => ({ ...prev, category: e.target.value }));
  };

  const handleSupplierChange = (e: any) => {
    setFilters((prev) => ({ ...prev, supplier: e.target.value }));
  };

  const handleStatusChange = (status: 'All' | 'Optimal' | 'Low' | 'Critical') => {
    setFilters((prev) => ({ ...prev, status }));
  };

  const handleSortByChange = (e: any) => {
    setFilters((prev) => ({ ...prev, sortBy: e.target.value }));
  };

  const handleViewModeChange = (
    _event: React.MouseEvent<HTMLElement>,
    nextView: 'table' | 'grid' | null
  ) => {
    if (nextView !== null) {
      setFilters((prev) => ({ ...prev, viewMode: nextView }));
    }
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      category: 'All',
      status: 'All',
      supplier: 'All',
      sortBy: 'status',
      sortOrder: 'asc',
      viewMode: 'table',
    });
  };

  const isFiltered =
    filters.search !== '' ||
    filters.category !== 'All' ||
    filters.status !== 'All' ||
    filters.supplier !== 'All';

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
      <Stack spacing={2}>
        {/* Top Row: Search, Category, Supplier, Sort, View Switcher */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', lg: 'row' },
            gap: 2,
            alignItems: { xs: 'stretch', lg: 'center' },
            justifyContent: 'space-between',
          }}
        >
          {/* Search Box */}
          <TextField
            placeholder="Search by product name, category, supplier..."
            value={filters.search}
            onChange={handleSearchChange}
            size="small"
            sx={{
              flexGrow: 1,
              maxWidth: { lg: 380 },
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px',
                bgcolor: '#F8F4EE',
                '& fieldset': { borderColor: '#E8DFD5' },
                '&:hover fieldset': { borderColor: '#6A3F4D' },
                '&.Mui-focused fieldset': { borderColor: '#6A3F4D' },
              },
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#6E5C63' }} />
                  </InputAdornment>
                ),
              },
            }}
          />

          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Category Select */}
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel sx={{ color: '#6E5C63' }}>Category</InputLabel>
              <Select
                value={filters.category}
                label="Category"
                onChange={handleCategoryChange}
                sx={{
                  borderRadius: '10px',
                  bgcolor: '#F8F4EE',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E8DFD5' },
                }}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Supplier Select */}
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel sx={{ color: '#6E5C63' }}>Supplier</InputLabel>
              <Select
                value={filters.supplier}
                label="Supplier"
                onChange={handleSupplierChange}
                sx={{
                  borderRadius: '10px',
                  bgcolor: '#F8F4EE',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E8DFD5' },
                }}
              >
                {suppliers.map((sup) => (
                  <MenuItem key={sup} value={sup}>
                    {sup}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Sort Select */}
            <FormControl size="small" sx={{ minWidth: 160 }}>
              <InputLabel sx={{ color: '#6E5C63' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <SortIcon sx={{ fontSize: 16 }} />
                  <span>Sort By</span>
                </Box>
              </InputLabel>
              <Select
                value={filters.sortBy}
                label="Sort By"
                onChange={handleSortByChange}
                sx={{
                  borderRadius: '10px',
                  bgcolor: '#F8F4EE',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#E8DFD5' },
                }}
              >
                <MenuItem value="status">Status Alert Level</MenuItem>
                <MenuItem value="itemName">Product Name (A-Z)</MenuItem>
                <MenuItem value="remainingQty">Stock Qty</MenuItem>
                <MenuItem value="unitPrice">Unit Price (₹)</MenuItem>
                <MenuItem value="totalValuation">Total Value (₹)</MenuItem>
              </Select>
            </FormControl>

            {/* View Mode Switcher */}
            <ToggleButtonGroup
              value={filters.viewMode}
              exclusive
              onChange={handleViewModeChange}
              size="small"
              sx={{
                bgcolor: '#F8F4EE',
                borderRadius: '10px',
                p: 0.5,
                border: '1px solid #E8DFD5',
                '& .MuiToggleButton-root': {
                  borderRadius: '8px',
                  border: 'none',
                  px: 1.5,
                  py: 0.5,
                  color: '#6E5C63',
                  '&.Mui-selected': {
                    bgcolor: '#6A3F4D',
                    color: '#F8F4EE',
                    '&:hover': { bgcolor: '#543D2D' },
                  },
                },
              }}
            >
              <ToggleButton value="table" aria-label="Table View">
                <TableRowsIcon sx={{ fontSize: 18 }} />
              </ToggleButton>
              <ToggleButton value="grid" aria-label="Grid View">
                <GridViewIcon sx={{ fontSize: 18 }} />
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>

        {/* Bottom Row: Status Quick Chips & Reset Button */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {(['All', 'Critical', 'Low', 'Optimal'] as const).map((st) => {
              const isActive = filters.status === st;
              let chipBg = '#F8F4EE';
              let chipColor = '#6A3F4D';
              let chipBorder = '#E8DFD5';

              if (st === 'Critical') {
                chipBg = isActive ? '#D32F2F' : '#FFF5F5';
                chipColor = isActive ? '#FFFFFF' : '#D32F2F';
                chipBorder = '#FFCDD2';
              } else if (st === 'Low') {
                chipBg = isActive ? '#ED6C02' : '#FFF8F0';
                chipColor = isActive ? '#FFFFFF' : '#ED6C02';
                chipBorder = '#FFE0B2';
              } else if (st === 'Optimal') {
                chipBg = isActive ? '#2E7D32' : '#F2F9F2';
                chipColor = isActive ? '#FFFFFF' : '#2E7D32';
                chipBorder = '#C8E6C9';
              } else if (st === 'All' && isActive) {
                chipBg = '#6A3F4D';
                chipColor = '#FFFFFF';
                chipBorder = '#6A3F4D';
              }

              return (
                <Chip
                  key={st}
                  label={st === 'All' ? 'All Items' : st}
                  onClick={() => handleStatusChange(st)}
                  sx={{
                    bgcolor: chipBg,
                    color: chipColor,
                    border: `1px solid ${chipBorder}`,
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    '&:hover': { opacity: 0.9 },
                  }}
                />
              );
            })}
          </Box>

          {isFiltered && (
            <Button
              size="small"
              startIcon={<FilterAltOffIcon />}
              onClick={resetFilters}
              sx={{
                color: '#6E5C63',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': { bgcolor: '#F8F4EE' },
              }}
            >
              Clear Filters
            </Button>
          )}
        </Box>
      </Stack>
    </Paper>
  );
};
