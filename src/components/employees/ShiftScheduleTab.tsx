import React from 'react';
import {
  Paper,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  Button,
  Grid,
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import NightlightIcon from '@mui/icons-material/Nightlight';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BlockIcon from '@mui/icons-material/Block';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import { ShiftType } from '../../types/employee';
import { useEmployees } from './EmployeesContext';

export const ShiftScheduleTab: React.FC = () => {
  const { employees, setShiftAssignEmployee, setIsAssignShiftModalOpen } = useEmployees();

  const daysOfWeek: Array<'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun'> = [
    'Mon',
    'Tue',
    'Wed',
    'Thu',
    'Fri',
    'Sat',
    'Sun',
  ];

  // Calculate shift stats for today (assume Fri as active day or check overall)
  const todayMorning = employees.filter((e) =>
    e.shifts.some((s) => s.day === 'Fri' && s.shiftType === 'Morning')
  ).length;

  const todayEvening = employees.filter((e) =>
    e.shifts.some((s) => s.day === 'Fri' && s.shiftType === 'Evening')
  ).length;

  const todayFullDay = employees.filter((e) =>
    e.shifts.some((s) => s.day === 'Fri' && s.shiftType === 'Full Day')
  ).length;

  const todayOff = employees.filter((e) =>
    e.shifts.some((s) => s.day === 'Fri' && s.shiftType === 'Off')
  ).length;

  const handleCellClick = (emp: any) => {
    setShiftAssignEmployee(emp);
    setIsAssignShiftModalOpen(true);
  };

  const getShiftBadge = (shiftType: ShiftType, times: string) => {
    switch (shiftType) {
      case 'Morning':
        return (
          <Chip
            size="small"
            icon={<WbSunnyIcon sx={{ fontSize: '12px !important', color: '#1565C0 !important' }} />}
            label="Morning"
            sx={{ bgcolor: '#E3F2FD', color: '#1565C0', fontWeight: 800, fontSize: '0.68rem', height: 22 }}
          />
        );
      case 'Evening':
        return (
          <Chip
            size="small"
            icon={<NightlightIcon sx={{ fontSize: '12px !important', color: '#6A1B9A !important' }} />}
            label="Evening"
            sx={{ bgcolor: '#F3E5F5', color: '#6A1B9A', fontWeight: 800, fontSize: '0.68rem', height: 22 }}
          />
        );
      case 'Full Day':
        return (
          <Chip
            size="small"
            icon={<AccessTimeIcon sx={{ fontSize: '12px !important', color: '#2E7D32 !important' }} />}
            label="Full Day"
            sx={{ bgcolor: '#E8F5E9', color: '#2E7D32', fontWeight: 800, fontSize: '0.68rem', height: 22 }}
          />
        );
      case 'Night':
        return (
          <Chip
            size="small"
            label="Night"
            sx={{ bgcolor: '#EDE7F6', color: '#4A148C', fontWeight: 800, fontSize: '0.68rem', height: 22 }}
          />
        );
      case 'Off':
      default:
        return (
          <Chip
            size="small"
            icon={<BlockIcon sx={{ fontSize: '12px !important', color: '#757575 !important' }} />}
            label="Off"
            sx={{ bgcolor: '#FAFAFA', color: '#757575', fontWeight: 600, fontSize: '0.68rem', height: 22 }}
          />
        );
    }
  };

  return (
    <Box>
      {/* Shift Overview Metrics */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: '12px', bgcolor: '#E8F5E9', border: '1px solid #A5D6A7' }}>
            <Typography variant="caption" sx={{ color: '#2E7D32', fontWeight: 800, textTransform: 'uppercase' }}>
              Full Day Shift
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#1B5E20', mt: 0.5 }}>
              {todayFullDay} Staff
            </Typography>
            <Typography variant="caption" sx={{ color: '#388E3C' }}>
              09:30 AM - 07:30 PM
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: '12px', bgcolor: '#E3F2FD', border: '1px solid #90CAF9' }}>
            <Typography variant="caption" sx={{ color: '#1565C0', fontWeight: 800, textTransform: 'uppercase' }}>
              Morning Shift
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0D47A1', mt: 0.5 }}>
              {todayMorning} Staff
            </Typography>
            <Typography variant="caption" sx={{ color: '#1976D2' }}>
              09:00 AM - 04:00 PM
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: '12px', bgcolor: '#F3E5F5', border: '1px solid #CE93D8' }}>
            <Typography variant="caption" sx={{ color: '#6A1B9A', fontWeight: 800, textTransform: 'uppercase' }}>
              Evening Shift
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#4A148C', mt: 0.5 }}>
              {todayEvening} Staff
            </Typography>
            <Typography variant="caption" sx={{ color: '#7B1FA2' }}>
              01:00 PM - 08:00 PM
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Paper elevation={0} sx={{ p: 2, borderRadius: '12px', bgcolor: '#FAFAFA', border: '1px solid #E0E0E0' }}>
            <Typography variant="caption" sx={{ color: '#616161', fontWeight: 800, textTransform: 'uppercase' }}>
              Off / Weekly Rest
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#424242', mt: 0.5 }}>
              {todayOff} Staff
            </Typography>
            <Typography variant="caption" sx={{ color: '#757575' }}>
              Scheduled Break
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Weekly Roster Matrix Table */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: '16px',
          bgcolor: '#FFFFFF',
          border: '1px solid #E8DFD5',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ p: 2.5, bgcolor: '#F8F4EE', borderBottom: '1px solid #E8DFD5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <CalendarMonthIcon sx={{ color: '#6A3F4D' }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#2D1F24', fontSize: '1.1rem' }}>
                Weekly Shift Roster (Mon - Sun)
              </Typography>
              <Typography variant="caption" sx={{ color: '#6E5C63' }}>
                Click on any staff member's row or shift cell to reassign duty hours.
              </Typography>
            </Box>
          </Box>
        </Box>

        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table>
            <TableHead sx={{ bgcolor: '#FFFDF9' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 800, color: '#6A3F4D', minWidth: 200, sticky: 'left' }}>
                  Staff Member
                </TableCell>
                {daysOfWeek.map((day) => (
                  <TableCell
                    key={day}
                    align="center"
                    sx={{
                      fontWeight: 800,
                      color: day === 'Fri' ? '#2E7D32' : '#6A3F4D',
                      bgcolor: day === 'Fri' ? '#F4F9F4' : 'transparent',
                      minWidth: 120,
                    }}
                  >
                    {day} {day === 'Fri' ? '(Today)' : ''}
                  </TableCell>
                ))}
                <TableCell align="center" sx={{ fontWeight: 800, color: '#6A3F4D', minWidth: 110 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.map((emp) => (
                <TableRow
                  key={emp.id}
                  hover
                  sx={{
                    '&:hover': { bgcolor: '#F8F4EE' },
                    '&:last-child td, &:last-child th': { border: 0 },
                  }}
                >
                  {/* Employee column */}
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar src={emp.avatarUrl} alt={emp.name} sx={{ width: 36, height: 36, border: '2px solid #EBD9DF' }} />
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#2D1F24' }}>
                          {emp.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#6E5C63', display: 'block', fontSize: '0.72rem' }}>
                          {emp.roleTitle}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  {/* Day Columns */}
                  {daysOfWeek.map((day) => {
                    const shift = emp.shifts.find((s) => s.day === day) || {
                      day,
                      shiftType: 'Off' as ShiftType,
                      startTime: '-',
                      endTime: '-',
                    };
                    const isToday = day === 'Fri';

                    return (
                      <TableCell
                        key={day}
                        align="center"
                        onClick={() => handleCellClick(emp)}
                        sx={{
                          bgcolor: isToday ? '#F9FAF7' : 'transparent',
                          cursor: 'pointer',
                          transition: 'bgcolor 0.2s',
                          '&:hover': {
                            bgcolor: '#F5EFE6',
                          },
                        }}
                      >
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.3 }}>
                          {getShiftBadge(shift.shiftType, `${shift.startTime} - ${shift.endTime}`)}
                          {shift.shiftType !== 'Off' && (
                            <Typography variant="caption" sx={{ fontSize: '0.65rem', color: '#6E5C63', fontWeight: 600 }}>
                              {shift.startTime}
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                    );
                  })}

                  {/* Quick Edit button */}
                  <TableCell align="center">
                    <Button
                      size="small"
                      startIcon={<EditCalendarIcon />}
                      onClick={() => handleCellClick(emp)}
                      sx={{
                        color: '#6A3F4D',
                        textTransform: 'none',
                        fontWeight: 700,
                        fontSize: '0.72rem',
                      }}
                    >
                      Assign
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};
