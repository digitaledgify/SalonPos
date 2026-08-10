import React from 'react';
import {
  Box,
  Typography,
  Button,
  Chip,
  ToggleButtonGroup,
  ToggleButton,
  Tooltip,
  Paper,
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AddIcon from '@mui/icons-material/Add';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import ViewWeekIcon from '@mui/icons-material/ViewWeek';
import ViewListIcon from '@mui/icons-material/ViewList';
import TodayIcon from '@mui/icons-material/Today';
import EventIcon from '@mui/icons-material/Event';
import DownloadIcon from '@mui/icons-material/Download';
import { useDashboard } from '../../context/DashboardContext';

interface Props {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  viewMode: 'timeline' | 'table';
  setViewMode: (mode: 'timeline' | 'table') => void;
  onOpenWalkIn: () => void;
}

export const AppointmentPageHeader: React.FC<Props> = ({
  selectedDate,
  setSelectedDate,
  viewMode,
  setViewMode,
  onOpenWalkIn,
}) => {
  const { setIsNewAppointmentOpen, showToast } = useDashboard();

  const handleExport = () => {
    showToast('Exporting todays appointment schedule to PDF...');
  };

  return (
    <Box sx={{ mb: 3 }}>
      {/* Top Title & Primary Actions Row */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
          gap: 2,
          mb: 2.5,
        }}
      >
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '12px',
                bgcolor: '#6A3F4D',
                color: '#EBD9DF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(107, 79, 58, 0.2)',
              }}
            >
              <CalendarMonthIcon sx={{ fontSize: 24 }} />
            </Box>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 800,
                    color: '#2D1F24',
                    fontFamily: '"Playfair Display", serif',
                    fontSize: { xs: '1.5rem', sm: '1.85rem' },
                    letterSpacing: '-0.01em',
                  }}
                >
                  Appointments & Chair Schedule
                </Typography>
                <Chip
                  label="Live Monitor"
                  size="small"
                  sx={{
                    bgcolor: '#2E7D32',
                    color: '#FFFFFF',
                    fontWeight: 800,
                    fontSize: '0.68rem',
                    height: 22,
                  }}
                />
              </Box>
              <Typography variant="body2" sx={{ color: '#6E5C63', fontWeight: 500, mt: 0.2 }}>
                Real-time booking matrix, chair allocations, stylist schedules, and client check-in control.
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Primary Action Buttons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            startIcon={<FlashOnIcon sx={{ color: '#A8828F' }} />}
            onClick={onOpenWalkIn}
            sx={{
              borderColor: '#A8828F',
              color: '#6A3F4D',
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: 800,
              fontSize: '0.85rem',
              py: 1,
              px: 2,
              bgcolor: '#FFFFFF',
              '&:hover': {
                borderColor: '#6A3F4D',
                bgcolor: '#F8F4EE',
              },
            }}
          >
            Quick Walk-In
          </Button>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsNewAppointmentOpen(true)}
            sx={{
              bgcolor: '#6A3F4D',
              color: '#EBD9DF',
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: 800,
              fontSize: '0.88rem',
              py: 1,
              px: 2.5,
              boxShadow: '0 4px 12px rgba(107, 79, 58, 0.25)',
              '&:hover': {
                bgcolor: '#523B2A',
              },
            }}
          >
            New Appointment
          </Button>
        </Box>
      </Box>

      {/* Date Switcher & Layout View Toggle Bar */}
      <Paper
        elevation={0}
        sx={{
          p: 1.5,
          borderRadius: '14px',
          bgcolor: '#FFFFFF',
          border: '1px solid #E8DFD5',
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2,
          boxShadow: '0 2px 8px rgba(107, 79, 58, 0.04)',
        }}
      >
        {/* Date Selector Pills */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <Button
            variant={selectedDate === 'Today' ? 'contained' : 'outlined'}
            size="small"
            startIcon={<TodayIcon sx={{ fontSize: 16 }} />}
            onClick={() => setSelectedDate('Today')}
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 800,
              fontSize: '0.82rem',
              bgcolor: selectedDate === 'Today' ? '#6A3F4D' : 'transparent',
              color: selectedDate === 'Today' ? '#EBD9DF' : '#6A3F4D',
              borderColor: '#E8DFD5',
              '&:hover': {
                bgcolor: selectedDate === 'Today' ? '#523B2A' : '#F8F4EE',
              },
            }}
          >
            Today (7 Aug)
          </Button>

          <Button
            variant={selectedDate === 'Tomorrow' ? 'contained' : 'outlined'}
            size="small"
            startIcon={<EventIcon sx={{ fontSize: 16 }} />}
            onClick={() => setSelectedDate('Tomorrow')}
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 800,
              fontSize: '0.82rem',
              bgcolor: selectedDate === 'Tomorrow' ? '#6A3F4D' : 'transparent',
              color: selectedDate === 'Tomorrow' ? '#EBD9DF' : '#6A3F4D',
              borderColor: '#E8DFD5',
              '&:hover': {
                bgcolor: selectedDate === 'Tomorrow' ? '#523B2A' : '#F8F4EE',
              },
            }}
          >
            Tomorrow (8 Aug)
          </Button>

          <Button
            variant={selectedDate === 'Aug 9' ? 'contained' : 'outlined'}
            size="small"
            onClick={() => setSelectedDate('Aug 9')}
            sx={{
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 800,
              fontSize: '0.82rem',
              bgcolor: selectedDate === 'Aug 9' ? '#6A3F4D' : 'transparent',
              color: selectedDate === 'Aug 9' ? '#EBD9DF' : '#6A3F4D',
              borderColor: '#E8DFD5',
              '&:hover': {
                bgcolor: selectedDate === 'Aug 9' ? '#523B2A' : '#F8F4EE',
              },
            }}
          >
            Sun 9 Aug
          </Button>
        </Box>

        {/* View Switcher & Export */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(_, val) => val && setViewMode(val)}
            size="small"
            sx={{
              bgcolor: '#F8F4EE',
              borderRadius: '10px',
              p: 0.3,
              border: '1px solid #E8DFD5',
              '& .MuiToggleButton-root': {
                border: 'none',
                borderRadius: '8px',
                px: 1.8,
                py: 0.5,
                color: '#6E5C63',
                fontWeight: 700,
                fontSize: '0.8rem',
                textTransform: 'none',
                gap: 0.8,
                '&.Mui-selected': {
                  bgcolor: '#6A3F4D',
                  color: '#EBD9DF',
                  '&:hover': { bgcolor: '#523B2A' },
                },
              },
            }}
          >
            <ToggleButton value="timeline">
              <ViewWeekIcon sx={{ fontSize: 18 }} />
              Chair Timeline
            </ToggleButton>
            <ToggleButton value="table">
              <ViewListIcon sx={{ fontSize: 18 }} />
              List Table
            </ToggleButton>
          </ToggleButtonGroup>

          <Tooltip title="Export appointment schedule to PDF / Excel">
            <Button
              variant="outlined"
              size="small"
              onClick={handleExport}
              startIcon={<DownloadIcon sx={{ fontSize: 16 }} />}
              sx={{
                borderColor: '#E8DFD5',
                color: '#6A3F4D',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.8rem',
                textTransform: 'none',
                py: 0.7,
              }}
            >
              Export
            </Button>
          </Tooltip>
        </Box>
      </Paper>
    </Box>
  );
};
