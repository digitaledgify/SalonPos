import React, { useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Avatar,
  Menu,
  MenuItem,
  Button,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import CancelIcon from '@mui/icons-material/Cancel';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PhoneIcon from '@mui/icons-material/Phone';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { Appointment, AppointmentStatus } from '../../types';
import { useDashboard } from '../../context/DashboardContext';

interface Props {
  appointments: Appointment[];
  onSelectAppointment: (apt: Appointment) => void;
}

export const AppointmentTable: React.FC<Props> = ({
  appointments,
  onSelectAppointment,
}) => {
  const { stylists, updateAppointmentStatus, addTransaction, showToast, setSelectedInvoice } =
    useDashboard();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [activeApt, setActiveApt] = useState<Appointment | null>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, apt: Appointment) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setActiveApt(apt);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setActiveApt(null);
  };

  const handleStatusChange = (status: AppointmentStatus) => {
    if (activeApt) {
      updateAppointmentStatus(activeApt.id, status);
    }
    handleMenuClose();
  };

  const handleCreateInvoice = (e: React.MouseEvent, apt: Appointment) => {
    e.stopPropagation();
    addTransaction({
      customerName: apt.customerName,
      customerPhone: apt.customerPhone,
      stylistName: apt.stylistName,
      services: [apt.service],
      amount: apt.amount,
      paymentMethod: 'UPI',
      status: 'Paid',
    });
    updateAppointmentStatus(apt.id, 'Completed');
  };

  const getStatusChip = (status: AppointmentStatus) => {
    switch (status) {
      case 'Checked In':
        return (
          <Chip
            label="Checked In"
            size="small"
            sx={{ bgcolor: '#E1F5FE', color: '#0288D1', fontWeight: 800, fontSize: '0.72rem' }}
          />
        );
      case 'Completed':
        return (
          <Chip
            label="Completed"
            size="small"
            sx={{ bgcolor: '#E8F5E9', color: '#2E7D32', fontWeight: 800, fontSize: '0.72rem' }}
          />
        );
      case 'Cancelled':
        return (
          <Chip
            label="Cancelled"
            size="small"
            sx={{ bgcolor: '#FFEBEE', color: '#C62828', fontWeight: 800, fontSize: '0.72rem' }}
          />
        );
      case 'Booked':
      default:
        return (
          <Chip
            label="Booked"
            size="small"
            sx={{ bgcolor: '#FFF8E1', color: '#F57F17', fontWeight: 800, fontSize: '0.72rem' }}
          />
        );
    }
  };

  const getStylistAvatar = (stylistName: string) => {
    const s = stylists.find((st) => st.name === stylistName);
    return s?.avatarUrl;
  };

  if (appointments.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 6,
          textAlign: 'center',
          borderRadius: '16px',
          bgcolor: '#FFFFFF',
          border: '1px solid #E8DFD5',
          mb: 3,
        }}
      >
        <CalendarMonthIcon sx={{ fontSize: 48, color: '#A8828F', mb: 1.5 }} />
        <Typography variant="h6" sx={{ fontWeight: 800, color: '#2D1F24' }}>
          No Appointments Found
        </Typography>
        <Typography variant="body2" sx={{ color: '#6E5C63', mt: 0.5 }}>
          No scheduled appointments match your selected search or filter criteria.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: '16px',
        bgcolor: '#FFFFFF',
        border: '1px solid #E8DFD5',
        overflow: 'hidden',
        boxShadow: '0 2px 10px rgba(107, 79, 58, 0.04)',
        mb: 3,
      }}
    >
      <TableContainer>
        <Table sx={{ minWidth: 800 }}>
          <TableHead sx={{ bgcolor: '#F8F4EE' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 800, color: '#6A3F4D', fontSize: '0.8rem' }}>Time Slot</TableCell>
              <TableCell sx={{ fontWeight: 800, color: '#6A3F4D', fontSize: '0.8rem' }}>Client Details</TableCell>
              <TableCell sx={{ fontWeight: 800, color: '#6A3F4D', fontSize: '0.8rem' }}>Service Treatment</TableCell>
              <TableCell sx={{ fontWeight: 800, color: '#6A3F4D', fontSize: '0.8rem' }}>Assigned Stylist</TableCell>
              <TableCell sx={{ fontWeight: 800, color: '#6A3F4D', fontSize: '0.8rem' }}>Amount (₹)</TableCell>
              <TableCell sx={{ fontWeight: 800, color: '#6A3F4D', fontSize: '0.8rem' }}>Status</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800, color: '#6A3F4D', fontSize: '0.8rem' }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.map((apt) => (
              <TableRow
                key={apt.id}
                hover
                onClick={() => onSelectAppointment(apt)}
                sx={{
                  cursor: 'pointer',
                  '&:last-child td, &:last-child th': { border: 0 },
                }}
              >
                {/* Time Slot */}
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: '#2D1F24', fontFamily: 'monospace' }}>
                    {apt.time}
                  </Typography>
                </TableCell>

                {/* Client Details */}
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: '#2D1F24' }}>
                    {apt.customerName}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.2 }}>
                    <PhoneIcon sx={{ fontSize: 12, color: '#6E5C63' }} />
                    <Typography variant="caption" sx={{ color: '#6E5C63', fontWeight: 600 }}>
                      {apt.customerPhone}
                    </Typography>
                  </Box>
                </TableCell>

                {/* Service Treatment */}
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#6A3F4D' }}>
                    {apt.service}
                  </Typography>
                  {apt.notes && (
                    <Typography variant="caption" sx={{ color: '#D32F2F', fontWeight: 600, display: 'block' }}>
                      Note: {apt.notes}
                    </Typography>
                  )}
                </TableCell>

                {/* Assigned Stylist */}
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar
                      src={getStylistAvatar(apt.stylistName)}
                      alt={apt.stylistName}
                      sx={{ width: 28, height: 28, border: '1px solid #A8828F' }}
                    />
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#2D1F24' }}>
                      {apt.stylistName}
                    </Typography>
                  </Box>
                </TableCell>

                {/* Amount */}
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: '#2D1F24' }}>
                    ₹{apt.amount.toLocaleString()}
                  </Typography>
                </TableCell>

                {/* Status Badge */}
                <TableCell>{getStatusChip(apt.status)}</TableCell>

                {/* Quick Actions */}
                <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                    {apt.status === 'Completed' ? (
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<ReceiptIcon sx={{ fontSize: 14 }} />}
                        onClick={(e) => handleCreateInvoice(e, apt)}
                        sx={{
                          borderColor: '#E8DFD5',
                          color: '#6A3F4D',
                          borderRadius: '8px',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          textTransform: 'none',
                          py: 0.4,
                        }}
                      >
                        Bill Generated
                      </Button>
                    ) : (
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<ReceiptIcon sx={{ fontSize: 14 }} />}
                        onClick={(e) => handleCreateInvoice(e, apt)}
                        sx={{
                          bgcolor: '#6A3F4D',
                          color: '#EBD9DF',
                          borderRadius: '8px',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          textTransform: 'none',
                          py: 0.4,
                          '&:hover': { bgcolor: '#523B2A' },
                        }}
                      >
                        Generate Bill
                      </Button>
                    )}

                    <IconButton size="small" onClick={(e) => handleMenuOpen(e, apt)}>
                      <MoreVertIcon sx={{ fontSize: 18, color: '#6A3F4D' }} />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Row Context Action Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={() => handleStatusChange('Checked In')}>
          <HowToRegIcon sx={{ fontSize: 18, color: '#0288D1', mr: 1 }} />
          Mark Checked In
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange('Completed')}>
          <CheckCircleIcon sx={{ fontSize: 18, color: '#2E7D32', mr: 1 }} />
          Mark Completed
        </MenuItem>
        <MenuItem onClick={() => handleStatusChange('Cancelled')}>
          <CancelIcon sx={{ fontSize: 18, color: '#C62828', mr: 1 }} />
          Cancel Appointment
        </MenuItem>
      </Menu>
    </Paper>
  );
};
