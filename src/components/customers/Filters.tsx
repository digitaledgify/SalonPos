import React from 'react';
import { Box, Button, Select, MenuItem, FormControl, InputLabel, Typography } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import { useCustomers } from '../../context/CustomerContext';
import { MembershipTier } from '../../types/customer';

export const Filters: React.FC = () => {
  const { filters, setFilters, customers } = useCustomers();

  const membershipTiers: ('All' | MembershipTier)[] = ['All', 'Normal', 'Silver', 'Gold', 'Platinum'];
  const sortOptions = ['Newest', 'Oldest', 'Highest Spending', 'Most Visits'] as const;

  const handleMembershipClick = (tier: 'All' | MembershipTier) => {
    setFilters((prev) => ({ ...prev, membership: tier }));
  };

  const handleSortChange = (e: any) => {
    setFilters((prev) => ({ ...prev, sortBy: e.target.value }));
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'stretch', md: 'center' },
        gap: 2,
        my: 2.5,
        p: 2,
        bgcolor: '#FFFFFF',
        borderRadius: '14px',
        border: '1px solid #E8DFD5',
      }}
    >
      {/* Membership Tabs */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, overflowX: 'auto', pb: { xs: 1, md: 0 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#6A3F4D', mr: 1 }}>
          <FilterListIcon sx={{ fontSize: 18 }} />
          <Typography variant="body2" sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>
            Tier:
          </Typography>
        </Box>
        {membershipTiers.map((tier) => {
          const isSelected = filters.membership === tier;
          return (
            <Button
              key={tier}
              size="small"
              onClick={() => handleMembershipClick(tier)}
              sx={{
                borderRadius: '20px',
                px: 2,
                py: 0.5,
                fontSize: '0.82rem',
                fontWeight: 700,
                textTransform: 'none',
                whiteSpace: 'nowrap',
                bgcolor: isSelected ? '#6A3F4D' : '#F8F4EE',
                color: isSelected ? '#FFFFFF' : '#6A3F4D',
                border: isSelected ? '1px solid #6A3F4D' : '1px solid #E8DFD5',
                '&:hover': {
                  bgcolor: isSelected ? '#4A2B35' : '#E8DFD5',
                },
              }}
            >
              {tier === 'All' ? 'All Customers' : `${tier}`}
            </Button>
          );
        })}
      </Box>

      {/* Right Side: Sort dropdown & results counter */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'space-between' }}>
        <Typography variant="caption" sx={{ color: '#6E5C63', fontWeight: 600, whiteSpace: 'nowrap' }}>
          Showing <strong>{customers.length}</strong> customer{customers.length === 1 ? '' : 's'}
        </Typography>

        <FormControl size="small" sx={{ minWidth: 170 }}>
          <InputLabel id="sort-select-label" sx={{ color: '#6A3F4D', fontSize: '0.85rem' }}>
            Sort By
          </InputLabel>
          <Select
            labelId="sort-select-label"
            value={filters.sortBy}
            label="Sort By"
            onChange={handleSortChange}
            startAdornment={<SortIcon sx={{ fontSize: 18, mr: 1, color: '#6A3F4D' }} />}
            sx={{
              borderRadius: '10px',
              bgcolor: '#F8F4EE',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: '#2D1F24',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#E8DFD5',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#A8828F',
              },
            }}
          >
            {sortOptions.map((opt) => (
              <MenuItem key={opt} value={opt} sx={{ fontSize: '0.85rem', fontWeight: 600 }}>
                {opt}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
};
