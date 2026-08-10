import React, { useState } from 'react';
import {
  Grid,
  Paper,
  Box,
  Typography,
  Avatar,
  Chip,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PercentIcon from '@mui/icons-material/Percent';
import DeleteOutlineIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import StarIcon from '@mui/icons-material/Star';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import BadgeIcon from '@mui/icons-material/Badge';
import { Employee, EmployeeStatus } from '../../types/employee';
import { useEmployees } from './EmployeesContext';

export const StaffDirectoryTab: React.FC = () => {
  const {
    filteredEmployees,
    filters,
    setSelectedEmployee,
    setIsDetailDrawerOpen,
    setIsAddEditModalOpen,
    setEditingEmployee,
    setIsAssignShiftModalOpen,
    setShiftAssignEmployee,
    setIsAdjustCommissionModalOpen,
    setCommissionEmployee,
    deleteEmployee,
  } = useEmployees();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [activeEmpForMenu, setActiveEmpForMenu] = useState<Employee | null>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, emp: Employee) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setActiveEmpForMenu(emp);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setActiveEmpForMenu(null);
  };

  const handleViewProfile = (emp: Employee) => {
    setSelectedEmployee(emp);
    setIsDetailDrawerOpen(true);
  };

  const handleEdit = (emp: Employee) => {
    setEditingEmployee(emp);
    setIsAddEditModalOpen(true);
    handleCloseMenu();
  };

  const handleAssignShift = (emp: Employee) => {
    setShiftAssignEmployee(emp);
    setIsAssignShiftModalOpen(true);
    handleCloseMenu();
  };

  const handleAdjustCommission = (emp: Employee) => {
    setCommissionEmployee(emp);
    setIsAdjustCommissionModalOpen(true);
    handleCloseMenu();
  };

  const handleDelete = (emp: Employee) => {
    if (window.confirm(`Are you sure you want to remove staff member "${emp.name}"?`)) {
      deleteEmployee(emp.id);
    }
    handleCloseMenu();
  };

  const getStatusChip = (status: EmployeeStatus) => {
    switch (status) {
      case 'On Shift':
        return <Chip label="On Shift" size="small" sx={{ bgcolor: '#E8F5E9', color: '#2E7D32', fontWeight: 800, height: 22, fontSize: '0.7rem' }} />;
      case 'Active':
        return <Chip label="Active" size="small" sx={{ bgcolor: '#E3F2FD', color: '#0288D1', fontWeight: 800, height: 22, fontSize: '0.7rem' }} />;
      case 'On Leave':
        return <Chip label="On Leave" size="small" sx={{ bgcolor: '#FFF8E1', color: '#F57F17', fontWeight: 800, height: 22, fontSize: '0.7rem' }} />;
      case 'Off Duty':
        return <Chip label="Off Duty" size="small" sx={{ bgcolor: '#F5F5F5', color: '#616161', fontWeight: 800, height: 22, fontSize: '0.7rem' }} />;
      default:
        return <Chip label={status} size="small" sx={{ height: 22, fontSize: '0.7rem' }} />;
    }
  };

  if (filteredEmployees.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 6,
          borderRadius: '16px',
          bgcolor: '#FFFFFF',
          border: '1px solid #E8DFD5',
          textAlign: 'center',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 800, color: '#2D1F24', mb: 1 }}>
          No Staff Members Found
        </Typography>
        <Typography variant="body2" sx={{ color: '#6E5C63' }}>
          No employees match your selected search criteria or filters. Try adjusting your filters or search query.
        </Typography>
      </Paper>
    );
  }

  if (filters.viewMode === 'table') {
    return (
      <Paper
        elevation={0}
        sx={{
          borderRadius: '16px',
          bgcolor: '#FFFFFF',
          border: '1px solid #E8DFD5',
          overflow: 'hidden',
        }}
      >
        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#F8F4EE' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 800, color: '#6A3F4D' }}>Staff Member</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#6A3F4D' }}>Department & Role</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#6A3F4D' }}>Contact</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#6A3F4D' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#6A3F4D' }}>Commission Rate</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#6A3F4D' }}>Today's Sales</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#6A3F4D' }}>Commission Earned</TableCell>
                <TableCell align="right" sx={{ fontWeight: 800, color: '#6A3F4D' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEmployees.map((emp) => (
                <TableRow
                  key={emp.id}
                  hover
                  onClick={() => handleViewProfile(emp)}
                  sx={{ cursor: 'pointer', '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar src={emp.avatarUrl} alt={emp.name} sx={{ width: 40, height: 40, border: '2px solid #EBD9DF' }} />
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#2D1F24' }}>
                          {emp.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <StarIcon sx={{ fontSize: 14, color: '#FFB300' }} />
                          <Typography variant="caption" sx={{ color: '#6E5C63', fontWeight: 700 }}>
                            {emp.rating}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#2D1F24' }}>
                      {emp.roleTitle}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#6E5C63' }}>
                      {emp.department}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" sx={{ display: 'block', color: '#2D1F24', fontWeight: 600 }}>
                      {emp.phone}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#6E5C63' }}>
                      {emp.email}
                    </Typography>
                  </TableCell>
                  <TableCell>{getStatusChip(emp.status)}</TableCell>
                  <TableCell>
                    <Chip
                      label={`${emp.commissionRate}%`}
                      size="small"
                      sx={{ bgcolor: '#F8F4EE', color: '#6A3F4D', fontWeight: 800, height: 24, fontSize: '0.78rem' }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 800, color: '#2E7D32' }}>
                      ₹{emp.todaySales.toLocaleString('en-IN')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 800, color: '#6A3F4D' }}>
                      ₹{emp.commissionEarnedToday.toLocaleString('en-IN')}
                    </Typography>
                  </TableCell>
                  <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                    <IconButton size="small" onClick={(e) => handleOpenMenu(e, emp)}>
                      <MoreVertIcon sx={{ color: '#6E5C63' }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Action Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleCloseMenu}
          slotProps={{
            paper: {
              elevation: 3,
              sx: { borderRadius: '12px', minWidth: 180, border: '1px solid #E8DFD5' },
            },
          }}
        >
          {activeEmpForMenu && (
            <>
              <MenuItem onClick={() => handleViewProfile(activeEmpForMenu)}>
                <ListItemIcon><VisibilityIcon fontSize="small" sx={{ color: '#6A3F4D' }} /></ListItemIcon>
                <ListItemText primary="View Full Profile" />
              </MenuItem>
              <MenuItem onClick={() => handleEdit(activeEmpForMenu)}>
                <ListItemIcon><EditIcon fontSize="small" sx={{ color: '#0288D1' }} /></ListItemIcon>
                <ListItemText primary="Edit Details" />
              </MenuItem>
              <MenuItem onClick={() => handleAssignShift(activeEmpForMenu)}>
                <ListItemIcon><CalendarMonthIcon fontSize="small" sx={{ color: '#2E7D32' }} /></ListItemIcon>
                <ListItemText primary="Assign Shift Roster" />
              </MenuItem>
              <MenuItem onClick={() => handleAdjustCommission(activeEmpForMenu)}>
                <ListItemIcon><PercentIcon fontSize="small" sx={{ color: '#E65100' }} /></ListItemIcon>
                <ListItemText primary="Set Commission %" />
              </MenuItem>
              <MenuItem onClick={() => handleDelete(activeEmpForMenu)}>
                <ListItemIcon><DeleteOutlineIcon fontSize="small" sx={{ color: '#C62828' }} /></ListItemIcon>
                <ListItemText primary="Delete Staff" slotProps={{ primary: { color: 'error' } }} />
              </MenuItem>
            </>
          )}
        </Menu>
      </Paper>
    );
  }

  // Grid View Cards
  return (
    <Grid container spacing={2.5}>
      {filteredEmployees.map((emp) => (
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={emp.id}>
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: '16px',
              bgcolor: '#FFFFFF',
              border: '1px solid #E8DFD5',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '100%',
              position: 'relative',
              transition: 'all 0.2s ease',
              '&:hover': {
                boxShadow: '0 8px 24px rgba(107, 79, 58, 0.1)',
                borderColor: '#A8828F',
              },
            }}
          >
            {/* Top Row: Avatar & Status & Options */}
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box sx={{ position: 'relative' }}>
                  <Avatar
                    src={emp.avatarUrl}
                    alt={emp.name}
                    sx={{ width: 56, height: 56, border: '3px solid #EBD9DF', boxShadow: '0 4px 10px rgba(0,0,0,0.06)' }}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: -2,
                      right: -2,
                      bgcolor: '#FFFFFF',
                      borderRadius: '50%',
                      p: '2px',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: '#FFF8E1', px: 0.6, py: 0.1, borderRadius: '10px', border: '1px solid #FFE082' }}>
                      <StarIcon sx={{ fontSize: 12, color: '#FFB300' }} />
                      <Typography variant="caption" sx={{ fontSize: '0.65rem', fontWeight: 800, color: '#2D1F24', ml: 0.3 }}>
                        {emp.rating}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {getStatusChip(emp.status)}
                  <IconButton size="small" onClick={(e) => handleOpenMenu(e, emp)}>
                    <MoreVertIcon sx={{ color: '#6E5C63' }} />
                  </IconButton>
                </Box>
              </Box>

              {/* Name & Role */}
              <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.05rem', color: '#2D1F24', lineHeight: 1.2 }}>
                {emp.name}
              </Typography>
              <Typography variant="body2" sx={{ color: '#6E5C63', fontWeight: 600, fontSize: '0.85rem', mb: 1.5 }}>
                {emp.roleTitle}
              </Typography>

              {/* Department & Start Date */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                <Chip
                  icon={<BadgeIcon sx={{ fontSize: '14px !important', color: '#6A3F4D !important' }} />}
                  label={emp.department}
                  size="small"
                  sx={{ bgcolor: '#F8F4EE', color: '#6A3F4D', fontWeight: 700, fontSize: '0.72rem', height: 24 }}
                />
                <Typography variant="caption" sx={{ color: '#6E5C63', fontSize: '0.72rem' }}>
                  Joined {emp.startDate}
                </Typography>
              </Box>

              {/* Contact info */}
              <Box sx={{ bgcolor: '#F8F4EE', p: 1.2, borderRadius: '10px', mb: 2, border: '1px solid #F5EFE6' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <PhoneIcon sx={{ fontSize: 14, color: '#6E5C63' }} />
                  <Typography variant="caption" sx={{ fontWeight: 600, color: '#2D1F24' }}>
                    {emp.phone}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <EmailIcon sx={{ fontSize: 14, color: '#6E5C63' }} />
                  <Typography variant="caption" sx={{ color: '#6E5C63', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {emp.email}
                  </Typography>
                </Box>
              </Box>

              {/* Performance & Commission metrics bar */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', bgcolor: '#FFFDF9', p: 1.5, borderRadius: '10px', border: '1px solid #E8DFD5', mb: 2 }}>
                <Box>
                  <Typography variant="caption" sx={{ color: '#6E5C63', fontWeight: 700, display: 'block', fontSize: '0.68rem', textTransform: 'uppercase' }}>
                    Comm. Rate
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#6A3F4D' }}>
                    {emp.commissionRate}%
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="caption" sx={{ color: '#6E5C63', fontWeight: 700, display: 'block', fontSize: '0.68rem', textTransform: 'uppercase' }}>
                    Today's Comm.
                  </Typography>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#2E7D32' }}>
                    ₹{emp.commissionEarnedToday.toLocaleString('en-IN')}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Bottom Card Actions */}
            <Box sx={{ pt: 1, borderTop: '1px solid #F5EFE6', display: 'flex', gap: 1 }}>
              <Button
                fullWidth
                size="small"
                variant="outlined"
                onClick={() => handleViewProfile(emp)}
                sx={{
                  borderColor: '#A8828F',
                  color: '#6A3F4D',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  borderRadius: '8px',
                  py: 0.6,
                  textTransform: 'none',
                  '&:hover': {
                    bgcolor: '#F8F4EE',
                    borderColor: '#6A3F4D',
                  },
                }}
              >
                View Profile
              </Button>
              <Tooltip title="Assign Shifts">
                <IconButton
                  size="small"
                  onClick={() => handleAssignShift(emp)}
                  sx={{ border: '1px solid #E8DFD5', borderRadius: '8px', color: '#6A3F4D' }}
                >
                  <CalendarMonthIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
            </Box>
          </Paper>
        </Grid>
      ))}

      {/* Shared Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        slotProps={{
          paper: {
            elevation: 3,
            sx: { borderRadius: '12px', minWidth: 180, border: '1px solid #E8DFD5' },
          },
        }}
      >
        {activeEmpForMenu && (
          <>
            <MenuItem onClick={() => handleViewProfile(activeEmpForMenu)}>
              <ListItemIcon><VisibilityIcon fontSize="small" sx={{ color: '#6A3F4D' }} /></ListItemIcon>
              <ListItemText primary="View Full Profile" />
            </MenuItem>
            <MenuItem onClick={() => handleEdit(activeEmpForMenu)}>
              <ListItemIcon><EditIcon fontSize="small" sx={{ color: '#0288D1' }} /></ListItemIcon>
              <ListItemText primary="Edit Details" />
            </MenuItem>
            <MenuItem onClick={() => handleAssignShift(activeEmpForMenu)}>
              <ListItemIcon><CalendarMonthIcon fontSize="small" sx={{ color: '#2E7D32' }} /></ListItemIcon>
              <ListItemText primary="Assign Shift Roster" />
            </MenuItem>
            <MenuItem onClick={() => handleAdjustCommission(activeEmpForMenu)}>
              <ListItemIcon><PercentIcon fontSize="small" sx={{ color: '#E65100' }} /></ListItemIcon>
              <ListItemText primary="Set Commission %" />
            </MenuItem>
            <MenuItem onClick={() => handleDelete(activeEmpForMenu)}>
              <ListItemIcon><DeleteOutlineIcon fontSize="small" sx={{ color: '#C62828' }} /></ListItemIcon>
              <ListItemText primary="Delete Staff" slotProps={{ primary: { color: 'error' } }} />
            </MenuItem>
          </>
        )}
      </Menu>
    </Grid>
  );
};
