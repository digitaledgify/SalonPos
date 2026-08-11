import React from 'react';
import { Box, Button, Chip, Typography } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PercentIcon from '@mui/icons-material/Percent';
import BadgeIcon from '@mui/icons-material/Badge';
import { useEmployees } from './EmployeesContext';

export const EmployeesPageHeader: React.FC = () => {
  const { employees, setIsAddEditModalOpen, setEditingEmployee, setActiveTab } = useEmployees();

  const activeCount = employees.filter((e) => e.status === 'Active' || e.status === 'On Shift').length;

  const handleOpenAddModal = () => {
    setEditingEmployee(null);
    setIsAddEditModalOpen(true);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', md: 'center' },
        gap: 2,
        mb: 3,
      }}
    >
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              fontSize: { xs: '1.5rem', sm: '1.85rem' },
              color: '#2D1F24',
              fontFamily: '"Inter", sans-serif',
              letterSpacing: '-0.01em',
            }}
          >
            Staff & Employee Management
          </Typography>
          <Chip
            icon={<BadgeIcon sx={{ fontSize: '16px !important', color: '#6A3F4D !important' }} />}
            label={`${activeCount} Active / ${employees.length} Total`}
            sx={{
              bgcolor: '#EBD9DF',
              color: '#6A3F4D',
              fontWeight: 700,
              fontSize: '0.75rem',
              height: 28,
            }}
          />
        </Box>
        <Typography variant="body2" sx={{ color: '#6E5C63' }}>
          Track salon team profiles, role hierarchy, weekly shift schedules, and commission performance.
        </Typography>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', width: { xs: '100%', sm: 'auto' } }}>
        <Button
          variant="outlined"
          startIcon={<CalendarMonthIcon />}
          onClick={() => setActiveTab(1)}
          sx={{
            borderColor: '#A8828F',
            color: '#6A3F4D',
            textTransform: 'none',
            fontWeight: 700,
            borderRadius: '10px',
            px: 2,
            py: 1,
            '&:hover': {
              bgcolor: '#F8F4EE',
              borderColor: '#6A3F4D',
            },
          }}
        >
          Shift Roster
        </Button>

        <Button
          variant="outlined"
          startIcon={<PercentIcon />}
          onClick={() => setActiveTab(3)}
          sx={{
            borderColor: '#A8828F',
            color: '#6A3F4D',
            textTransform: 'none',
            fontWeight: 700,
            borderRadius: '10px',
            px: 2,
            py: 1,
            '&:hover': {
              bgcolor: '#F8F4EE',
              borderColor: '#6A3F4D',
            },
          }}
        >
          Commission Rates
        </Button>

        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          onClick={handleOpenAddModal}
          sx={{
            bgcolor: '#6A3F4D',
            color: '#F8F4EE',
            textTransform: 'none',
            fontWeight: 700,
            borderRadius: '10px',
            px: 2.5,
            py: 1,
            boxShadow: '0 4px 12px rgba(107, 79, 58, 0.2)',
            '&:hover': {
              bgcolor: '#4A2B35',
            },
          }}
        >
          Add Staff Member
        </Button>
      </Box>
    </Box>
  );
};
