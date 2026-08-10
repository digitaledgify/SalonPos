import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  FormControl,
  Select,
  Typography,
  Box,
  MenuItem,
  Avatar,
  Paper,
} from '@mui/material';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import NightlightIcon from '@mui/icons-material/Nightlight';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BlockIcon from '@mui/icons-material/Block';
import { ShiftSchedule, ShiftType } from '../../types/employee';
import { useEmployees } from './EmployeesContext';

export const AssignShiftModal: React.FC = () => {
  const {
    isAssignShiftModalOpen,
    setIsAssignShiftModalOpen,
    shiftAssignEmployee,
    updateEmployeeShifts,
  } = useEmployees();

  const [shifts, setShifts] = useState<ShiftSchedule[]>([]);

  const defaultShiftPreset: Record<ShiftType, { startTime: string; endTime: string }> = {
    Morning: { startTime: '09:00 AM', endTime: '04:00 PM' },
    Evening: { startTime: '01:00 PM', endTime: '08:00 PM' },
    'Full Day': { startTime: '09:30 AM', endTime: '07:30 PM' },
    Night: { startTime: '06:00 PM', endTime: '02:00 AM' },
    Off: { startTime: '-', endTime: '-' },
  };

  useEffect(() => {
    if (shiftAssignEmployee) {
      setShifts(shiftAssignEmployee.shifts);
    }
  }, [shiftAssignEmployee, isAssignShiftModalOpen]);

  if (!shiftAssignEmployee) return null;

  const handleShiftTypeChange = (dayIndex: number, newType: ShiftType) => {
    setShifts((prev) =>
      prev.map((s, idx) => {
        if (idx === dayIndex) {
          const preset = defaultShiftPreset[newType];
          return {
            ...s,
            shiftType: newType,
            startTime: preset.startTime,
            endTime: preset.endTime,
          };
        }
        return s;
      })
    );
  };

  const handleSave = () => {
    updateEmployeeShifts(shiftAssignEmployee.id, shifts);
    setIsAssignShiftModalOpen(false);
  };

  return (
    <Dialog
      open={isAssignShiftModalOpen}
      onClose={() => setIsAssignShiftModalOpen(false)}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: { borderRadius: '16px', p: 1 },
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 800, color: '#2D1F24', fontFamily: '"Playfair Display", serif' }}>
        Assign Weekly Shift Roster
      </DialogTitle>

      <DialogContent dividers sx={{ pt: 2 }}>
        {/* Employee Header */}
        <Paper elevation={0} sx={{ p: 2, bgcolor: '#F8F4EE', borderRadius: '12px', border: '1px solid #E8DFD5', mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar src={shiftAssignEmployee.avatarUrl} alt={shiftAssignEmployee.name} sx={{ width: 48, height: 48, border: '2px solid #EBD9DF' }} />
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#2D1F24' }}>
              {shiftAssignEmployee.name}
            </Typography>
            <Typography variant="body2" sx={{ color: '#6E5C63' }}>
              {shiftAssignEmployee.roleTitle} · {shiftAssignEmployee.department}
            </Typography>
          </Box>
        </Paper>

        {/* Shift Grid Mon-Sun */}
        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#2D1F24', mb: 1.5 }}>
          Weekly Roster Schedule
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {shifts.map((s, idx) => (
            <Box
              key={s.day}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 1.5,
                borderRadius: '10px',
                bgcolor: '#FFFFFF',
                border: '1px solid #E8DFD5',
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 800, color: '#6A3F4D', minWidth: 50 }}>
                {s.day}
              </Typography>

              <FormControl size="small" sx={{ minWidth: 160 }}>
                <Select
                  value={s.shiftType}
                  onChange={(e) => handleShiftTypeChange(idx, e.target.value as ShiftType)}
                  sx={{ borderRadius: '8px', fontWeight: 700, fontSize: '0.85rem' }}
                >
                  <MenuItem value="Morning">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <WbSunnyIcon sx={{ fontSize: 16, color: '#1565C0' }} /> Morning
                    </Box>
                  </MenuItem>
                  <MenuItem value="Evening">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <NightlightIcon sx={{ fontSize: 16, color: '#6A1B9A' }} /> Evening
                    </Box>
                  </MenuItem>
                  <MenuItem value="Full Day">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AccessTimeIcon sx={{ fontSize: 16, color: '#2E7D32' }} /> Full Day
                    </Box>
                  </MenuItem>
                  <MenuItem value="Off">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <BlockIcon sx={{ fontSize: 16, color: '#757575' }} /> Off
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>

              <Typography variant="caption" sx={{ color: '#6E5C63', fontWeight: 600, minWidth: 130, textAlign: 'right' }}>
                {s.shiftType === 'Off' ? 'No Shift' : `${s.startTime} - ${s.endTime}`}
              </Typography>
            </Box>
          ))}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={() => setIsAssignShiftModalOpen(false)} sx={{ color: '#6E5C63', fontWeight: 700 }}>
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          sx={{ bgcolor: '#6A3F4D', color: '#F8F4EE', fontWeight: 700, borderRadius: '8px', '&:hover': { bgcolor: '#4A2B35' } }}
        >
          Save Shift Roster
        </Button>
      </DialogActions>
    </Dialog>
  );
};
