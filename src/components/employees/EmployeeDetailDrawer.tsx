import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Avatar,
  Chip,
  Divider,
  Grid,
  Paper,
  Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EditIcon from '@mui/icons-material/Edit';
import StarIcon from '@mui/icons-material/Star';
import PercentIcon from '@mui/icons-material/Percent';
import BadgeIcon from '@mui/icons-material/Badge';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import { useEmployees } from './EmployeesContext';

export const EmployeeDetailDrawer: React.FC = () => {
  const {
    selectedEmployee,
    isDetailDrawerOpen,
    setIsDetailDrawerOpen,
    setEditingEmployee,
    setIsAddEditModalOpen,
    setShiftAssignEmployee,
    setIsAssignShiftModalOpen,
    setCommissionEmployee,
    setIsAdjustCommissionModalOpen,
  } = useEmployees();

  if (!selectedEmployee) return null;

  const handleEdit = () => {
    setEditingEmployee(selectedEmployee);
    setIsAddEditModalOpen(true);
  };

  const handleShiftModal = () => {
    setShiftAssignEmployee(selectedEmployee);
    setIsAssignShiftModalOpen(true);
  };

  const handleCommissionModal = () => {
    setCommissionEmployee(selectedEmployee);
    setIsAdjustCommissionModalOpen(true);
  };

  return (
    <Drawer
      anchor="right"
      open={isDetailDrawerOpen}
      onClose={() => setIsDetailDrawerOpen(false)}
      slotProps={{
        paper: {
          sx: {
            width: { xs: '100%', sm: 480 },
            bgcolor: '#F8F4EE',
            p: 0,
          },
        },
      }}
    >
      {/* Top Banner & Header */}
      <Box
        sx={{
          bgcolor: '#6A3F4D',
          color: '#F8F4EE',
          p: 3,
          position: 'relative',
        }}
      >
        <IconButton
          onClick={() => setIsDetailDrawerOpen(false)}
          sx={{ position: 'absolute', top: 16, right: 16, color: '#F8F4EE' }}
        >
          <CloseIcon />
        </IconButton>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
          <Avatar
            src={selectedEmployee.avatarUrl}
            alt={selectedEmployee.name}
            sx={{ width: 72, height: 72, border: '3px solid #EBD9DF', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
          />
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#F8F4EE', fontFamily: '"Inter", sans-serif' }}>
              {selectedEmployee.name}
            </Typography>
            <Typography variant="body2" sx={{ color: '#EBD9DF', fontWeight: 600 }}>
              {selectedEmployee.roleTitle}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.8 }}>
              <Chip
                label={selectedEmployee.status}
                size="small"
                sx={{
                  bgcolor: selectedEmployee.status === 'On Shift' ? '#2E7D32' : '#A8828F',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '0.7rem',
                  height: 22,
                }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', color: '#FFD54F', fontSize: '0.8rem', fontWeight: 800 }}>
                <StarIcon sx={{ fontSize: 16, mr: 0.3 }} />
                {selectedEmployee.rating} Rating
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Main Content Body */}
      <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2.5, overflowY: 'auto' }}>
        {/* Quick Actions */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={handleEdit}
            sx={{ borderColor: '#A8828F', color: '#6A3F4D', fontWeight: 700, borderRadius: '10px' }}
          >
            Edit Profile
          </Button>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<CalendarMonthIcon />}
            onClick={handleShiftModal}
            sx={{ borderColor: '#A8828F', color: '#6A3F4D', fontWeight: 700, borderRadius: '10px' }}
          >
            Roster
          </Button>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<PercentIcon />}
            onClick={handleCommissionModal}
            sx={{ borderColor: '#A8828F', color: '#6A3F4D', fontWeight: 700, borderRadius: '10px' }}
          >
            Commission
          </Button>
        </Box>

        {/* Contact & Personal Info */}
        <Paper elevation={0} sx={{ p: 2, borderRadius: '12px', bgcolor: '#FFFFFF', border: '1px solid #E8DFD5' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#2D1F24', mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
            <BadgeIcon sx={{ color: '#6A3F4D', fontSize: 18 }} /> Contact & Department
          </Typography>
          <Grid container spacing={1.5}>
            <Grid size={{ xs: 6 }}>
              <Typography variant="caption" sx={{ color: '#6E5C63', display: 'block' }}>Department</Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#2D1F24' }}>{selectedEmployee.department}</Typography>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Typography variant="caption" sx={{ color: '#6E5C63', display: 'block' }}>Joining Date</Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#2D1F24' }}>{selectedEmployee.startDate}</Typography>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Typography variant="caption" sx={{ color: '#6E5C63', display: 'block' }}>Phone Number</Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#2D1F24', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <PhoneIcon sx={{ fontSize: 14, color: '#6E5C63' }} /> {selectedEmployee.phone}
              </Typography>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Typography variant="caption" sx={{ color: '#6E5C63', display: 'block' }}>Email Address</Typography>
              <Typography variant="body2" sx={{ fontWeight: 700, color: '#2D1F24', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <EmailIcon sx={{ fontSize: 14, color: '#6E5C63' }} /> {selectedEmployee.email}
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* Emergency Contact */}
        <Paper elevation={0} sx={{ p: 2, borderRadius: '12px', bgcolor: '#FFFFFF', border: '1px solid #E8DFD5' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#2D1F24', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            <ContactPhoneIcon sx={{ color: '#C62828', fontSize: 18 }} /> Emergency Contact
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 800, color: '#2D1F24' }}>
            {selectedEmployee.emergencyContact.name} ({selectedEmployee.emergencyContact.relationship})
          </Typography>
          <Typography variant="caption" sx={{ color: '#6E5C63' }}>
            Phone: {selectedEmployee.emergencyContact.phone}
          </Typography>
        </Paper>

        {/* Earnings & Performance */}
        <Paper elevation={0} sx={{ p: 2, borderRadius: '12px', bgcolor: '#FFFFFF', border: '1px solid #E8DFD5' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#2D1F24', mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
            <CurrencyRupeeIcon sx={{ color: '#2E7D32', fontSize: 18 }} /> Financials & Commission
          </Typography>
          <Grid container spacing={1.5}>
            <Grid size={{ xs: 6 }}>
              <Typography variant="caption" sx={{ color: '#6E5C63', display: 'block' }}>Base Salary (Monthly)</Typography>
              <Typography variant="body1" sx={{ fontWeight: 800, color: '#2D1F24' }}>
                ₹{selectedEmployee.baseSalary.toLocaleString('en-IN')}
              </Typography>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Typography variant="caption" sx={{ color: '#6E5C63', display: 'block' }}>Commission Rate</Typography>
              <Typography variant="body1" sx={{ fontWeight: 800, color: '#6A3F4D' }}>
                {selectedEmployee.commissionRate}%
              </Typography>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Typography variant="caption" sx={{ color: '#6E5C63', display: 'block' }}>Today's Sales</Typography>
              <Typography variant="body1" sx={{ fontWeight: 800, color: '#2E7D32' }}>
                ₹{selectedEmployee.todaySales.toLocaleString('en-IN')}
              </Typography>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <Typography variant="caption" sx={{ color: '#6E5C63', display: 'block' }}>Today's Commission</Typography>
              <Typography variant="body1" sx={{ fontWeight: 800, color: '#2E7D32' }}>
                ₹{selectedEmployee.commissionEarnedToday.toLocaleString('en-IN')}
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* Specialties & Bio */}
        <Paper elevation={0} sx={{ p: 2, borderRadius: '12px', bgcolor: '#FFFFFF', border: '1px solid #E8DFD5' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#2D1F24', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            <WorkHistoryIcon sx={{ color: '#6A3F4D', fontSize: 18 }} /> Skills & Specialization
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, mb: 1.5 }}>
            {selectedEmployee.specialties.map((spec) => (
              <Chip key={spec} label={spec} size="small" sx={{ bgcolor: '#F8F4EE', color: '#6A3F4D', fontWeight: 700, fontSize: '0.72rem' }} />
            ))}
          </Box>
          {selectedEmployee.bio && (
            <Typography variant="caption" sx={{ color: '#6E5C63', fontStyle: 'italic', display: 'block' }}>
              "{selectedEmployee.bio}"
            </Typography>
          )}
        </Paper>
      </Box>
    </Drawer>
  );
};
