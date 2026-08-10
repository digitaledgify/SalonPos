import React from 'react';
import { Box, TextField, InputAdornment, Chip, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { useCustomers } from '../../context/CustomerContext';

export const SearchBar: React.FC = () => {
  const { filters, setFilters } = useCustomers();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({ ...prev, searchQuery: e.target.value }));
  };

  const handleClear = () => {
    setFilters((prev) => ({ ...prev, searchQuery: '' }));
  };

  return (
    <Box sx={{ width: '100%' }}>
      <TextField
        fullWidth
        value={filters.searchQuery}
        onChange={handleSearchChange}
        placeholder="Search by Name, Phone, Email, Customer ID, or Membership..."
        variant="outlined"
        size="small"
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#6A3F4D' }} />
              </InputAdornment>
            ),
            endAdornment: filters.searchQuery ? (
              <InputAdornment position="end">
                <ClearIcon
                  onClick={handleClear}
                  sx={{ color: '#6E5C63', cursor: 'pointer', fontSize: 18 }}
                />
              </InputAdornment>
            ) : null,
            sx: {
              borderRadius: '12px',
              bgcolor: '#FFFFFF',
              borderColor: '#E8DFD5',
              height: 44,
              fontSize: '0.92rem',
              '& fieldset': {
                borderColor: '#E8DFD5 !important',
              },
              '&:hover fieldset': {
                borderColor: '#A8828F !important',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#6A3F4D !important',
              },
            },
          },
        }}
      />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1, px: 0.5 }}>
        <Typography variant="caption" sx={{ color: '#6E5C63', fontWeight: 600 }}>
          Search fields:
        </Typography>
        <Box sx={{ display: 'flex', gap: 0.8, flexWrap: 'wrap' }}>
          {['Name', 'Phone', 'Email', 'Membership'].map((tag) => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              sx={{
                height: 20,
                fontSize: '0.68rem',
                fontWeight: 600,
                bgcolor: '#F8F4EE',
                color: '#6A3F4D',
                border: '1px solid #E8DFD5',
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};
