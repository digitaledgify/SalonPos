import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
} from '@mui/material';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import { useDashboard } from '../context/DashboardContext';

export const NewCustomerModal: React.FC = () => {
  const { isNewCustomerOpen, setIsNewCustomerOpen, addCustomerBirthday } = useDashboard();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('28');
  const [preferredServices, setPreferredServices] = useState('Hair Spa, Hydra Facial');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    addCustomerBirthday({
      name,
      phone,
      age: Number(age),
      birthDate: 'Upcoming',
      isToday: false,
      preferredServices: preferredServices.split(',').map((s) => s.trim()),
    });

    setIsNewCustomerOpen(false);
    setName('');
    setPhone('');
  };

  return (
    <Dialog
      open={isNewCustomerOpen}
      onClose={() => setIsNewCustomerOpen(false)}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: { sx: { borderRadius: '16px', p: 1 } },
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, pb: 1 }}>
        <PersonAddAlt1Icon sx={{ color: '#6A3F4D' }} />
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#2D1F24' }}>
          Register New Customer
        </Typography>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers sx={{ borderBottom: '1px solid #E8DFD5', borderTop: '1px solid #E8DFD5' }}>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            <TextField
              label="Full Name"
              fullWidth
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Kavya Kapoor"
              size="small"
            />
            <TextField
              label="Phone Number"
              fullWidth
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 00000"
              size="small"
            />
            <TextField
              label="Age"
              type="number"
              fullWidth
              value={age}
              onChange={(e) => setAge(e.target.value)}
              size="small"
            />
            <TextField
              label="Preferred Services"
              fullWidth
              value={preferredServices}
              onChange={(e) => setPreferredServices(e.target.value)}
              size="small"
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ pt: 2, px: 3 }}>
          <Button onClick={() => setIsNewCustomerOpen(false)} sx={{ color: '#6E5C63' }}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" sx={{ bgcolor: '#6A3F4D', color: '#FFFFFF' }}>
            Save Customer Profile
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
