import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from '@mui/material';
import { DepartmentType, EmployeeStatus } from '../../types/employee';
import { useEmployees } from './EmployeesContext';
import { DEFAULT_WEEKLY_SHIFTS } from '../../services/employeeData';

export const AddEditEmployeeModal: React.FC = () => {
  const {
    isAddEditModalOpen,
    setIsAddEditModalOpen,
    editingEmployee,
    roles,
    addEmployee,
    updateEmployee,
  } = useEmployees();

  const isEdit = Boolean(editingEmployee);

  const [name, setName] = useState('');
  const [roleTitle, setRoleTitle] = useState('Master Senior Stylist');
  const [department, setDepartment] = useState<DepartmentType>('Hair Care');
  const [status, setStatus] = useState<EmployeeStatus>('Active');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [startDate, setStartDate] = useState('');
  const [baseSalary, setBaseSalary] = useState(35000);
  const [commissionRate, setCommissionRate] = useState(15);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [specialtiesStr, setSpecialtiesStr] = useState('');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');

  useEffect(() => {
    if (editingEmployee) {
      setName(editingEmployee.name);
      setRoleTitle(editingEmployee.roleTitle);
      setDepartment(editingEmployee.department);
      setStatus(editingEmployee.status);
      setEmail(editingEmployee.email);
      setPhone(editingEmployee.phone);
      setStartDate(editingEmployee.startDate);
      setBaseSalary(editingEmployee.baseSalary);
      setCommissionRate(editingEmployee.commissionRate);
      setAvatarUrl(editingEmployee.avatarUrl);
      setSpecialtiesStr(editingEmployee.specialties.join(', '));
      setEmergencyName(editingEmployee.emergencyContact.name);
      setEmergencyPhone(editingEmployee.emergencyContact.phone);
    } else {
      setName('');
      setRoleTitle('Master Senior Stylist');
      setDepartment('Hair Care');
      setStatus('Active');
      setEmail('');
      setPhone('+91 ');
      setStartDate('Today');
      setBaseSalary(35000);
      setCommissionRate(15);
      setAvatarUrl('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250');
      setSpecialtiesStr('Haircuts, Styling, Consultation');
      setEmergencyName('');
      setEmergencyPhone('+91 ');
    }
  }, [editingEmployee, isAddEditModalOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const specs = specialtiesStr.split(',').map((s) => s.trim()).filter(Boolean);

    if (isEdit && editingEmployee) {
      updateEmployee(editingEmployee.id, {
        name,
        roleTitle,
        department,
        status,
        email,
        phone,
        startDate,
        baseSalary,
        commissionRate,
        avatarUrl: avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
        specialties: specs,
        emergencyContact: {
          name: emergencyName || 'Relative',
          relationship: 'Emergency Contact',
          phone: emergencyPhone || phone,
        },
      });
    } else {
      addEmployee({
        name,
        roleTitle,
        department,
        status,
        email,
        phone,
        startDate: startDate || 'Today',
        baseSalary,
        commissionRate,
        avatarUrl: avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
        todaySales: 0,
        monthlySales: 0,
        commissionEarnedToday: 0,
        commissionEarnedMonth: 0,
        tipsToday: 0,
        rating: 5.0,
        completedAppointmentsCount: 0,
        shifts: DEFAULT_WEEKLY_SHIFTS,
        emergencyContact: {
          name: emergencyName || 'Relative',
          relationship: 'Emergency Contact',
          phone: emergencyPhone || phone,
        },
        specialties: specs,
        payoutStatus: 'Paid',
      });
    }

    setIsAddEditModalOpen(false);
  };

  return (
    <Dialog
      open={isAddEditModalOpen}
      onClose={() => setIsAddEditModalOpen(false)}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: { borderRadius: '16px', p: 1 },
        },
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle sx={{ fontWeight: 800, color: '#2D1F24', fontFamily: '"Inter", sans-serif' }}>
          {isEdit ? 'Edit Staff Member Details' : 'Add New Staff Member'}
        </DialogTitle>

        <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 2 }}>
          <Grid container spacing={2}>
            {/* Full Name */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                required
                label="Full Name"
                placeholder="e.g. Aarav Kapoor"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Grid>

            {/* Department */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth required>
                <InputLabel>Department</InputLabel>
                <Select
                  value={department}
                  label="Department"
                  onChange={(e) => setDepartment(e.target.value as DepartmentType)}
                >
                  <MenuItem value="Hair Care">Hair Care</MenuItem>
                  <MenuItem value="Skin & Aesthetics">Skin & Aesthetics</MenuItem>
                  <MenuItem value="Grooming & Barber">Grooming & Barber</MenuItem>
                  <MenuItem value="Front Desk">Front Desk</MenuItem>
                  <MenuItem value="Management">Management</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Role Title */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth required>
                <InputLabel>Role Title</InputLabel>
                <Select
                  value={roleTitle}
                  label="Role Title"
                  onChange={(e) => setRoleTitle(e.target.value)}
                >
                  {roles.map((r) => (
                    <MenuItem key={r.id} value={r.title}>
                      {r.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Status */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth required>
                <InputLabel>Employment Status</InputLabel>
                <Select
                  value={status}
                  label="Employment Status"
                  onChange={(e) => setStatus(e.target.value as EmployeeStatus)}
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="On Shift">On Shift</MenuItem>
                  <MenuItem value="Off Duty">Off Duty</MenuItem>
                  <MenuItem value="On Leave">On Leave</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Phone */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                required
                label="Phone Number"
                placeholder="+91 98765 43210"
                fullWidth
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </Grid>

            {/* Email */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                required
                label="Email Address"
                placeholder="aarav@beigesalon.com"
                type="email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>

            {/* Base Salary & Commission Rate */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Monthly Base Salary (₹)"
                type="number"
                fullWidth
                value={baseSalary}
                onChange={(e) => setBaseSalary(Number(e.target.value))}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Base Commission Rate (%)"
                type="number"
                fullWidth
                value={commissionRate}
                onChange={(e) => setCommissionRate(Number(e.target.value))}
              />
            </Grid>

            {/* Avatar URL & Specialties */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Avatar Photo URL"
                placeholder="https://images.unsplash.com/..."
                fullWidth
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Specialties (Comma Separated)"
                placeholder="Haircuts, Balayage, Keratin"
                fullWidth
                value={specialtiesStr}
                onChange={(e) => setSpecialtiesStr(e.target.value)}
              />
            </Grid>

            {/* Emergency Contact */}
            <Grid size={{ xs: 12 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#2D1F24', mt: 1, mb: 1 }}>
                Emergency Contact Details
              </Typography>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Emergency Contact Name"
                placeholder="Relative or Spouse Name"
                fullWidth
                value={emergencyName}
                onChange={(e) => setEmergencyName(e.target.value)}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Emergency Contact Phone"
                placeholder="+91 98765 00000"
                fullWidth
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setIsAddEditModalOpen(false)} sx={{ color: '#6E5C63', fontWeight: 700 }}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={{ bgcolor: '#6A3F4D', color: '#F8F4EE', fontWeight: 700, borderRadius: '8px', '&:hover': { bgcolor: '#4A2B35' } }}
          >
            {isEdit ? 'Save Changes' : 'Create Staff Member'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
