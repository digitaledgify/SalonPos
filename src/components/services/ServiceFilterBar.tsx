import React from 'react';
import {
  Box,
  Paper,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  FormControl,
  Select,
  MenuItem,
  ToggleButtonGroup,
  ToggleButton,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
import ClearIcon from '@mui/icons-material/Clear';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { useServices } from '../../context/ServiceContext';

const CATEGORIES = [
  'All',
  'Hair Care & Cut',
  'Skin & Facials',
  'Beard & Grooming',
  'Nails & Beauty',
  'Spa & Relaxation',
  'Makeup & Bridal',
  'Combo Packages',
];

export const ServiceFilterBar: React.FC = () => {
  const { filters, setFilters, resetFilters, filteredServices, services } = useServices();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, searchQuery: e.target.value }));
  };

  const handleCategoryChange = (_: React.SyntheticEvent, newValue: string) => {
    setFilters((prev) => ({ ...prev, category: newValue }));
  };

  const handleGenderChange = (e: any) => {
    setFilters((prev) => ({ ...prev, gender: e.target.value }));
  };

  const handleStatusChange = (e: any) => {
    setFilters((prev) => ({ ...prev, status: e.target.value }));
  };

  const handleSortChange = (e: any) => {
    setFilters((prev) => ({ ...prev, sortBy: e.target.value }));
  };

  const handleViewModeChange = (_: any, newMode: 'grid' | 'table' | null) => {
    if (newMode) {
      setFilters((prev) => ({ ...prev, viewMode: newMode }));
    }
  };

  const hasActiveFilters =
    filters.searchQuery ||
    filters.category !== 'All' ||
    filters.gender !== 'All' ||
    filters.status !== 'All' ||
    filters.sortBy !== 'Popularity';

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: '16px',
        bgcolor: '#FFFFFF',
        border: '1px solid #E8DFD5',
        mb: 3,
        boxShadow: '0 2px 8px rgba(107, 79, 58, 0.04)',
      }}
    >
      {/* Top Search & Controls Row */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 2,
          alignItems: { xs: 'stretch', md: 'center' },
          justifyContent: 'space-between',
          mb: 2,
        }}
      >
        {/* Search Input */}
        <TextField
          value={filters.searchQuery}
          onChange={handleSearchChange}
          placeholder="Search by service name, code (HC-101), category..."
          size="small"
          sx={{
            flexGrow: 1,
            maxWidth: { md: 400 },
            '& .MuiOutlinedInput-root': {
              borderRadius: '10px',
              bgcolor: '#F8F4EE',
              fontSize: '0.9rem',
              '& fieldset': { borderColor: '#E8DFD5' },
              '&:hover fieldset': { borderColor: '#A8828F' },
              '&.Mui-focused fieldset': { borderColor: '#6A3F4D' },
            },
          }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#6E5C63', fontSize: 20 }} />
                </InputAdornment>
              ),
              endAdornment: filters.searchQuery ? (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setFilters((p) => ({ ...p, searchQuery: '' }))}>
                    <ClearIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </InputAdornment>
              ) : null,
            },
          }}
        />

        {/* Filters Group: Gender, Status, Sort, View Switcher */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          {/* Gender Filter */}
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              value={filters.gender}
              onChange={handleGenderChange}
              displayEmpty
              sx={{
                borderRadius: '10px',
                bgcolor: '#F8F4EE',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: '#6A3F4D',
                '& .MuiSelect-select': { py: 0.9 },
                '& fieldset': { borderColor: '#E8DFD5' },
              }}
            >
              <MenuItem value="All">All Genders</MenuItem>
              <MenuItem value="Unisex">✨ Unisex</MenuItem>
              <MenuItem value="Female">👩 Women Only</MenuItem>
              <MenuItem value="Male">👨 Men Only</MenuItem>
            </Select>
          </FormControl>

          {/* Status Filter */}
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              value={filters.status}
              onChange={handleStatusChange}
              displayEmpty
              sx={{
                borderRadius: '10px',
                bgcolor: '#F8F4EE',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: '#6A3F4D',
                '& .MuiSelect-select': { py: 0.9 },
                '& fieldset': { borderColor: '#E8DFD5' },
              }}
            >
              <MenuItem value="All">All Status</MenuItem>
              <MenuItem value="Active">🟢 Active</MenuItem>
              <MenuItem value="Inactive">🔴 Inactive</MenuItem>
              <MenuItem value="Seasonal">🍂 Seasonal</MenuItem>
            </Select>
          </FormControl>

          {/* Sort By Dropdown */}
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <Select
              value={filters.sortBy}
              onChange={handleSortChange}
              sx={{
                borderRadius: '10px',
                bgcolor: '#F8F4EE',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: '#6A3F4D',
                '& .MuiSelect-select': { py: 0.9 },
                '& fieldset': { borderColor: '#E8DFD5' },
              }}
            >
              <MenuItem value="Popularity">Sort: Popularity</MenuItem>
              <MenuItem value="Price: Low to High">Price: Low to High</MenuItem>
              <MenuItem value="Price: High to Low">Price: High to Low</MenuItem>
              <MenuItem value="Duration">Duration (Shortest)</MenuItem>
              <MenuItem value="Name">Name (A-Z)</MenuItem>
            </Select>
          </FormControl>

          {/* View Mode Toggle */}
          <ToggleButtonGroup
            value={filters.viewMode}
            exclusive
            onChange={handleViewModeChange}
            size="small"
            sx={{
              bgcolor: '#F8F4EE',
              borderRadius: '10px',
              p: 0.3,
              border: '1px solid #E8DFD5',
              '& .MuiToggleButton-root': {
                border: 'none',
                borderRadius: '8px',
                px: 1.5,
                py: 0.5,
                color: '#6E5C63',
                '&.Mui-selected': {
                  bgcolor: '#6A3F4D',
                  color: '#EBD9DF',
                  '&:hover': { bgcolor: '#523B2A' },
                },
              },
            }}
          >
            <ToggleButton value="grid">
              <Tooltip title="Card Grid View">
                <GridViewIcon sx={{ fontSize: 18 }} />
              </Tooltip>
            </ToggleButton>
            <ToggleButton value="table">
              <Tooltip title="Table List View">
                <ViewListIcon sx={{ fontSize: 18 }} />
              </Tooltip>
            </ToggleButton>
          </ToggleButtonGroup>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <Tooltip title="Reset all search and filters">
              <Chip
                icon={<FilterAltIcon sx={{ fontSize: 14 }} />}
                label="Clear Filters"
                onDelete={resetFilters}
                size="small"
                sx={{
                  bgcolor: '#EBD9DF',
                  color: '#6A3F4D',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  borderRadius: '8px',
                  '& .MuiChip-deleteIcon': { color: '#6A3F4D' },
                }}
              />
            </Tooltip>
          )}
        </Box>
      </Box>

      {/* Category Tabs Row */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={filters.category}
          onChange={handleCategoryChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            minHeight: 40,
            '& .MuiTab-root': {
              minHeight: 40,
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '0.85rem',
              color: '#6E5C63',
              px: 2,
              '&.Mui-selected': {
                color: '#6A3F4D',
              },
            },
            '& .MuiTabs-indicator': {
              bgcolor: '#6A3F4D',
              height: 3,
              borderRadius: '3px 3px 0 0',
            },
          }}
        >
          {CATEGORIES.map((cat) => {
            const count =
              cat === 'All'
                ? services.length
                : services.filter((s) => s.category === cat).length;
            return (
              <Tab
                key={cat}
                label={`${cat} (${count})`}
                value={cat}
                sx={{ py: 1 }}
              />
            );
          })}
        </Tabs>
      </Box>

      {/* Results Count Bar */}
      <Box sx={{ pt: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Chip
          label={`Showing ${filteredServices.length} of ${services.length} services`}
          size="small"
          sx={{
            bgcolor: '#F8F4EE',
            color: '#6A3F4D',
            fontWeight: 700,
            fontSize: '0.75rem',
            border: '1px solid #E8DFD5',
          }}
        />
      </Box>
    </Paper>
  );
};
