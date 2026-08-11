import React, { useState } from 'react';
import {
  Grid,
  Paper,
  Box,
  Typography,
  Chip,
  Button,
  Avatar,
  AvatarGroup,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import AddIcon from '@mui/icons-material/Add';
import PercentIcon from '@mui/icons-material/Percent';
import PeopleIcon from '@mui/icons-material/People';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { DepartmentType } from '../../types/employee';
import { useEmployees } from './EmployeesContext';

export const RolesManagementTab: React.FC = () => {
  const { roles, employees, addRole } = useEmployees();

  const [isAddRoleModalOpen, setIsAddRoleModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDept, setNewDept] = useState<DepartmentType>('Hair Care');
  const [newDesc, setNewDesc] = useState('');
  const [newCommRate, setNewCommRate] = useState(12);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([
    'POS Billing',
    'Appointments Booking',
  ]);

  const availablePermissions = [
    'POS Billing',
    'Appointments Booking',
    'Customer Database',
    'Inventory Usage Log',
    'Commission Edit',
    'Shift Roster Manager',
    'Financial Reports',
    'Full Access',
  ];

  const handleTogglePermission = (perm: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  const handleCreateRole = () => {
    if (!newTitle.trim()) return;
    addRole({
      title: newTitle,
      department: newDept,
      description: newDesc || `${newTitle} role for salon operations.`,
      defaultCommissionRate: newCommRate,
      permissions: selectedPermissions,
      color: '#6A3F4D',
    });
    setNewTitle('');
    setNewDesc('');
    setIsAddRoleModalOpen(false);
  };

  return (
    <Box>
      {/* Top Info Banner & Add Button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#2D1F24', fontFamily: '"Inter", sans-serif' }}>
            Salon Roles & Permission Hierarchy
          </Typography>
          <Typography variant="body2" sx={{ color: '#6E5C63' }}>
            Manage staff role titles, operational access permissions, and default commission rate benchmarks.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsAddRoleModalOpen(true)}
          sx={{
            bgcolor: '#6A3F4D',
            color: '#F8F4EE',
            fontWeight: 700,
            borderRadius: '10px',
            textTransform: 'none',
            px: 2.5,
            py: 1,
            '&:hover': { bgcolor: '#4A2B35' },
          }}
        >
          Create New Role
        </Button>
      </Box>

      {/* Roles Cards Grid */}
      <Grid container spacing={2.5}>
        {roles.map((role) => {
          const assignedStaff = employees.filter((e) => e.roleTitle === role.title);

          return (
            <Grid size={{ xs: 12, md: 6, lg: 4 }} key={role.id}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: '16px',
                  bgcolor: '#FFFFFF',
                  border: '1px solid #E8DFD5',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 24px rgba(107, 79, 58, 0.08)',
                    borderColor: '#A8828F',
                  },
                }}
              >
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <SecurityIcon sx={{ color: role.color }} />
                      <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.05rem', color: '#2D1F24' }}>
                        {role.title}
                      </Typography>
                    </Box>
                    <Chip
                      icon={<PercentIcon sx={{ fontSize: '12px !important', color: '#6A3F4D !important' }} />}
                      label={`${role.defaultCommissionRate}% Default`}
                      size="small"
                      sx={{ bgcolor: '#F8F4EE', color: '#6A3F4D', fontWeight: 800, fontSize: '0.72rem', height: 24 }}
                    />
                  </Box>

                  <Chip
                    label={role.department}
                    size="small"
                    sx={{ bgcolor: '#F8F4EE', color: '#6E5C63', fontWeight: 700, fontSize: '0.7rem', height: 22, mb: 1.5 }}
                  />

                  <Typography variant="body2" sx={{ color: '#6E5C63', mb: 2, fontSize: '0.85rem' }}>
                    {role.description}
                  </Typography>

                  {/* Permissions Chips */}
                  <Typography variant="caption" sx={{ color: '#6E5C63', fontWeight: 700, display: 'block', mb: 1, textTransform: 'uppercase' }}>
                    System Permissions ({role.permissions.length}):
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, mb: 2.5 }}>
                    {role.permissions.map((perm) => (
                      <Chip
                        key={perm}
                        icon={<CheckCircleIcon sx={{ fontSize: '12px !important', color: '#2E7D32 !important' }} />}
                        label={perm}
                        size="small"
                        sx={{
                          bgcolor: '#F4F9F4',
                          color: '#2E7D32',
                          fontWeight: 600,
                          fontSize: '0.72rem',
                          height: 22,
                        }}
                      />
                    ))}
                  </Box>
                </Box>

                {/* Assigned Staff Footer */}
                <Box sx={{ pt: 2, borderTop: '1px solid #F5EFE6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PeopleIcon sx={{ fontSize: 18, color: '#6E5C63' }} />
                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#2D1F24' }}>
                      {assignedStaff.length} Staff Assigned
                    </Typography>
                  </Box>

                  {assignedStaff.length > 0 && (
                    <AvatarGroup max={4} sx={{ '& .MuiAvatar-root': { width: 28, height: 28, fontSize: '0.75rem' } }}>
                      {assignedStaff.map((staff) => (
                        <Avatar key={staff.id} src={staff.avatarUrl} alt={staff.name} />
                      ))}
                    </AvatarGroup>
                  )}
                </Box>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      {/* Add Role Dialog Modal */}
      <Dialog
        open={isAddRoleModalOpen}
        onClose={() => setIsAddRoleModalOpen(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            sx: { borderRadius: '16px', p: 1 },
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: '#2D1F24', fontFamily: '"Inter", sans-serif' }}>
          Define New Staff Role
        </DialogTitle>
        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <TextField
            label="Role Title"
            placeholder="e.g. Nail Artist Lead"
            fullWidth
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />

          <FormControl fullWidth>
            <InputLabel>Department</InputLabel>
            <Select
              value={newDept}
              label="Department"
              onChange={(e) => setNewDept(e.target.value as DepartmentType)}
            >
              <MenuItem value="Hair Care">Hair Care</MenuItem>
              <MenuItem value="Skin & Aesthetics">Skin & Aesthetics</MenuItem>
              <MenuItem value="Grooming & Barber">Grooming & Barber</MenuItem>
              <MenuItem value="Front Desk">Front Desk</MenuItem>
              <MenuItem value="Management">Management</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Description"
            multiline
            rows={2}
            placeholder="Briefly describe key responsibilities..."
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
          />

          <TextField
            label="Default Commission Rate (%)"
            type="number"
            value={newCommRate}
            onChange={(e) => setNewCommRate(Number(e.target.value))}
            slotProps={{
              input: { endAdornment: <Typography variant="caption">%</Typography> },
            }}
          />

          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#2D1F24', mt: 1 }}>
            Assign System Permissions
          </Typography>
          <FormGroup row sx={{ gap: 1 }}>
            {availablePermissions.map((perm) => (
              <FormControlLabel
                key={perm}
                control={
                  <Checkbox
                    checked={selectedPermissions.includes(perm)}
                    onChange={() => handleTogglePermission(perm)}
                    sx={{ color: '#6A3F4D', '&.Mui-checked': { color: '#6A3F4D' } }}
                  />
                }
                label={<Typography variant="caption" sx={{ fontWeight: 600 }}>{perm}</Typography>}
              />
            ))}
          </FormGroup>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setIsAddRoleModalOpen(false)} sx={{ color: '#6E5C63', fontWeight: 700 }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleCreateRole}
            disabled={!newTitle.trim()}
            sx={{ bgcolor: '#6A3F4D', color: '#F8F4EE', fontWeight: 700, borderRadius: '8px', '&:hover': { bgcolor: '#4A2B35' } }}
          >
            Save Role
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
