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
  TablePagination,
  TableSortLabel,
  Avatar,
  IconButton,
  Chip,
  Typography,
  Tooltip,
  Menu,
  MenuItem,
  Button,
  Grid,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ReceiptIcon from '@mui/icons-material/Receipt';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PhoneIcon from '@mui/icons-material/Phone';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import CakeIcon from '@mui/icons-material/Cake';
import { Customer } from '../../types/customer';
import { useCustomers } from '../../context/CustomerContext';
import { MembershipBadge } from './MembershipBadge';

export const CustomerTable: React.FC = () => {
  const {
    customers,
    setSelectedCustomer,
    setIsCustomerFormOpen,
    setCustomerToEdit,
    deleteCustomer,
    setIsBookingOpen,
    setIsBillingOpen,
    setTargetCustomerForAction,
  } = useCustomers();

  // Pagination State
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Sorting State
  const [orderBy, setOrderBy] = useState<keyof Customer>('id');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  // Actions Menu State
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [activeMenuCustomer, setActiveMenuCustomer] = useState<Customer | null>(null);

  const handleSort = (property: keyof Customer) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (_: any, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenMenu = (e: React.MouseEvent<HTMLButtonElement>, c: Customer) => {
    e.stopPropagation();
    setMenuAnchorEl(e.currentTarget);
    setActiveMenuCustomer(c);
  };

  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
    setActiveMenuCustomer(null);
  };

  const handleView = (c: Customer) => {
    setSelectedCustomer(c);
  };

  const handleEdit = (c: Customer) => {
    setCustomerToEdit(c);
    setIsCustomerFormOpen(true);
    handleCloseMenu();
  };

  const handleDelete = (c: Customer) => {
    if (window.confirm(`Are you sure you want to delete customer ${c.fullName}?`)) {
      deleteCustomer(c.id);
      handleCloseMenu();
    }
  };

  const handleBook = (c: Customer) => {
    setTargetCustomerForAction(c);
    setIsBookingOpen(true);
    handleCloseMenu();
  };

  const handleBill = (c: Customer) => {
    setTargetCustomerForAction(c);
    setIsBillingOpen(true);
    handleCloseMenu();
  };

  // Sort logic for local page slice
  const sortedCustomers = [...customers].sort((a, b) => {
    let aVal: any = a[orderBy];
    let bVal: any = b[orderBy];

    if (orderBy === 'membership') {
      aVal = a.membership.tier;
      bVal = b.membership.tier;
    } else if (orderBy === 'loyalty') {
      aVal = a.loyalty.availablePoints;
      bVal = b.loyalty.availablePoints;
    }

    if (bVal < aVal) return order === 'asc' ? 1 : -1;
    if (bVal > aVal) return order === 'asc' ? -1 : 1;
    return 0;
  });

  const paginatedCustomers = sortedCustomers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box>
      {/* Desktop & Tablet Table View */}
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <Paper
          elevation={0}
          sx={{
            borderRadius: '16px',
            border: '1px solid #E8DFD5',
            boxShadow: '0 4px 20px rgba(107, 79, 58, 0.04)',
            overflow: 'hidden',
          }}
        >
          <TableContainer sx={{ maxHeight: 680 }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ bgcolor: '#F8F4EE', fontWeight: 800, color: '#6A3F4D', py: 1.5 }}>
                    Photo
                  </TableCell>

                  <TableCell sx={{ bgcolor: '#F8F4EE', fontWeight: 800, color: '#6A3F4D' }}>
                    <TableSortLabel
                      active={orderBy === 'id'}
                      direction={orderBy === 'id' ? order : 'asc'}
                      onClick={() => handleSort('id')}
                    >
                      Customer ID
                    </TableSortLabel>
                  </TableCell>

                  <TableCell sx={{ bgcolor: '#F8F4EE', fontWeight: 800, color: '#6A3F4D' }}>
                    <TableSortLabel
                      active={orderBy === 'fullName'}
                      direction={orderBy === 'fullName' ? order : 'asc'}
                      onClick={() => handleSort('fullName')}
                    >
                      Name
                    </TableSortLabel>
                  </TableCell>

                  <TableCell sx={{ bgcolor: '#F8F4EE', fontWeight: 800, color: '#6A3F4D' }}>
                    Phone
                  </TableCell>

                  <TableCell sx={{ bgcolor: '#F8F4EE', fontWeight: 800, color: '#6A3F4D' }}>
                    Gender
                  </TableCell>

                  <TableCell sx={{ bgcolor: '#F8F4EE', fontWeight: 800, color: '#6A3F4D' }}>
                    Birthday
                  </TableCell>

                  <TableCell sx={{ bgcolor: '#F8F4EE', fontWeight: 800, color: '#6A3F4D' }}>
                    Membership
                  </TableCell>

                  <TableCell align="right" sx={{ bgcolor: '#F8F4EE', fontWeight: 800, color: '#6A3F4D' }}>
                    Points
                  </TableCell>

                  <TableCell align="right" sx={{ bgcolor: '#F8F4EE', fontWeight: 800, color: '#6A3F4D' }}>
                    <TableSortLabel
                      active={orderBy === 'visitsCount'}
                      direction={orderBy === 'visitsCount' ? order : 'asc'}
                      onClick={() => handleSort('visitsCount')}
                    >
                      Visits
                    </TableSortLabel>
                  </TableCell>

                  <TableCell align="right" sx={{ bgcolor: '#F8F4EE', fontWeight: 800, color: '#6A3F4D' }}>
                    <TableSortLabel
                      active={orderBy === 'lifetimeSpend'}
                      direction={orderBy === 'lifetimeSpend' ? order : 'asc'}
                      onClick={() => handleSort('lifetimeSpend')}
                    >
                      Lifetime Spend
                    </TableSortLabel>
                  </TableCell>

                  <TableCell sx={{ bgcolor: '#F8F4EE', fontWeight: 800, color: '#6A3F4D' }}>
                    Last Visit
                  </TableCell>

                  <TableCell sx={{ bgcolor: '#F8F4EE', fontWeight: 800, color: '#6A3F4D' }}>
                    Status
                  </TableCell>

                  <TableCell align="center" sx={{ bgcolor: '#F8F4EE', fontWeight: 800, color: '#6A3F4D' }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {paginatedCustomers.map((c) => (
                  <TableRow
                    key={c.id}
                    hover
                    onClick={() => handleView(c)}
                    sx={{
                      cursor: 'pointer',
                      '&:hover': { bgcolor: '#F8F4EE' },
                    }}
                  >
                    <TableCell>
                      <Avatar src={c.photoUrl} alt={c.fullName} sx={{ width: 38, height: 38, border: '1px solid #E8DFD5' }} />
                    </TableCell>

                    <TableCell sx={{ fontWeight: 800, color: '#6A3F4D', fontSize: '0.82rem' }}>
                      {c.id}
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 800, color: '#2D1F24', fontSize: '0.88rem' }}>
                        {c.fullName}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#6E5C63' }}>
                        {c.email}
                      </Typography>
                    </TableCell>

                    <TableCell sx={{ fontSize: '0.82rem', color: '#2D1F24', fontWeight: 600 }}>
                      {c.phone}
                    </TableCell>

                    <TableCell sx={{ fontSize: '0.82rem', color: '#6E5C63' }}>
                      {c.gender}
                    </TableCell>

                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {c.isBirthdayToday && <CakeIcon sx={{ fontSize: 16, color: '#D81B60' }} />}
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: c.isBirthdayToday ? 800 : 500,
                            color: c.isBirthdayToday ? '#D81B60' : '#2D1F24',
                          }}
                        >
                          {c.birthdayFormatted}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <MembershipBadge tier={c.membership.tier} />
                    </TableCell>

                    <TableCell align="right">
                      <Chip
                        label={`${c.loyalty.availablePoints} pts`}
                        size="small"
                        sx={{ bgcolor: '#F8F4EE', color: '#6A3F4D', fontWeight: 800, fontSize: '0.72rem', border: '1px solid #E8DFD5' }}
                      />
                    </TableCell>

                    <TableCell align="right" sx={{ fontWeight: 700, color: '#2D1F24' }}>
                      {c.visitsCount}
                    </TableCell>

                    <TableCell align="right" sx={{ fontWeight: 800, color: '#2E7D32' }}>
                      ₹{c.lifetimeSpend.toLocaleString()}
                    </TableCell>

                    <TableCell sx={{ fontSize: '0.8rem', color: '#6E5C63' }}>
                      {c.lastVisitDate}
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={c.status}
                        size="small"
                        color={c.status === 'VIP' ? 'secondary' : c.status === 'Active' ? 'success' : 'default'}
                        sx={{ height: 22, fontSize: '0.68rem', fontWeight: 800 }}
                      />
                    </TableCell>

                    <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                        <Tooltip title="View Profile">
                          <IconButton size="small" onClick={() => handleView(c)} sx={{ color: '#6A3F4D' }}>
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Edit Profile">
                          <IconButton size="small" onClick={() => handleEdit(c)} sx={{ color: '#1565C0' }}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <IconButton size="small" onClick={(e) => handleOpenMenu(e, c)} sx={{ color: '#6E5C63' }}>
                          <MoreVertIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={customers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{ borderTop: '1px solid #E8DFD5', bgcolor: '#F8F4EE' }}
          />
        </Paper>
      </Box>

      {/* Mobile Card List View (Tables become cards on small screens) */}
      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        <Grid container spacing={2}>
          {paginatedCustomers.map((c) => (
            <Grid size={12} key={c.id}>
              <Paper
                elevation={0}
                onClick={() => handleView(c)}
                sx={{
                  p: 2,
                  borderRadius: '16px',
                  bgcolor: '#FFFFFF',
                  border: '1px solid #E8DFD5',
                  boxShadow: '0 4px 16px rgba(107, 79, 58, 0.04)',
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar src={c.photoUrl} alt={c.fullName} sx={{ width: 44, height: 44, border: '2px solid #EBD9DF' }} />
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 800, color: '#2D1F24' }}>
                        {c.fullName}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#6A3F4D', fontWeight: 700 }}>
                        {c.id} • {c.phone}
                      </Typography>
                    </Box>
                  </Box>
                  <MembershipBadge tier={c.membership.tier} />
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, my: 1.5, p: 1.5, bgcolor: '#F8F4EE', borderRadius: '10px' }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: '#6E5C63' }}>Spend</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 800, color: '#2E7D32' }}>₹{c.lifetimeSpend.toLocaleString()}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: '#6E5C63' }}>Visits</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 800, color: '#2D1F24' }}>{c.visitsCount}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: '#6E5C63' }}>Points</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 800, color: '#6A3F4D' }}>{c.loyalty.availablePoints}</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, mt: 1.5 }}>
                  <Button size="small" variant="contained" fullWidth onClick={() => handleView(c)} sx={{ bgcolor: '#6A3F4D' }}>
                    View Profile
                  </Button>
                  <Button size="small" variant="outlined" onClick={(e) => handleOpenMenu(e, c)} sx={{ minWidth: 40, borderColor: '#A8828F' }}>
                    <MoreVertIcon fontSize="small" sx={{ color: '#6A3F4D' }} />
                  </Button>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 2 }}>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={customers.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      </Box>

      {/* Row Actions Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleCloseMenu}
        slotProps={{
          paper: { sx: { borderRadius: '12px', boxShadow: '0 8px 24px rgba(107, 79, 58, 0.15)', minWidth: 180 } },
        }}
      >
        {activeMenuCustomer && (
          <>
            <MenuItem onClick={() => { handleView(activeMenuCustomer); handleCloseMenu(); }} sx={{ gap: 1.5, fontSize: '0.85rem', fontWeight: 600 }}>
              <VisibilityIcon sx={{ fontSize: 18, color: '#6A3F4D' }} /> View Full Profile
            </MenuItem>

            <MenuItem onClick={() => handleEdit(activeMenuCustomer)} sx={{ gap: 1.5, fontSize: '0.85rem', fontWeight: 600 }}>
              <EditIcon sx={{ fontSize: 18, color: '#1565C0' }} /> Edit Details
            </MenuItem>

            <MenuItem onClick={() => handleBook(activeMenuCustomer)} sx={{ gap: 1.5, fontSize: '0.85rem', fontWeight: 600 }}>
              <CalendarMonthIcon sx={{ fontSize: 18, color: '#6A3F4D' }} /> Add Appointment
            </MenuItem>

            <MenuItem onClick={() => handleBill(activeMenuCustomer)} sx={{ gap: 1.5, fontSize: '0.85rem', fontWeight: 600 }}>
              <ReceiptIcon sx={{ fontSize: 18, color: '#2E7D32' }} /> Generate Bill
            </MenuItem>

            <MenuItem
              onClick={() => {
                window.location.href = `tel:${activeMenuCustomer.phone}`;
                handleCloseMenu();
              }}
              sx={{ gap: 1.5, fontSize: '0.85rem', fontWeight: 600 }}
            >
              <PhoneIcon sx={{ fontSize: 18, color: '#1565C0' }} /> Call Customer
            </MenuItem>

            <MenuItem
              onClick={() => {
                const text = encodeURIComponent(`Hi ${activeMenuCustomer.firstName}, warm greetings from our Salon!`);
                window.open(`https://wa.me/${activeMenuCustomer.phone.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
                handleCloseMenu();
              }}
              sx={{ gap: 1.5, fontSize: '0.85rem', fontWeight: 600 }}
            >
              <WhatsAppIcon sx={{ fontSize: 18, color: '#25D366' }} /> WhatsApp Customer
            </MenuItem>

            <MenuItem onClick={() => handleDelete(activeMenuCustomer)} sx={{ gap: 1.5, fontSize: '0.85rem', fontWeight: 600, color: '#D32F2F' }}>
              <DeleteIcon sx={{ fontSize: 18, color: '#D32F2F' }} /> Delete Customer
            </MenuItem>
          </>
        )}
      </Menu>
    </Box>
  );
};
