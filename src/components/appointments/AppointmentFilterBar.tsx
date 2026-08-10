import React from 'react';
import {
  Box,
  Paper,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  MenuItem,
  IconButton,
  Tooltip,
  Typography,
  Badge,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import { AppointmentStatus } from '../../types';
import { useDashboard } from '../../context/DashboardContext';

interface Props {
  search: string;
  setSearch: (val: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  selectedStylist: string;
  setSelectedStylist: (stylist: string) => void;
  selectedTimeSlot: string;
  setSelectedTimeSlot: (slot: string) => void;
  onClearFilters: () => void;
}

const TIME_SLOTS = [
  'All Slots',
  '10:00 AM - 12:00 PM',
  '12:00 PM - 03:00 PM',
  '03:00 PM - 06:00 PM',
  '06:00 PM - 09:00 PM',
];

export const AppointmentFilterBar: React.FC<Props> = ({
  search,
  setSearch,
  selectedStatus,
  setSelectedStatus,
  selectedStylist,
  setSelectedStylist,
  selectedTimeSlot,
  setSelectedTimeSlot,
  onClearFilters,
}) => {
  const { stylists, appointments } = useDashboard();

  const isFiltered =
    search.trim() !== '' ||
    selectedStatus !== 'All' ||
    selectedStylist !== 'All' ||
    selectedTimeSlot !== 'All Slots';

  const getStatusCount = (status: string) => {
    if (status === 'All') return appointments.length;
    return appointments.filter((a) => a.status === status).length;
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        mb: 3,
        borderRadius: '16px',
        bgcolor: '#FFFFFF',
        border: '1px solid #E8DFD5',
        boxShadow: '0 2px 10px rgba(107, 79, 58, 0.04)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 2,
          alignItems: { xs: 'stretch', md: 'center' },
          justifyContent: 'space-between',
        }}
      >
        {/* Search Input */}
        <Box sx={{ flexGrow: 1, maxWidth: { md: 360 } }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search by customer, phone, or service..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#6E5C63', fontSize: 20 }} />
                  </InputAdornment>
                ),
                endAdornment: search && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearch('')}>
                      <ClearIcon sx={{ fontSize: 16, color: '#6E5C63' }} />
                    </IconButton>
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: '10px',
                  bgcolor: '#F8F4EE',
                  fontSize: '0.88rem',
                  '& fieldset': { borderColor: '#E8DFD5' },
                  '&:hover fieldset': { borderColor: '#A8828F' },
                  '&.Mui-focused fieldset': { borderColor: '#6A3F4D' },
                },
              },
            }}
          />
        </Box>

        {/* Dropdown Filters: Stylist & Time Slot */}
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          {/* Stylist Filter */}
          <TextField
            select
            size="small"
            value={selectedStylist}
            onChange={(e) => setSelectedStylist(e.target.value)}
            sx={{
              minWidth: 160,
              bgcolor: '#F8F4EE',
              borderRadius: '10px',
              '& fieldset': { borderColor: '#E8DFD5' },
              '& .MuiSelect-select': { fontSize: '0.85rem', fontWeight: 700, color: '#2D1F24' },
            }}
          >
            <MenuItem value="All">All Stylists</MenuItem>
            {stylists.map((s) => (
              <MenuItem key={s.id} value={s.name}>
                {s.name}
              </MenuItem>
            ))}
          </TextField>

          {/* Time Slot Filter */}
          <TextField
            select
            size="small"
            value={selectedTimeSlot}
            onChange={(e) => setSelectedTimeSlot(e.target.value)}
            sx={{
              minWidth: 170,
              bgcolor: '#F8F4EE',
              borderRadius: '10px',
              '& fieldset': { borderColor: '#E8DFD5' },
              '& .MuiSelect-select': { fontSize: '0.85rem', fontWeight: 700, color: '#2D1F24' },
            }}
          >
            {TIME_SLOTS.map((slot) => (
              <MenuItem key={slot} value={slot}>
                {slot}
              </MenuItem>
            ))}
          </TextField>

          {isFiltered && (
            <Tooltip title="Reset all filters">
              <IconButton
                onClick={onClearFilters}
                sx={{
                  bgcolor: '#F8F4EE',
                  border: '1px solid #E8DFD5',
                  color: '#6A3F4D',
                  borderRadius: '10px',
                  '&:hover': { bgcolor: '#E8DFD5' },
                }}
              >
                <ClearIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>

      {/* Tabs Filter Bar for Statuses */}
      <Box sx={{ borderBottom: '1px solid #E8DFD5', mt: 2.5 }}>
        <Tabs
          value={selectedStatus}
          onChange={(_, val) => setSelectedStatus(val)}
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
                fontWeight: 800,
              },
            },
            '& .MuiTabs-indicator': {
              backgroundColor: '#6A3F4D',
              height: 3,
              borderRadius: '3px 3px 0 0',
            },
          }}
        >
          {['All', 'Booked', 'Checked In', 'Completed', 'Cancelled'].map((status) => {
            const count = getStatusCount(status);
            return (
              <Tab
                key={status}
                value={status}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                    <span>{status === 'All' ? 'All Bookings' : status}</span>
                    <Badge
                      badgeContent={count}
                      color={
                        status === 'Checked In'
                          ? 'info'
                          : status === 'Completed'
                          ? 'success'
                          : status === 'Cancelled'
                          ? 'error'
                          : 'default'
                      }
                      sx={{
                        '& .MuiBadge-badge': {
                          fontSize: '0.65rem',
                          fontWeight: 800,
                          height: 18,
                          minWidth: 18,
                          px: 0.5,
                        },
                      }}
                    />
                  </Box>
                }
              />
            );
          })}
        </Tabs>
      </Box>
    </Paper>
  );
};
