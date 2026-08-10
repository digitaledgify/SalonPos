import React from 'react';
import {
  Box,
  Paper,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ToggleButtonGroup,
  ToggleButton,
  Chip,
  Button,
  Tabs,
  Tab,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
import FilterListIcon from '@mui/icons-material/FilterList';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import PeopleIcon from '@mui/icons-material/People';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SecurityIcon from '@mui/icons-material/Security';
import PercentIcon from '@mui/icons-material/Percent';
import { useEmployees } from './EmployeesContext';

export const EmployeesFilterBar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    filters,
    setFilters,
    roles,
    resetFilters,
  } = useEmployees();

  const isFiltered =
    filters.searchQuery !== '' ||
    filters.department !== 'All' ||
    filters.status !== 'All' ||
    filters.roleTitle !== 'All';

  const departments = ['All', 'Hair Care', 'Skin & Aesthetics', 'Grooming & Barber', 'Front Desk', 'Management'];
  const statuses = ['All', 'On Shift', 'Active', 'Off Duty', 'On Leave'];

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
      {/* Top Main Navigation Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: '#E8DFD5', mb: 2 }}>
        <Tabs
          value={activeTab}
          onChange={(_, newVal) => setActiveTab(newVal)}
          textColor="primary"
          indicatorColor="primary"
          sx={{
            minHeight: 44,
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '0.92rem',
              color: '#6E5C63',
              minHeight: 44,
              py: 1,
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
          <Tab icon={<PeopleIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Staff Directory" />
          <Tab icon={<CalendarMonthIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Shift Schedule & Roster" />
          <Tab icon={<SecurityIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Roles & Permissions" />
          <Tab icon={<PercentIcon sx={{ fontSize: 18 }} />} iconPosition="start" label="Commission & Payroll" />
        </Tabs>
      </Box>

      {/* Filter Controls (Only when in Staff Directory Tab: activeTab === 0) */}
      {activeTab === 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { xs: 'stretch', md: 'center' },
              justifyContent: 'space-between',
              gap: 2,
            }}
          >
            {/* Search Input */}
            <TextField
              size="small"
              placeholder="Search by staff name, role, email, phone..."
              value={filters.searchQuery}
              onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#6E5C63', fontSize: 20 }} />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{
                flexGrow: 1,
                maxWidth: { md: 380 },
                bgcolor: '#F8F4EE',
                borderRadius: '10px',
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  '& fieldset': { borderColor: '#E8DFD5' },
                  '&:hover fieldset': { borderColor: '#A8828F' },
                  '&.Mui-focused fieldset': { borderColor: '#6A3F4D' },
                },
              }}
            />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
              {/* Department Select */}
              <FormControl size="small" sx={{ minWidth: 160 }}>
                <InputLabel sx={{ color: '#6E5C63' }}>Department</InputLabel>
                <Select
                  value={filters.department}
                  label="Department"
                  onChange={(e) => setFilters((prev) => ({ ...prev, department: e.target.value }))}
                  sx={{
                    borderRadius: '10px',
                    bgcolor: '#F8F4EE',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    color: '#2D1F24',
                  }}
                >
                  {departments.map((dept) => (
                    <MenuItem key={dept} value={dept}>
                      {dept}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Role Title Select */}
              <FormControl size="small" sx={{ minWidth: 180 }}>
                <InputLabel sx={{ color: '#6E5C63' }}>Role Title</InputLabel>
                <Select
                  value={filters.roleTitle}
                  label="Role Title"
                  onChange={(e) => setFilters((prev) => ({ ...prev, roleTitle: e.target.value }))}
                  sx={{
                    borderRadius: '10px',
                    bgcolor: '#F8F4EE',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    color: '#2D1F24',
                  }}
                >
                  <MenuItem value="All">All Roles</MenuItem>
                  {roles.map((r) => (
                    <MenuItem key={r.id} value={r.title}>
                      {r.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* View Toggle */}
              <ToggleButtonGroup
                value={filters.viewMode}
                exclusive
                onChange={(_, nextView) => {
                  if (nextView) setFilters((prev) => ({ ...prev, viewMode: nextView }));
                }}
                size="small"
                sx={{
                  bgcolor: '#F8F4EE',
                  p: 0.5,
                  borderRadius: '10px',
                  border: '1px solid #E8DFD5',
                  '& .MuiToggleButton-root': {
                    border: 'none',
                    borderRadius: '8px',
                    px: 1.5,
                    py: 0.5,
                    color: '#6E5C63',
                    '&.Mui-selected': {
                      bgcolor: '#FFFFFF',
                      color: '#6A3F4D',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                    },
                  },
                }}
              >
                <ToggleButton value="grid" aria-label="grid view">
                  <GridViewIcon sx={{ fontSize: 18 }} />
                </ToggleButton>
                <ToggleButton value="table" aria-label="table view">
                  <ViewListIcon sx={{ fontSize: 18 }} />
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Box>

          {/* Quick Status Chips & Clear Filters */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#6E5C63', fontSize: '0.8rem', mr: 1, fontWeight: 700 }}>
                <FilterListIcon sx={{ fontSize: 16 }} />
                Status:
              </Box>
              {statuses.map((st) => {
                const isActive = filters.status === st;
                return (
                  <Chip
                    key={st}
                    label={st}
                    onClick={() => setFilters((prev) => ({ ...prev, status: st }))}
                    sx={{
                      fontWeight: isActive ? 800 : 600,
                      fontSize: '0.78rem',
                      bgcolor: isActive ? '#6A3F4D' : '#F8F4EE',
                      color: isActive ? '#F8F4EE' : '#6A3F4D',
                      border: '1px solid',
                      borderColor: isActive ? '#6A3F4D' : '#E8DFD5',
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: isActive ? '#4A2B35' : '#F5EFE6',
                      },
                    }}
                  />
                );
              })}
            </Box>

            {isFiltered && (
              <Button
                size="small"
                startIcon={<RestartAltIcon />}
                onClick={resetFilters}
                sx={{
                  color: '#C62828',
                  textTransform: 'none',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                }}
              >
                Reset Filters
              </Button>
            )}
          </Box>
        </Box>
      )}
    </Paper>
  );
};
