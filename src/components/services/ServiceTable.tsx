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
  Button,
  Switch,
  Menu,
  MenuItem,
  Avatar,
  TablePagination,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';
import { SalonService } from '../../types/service';
import { useServices } from '../../context/ServiceContext';

export const ServiceTable: React.FC = () => {
  const {
    filteredServices,
    setSelectedService,
    setServiceToEdit,
    setIsServiceFormOpen,
    deleteService,
    toggleServiceStatus,
    setServiceForBooking,
  } = useServices();

  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [activeService, setActiveService] = useState<SalonService | null>(null);

  const handleOpenMenu = (e: React.MouseEvent<HTMLButtonElement>, service: SalonService) => {
    e.stopPropagation();
    setMenuAnchorEl(e.currentTarget);
    setActiveService(service);
  };

  const handleCloseMenu = () => {
    setMenuAnchorEl(null);
    setActiveService(null);
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const paginatedServices = filteredServices.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: '16px',
        bgcolor: '#FFFFFF',
        border: '1px solid #E8DFD5',
        overflow: 'hidden',
        boxShadow: '0 2px 10px rgba(107, 79, 58, 0.04)',
      }}
    >
      <TableContainer>
        <Table sx={{ minWidth: 800 }}>
          <TableHead sx={{ bgcolor: '#F8F4EE' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 800, color: '#6A3F4D', py: 1.8 }}>Service Details</TableCell>
              <TableCell sx={{ fontWeight: 800, color: '#6A3F4D', py: 1.8 }}>Category & Target</TableCell>
              <TableCell sx={{ fontWeight: 800, color: '#6A3F4D', py: 1.8 }}>Duration</TableCell>
              <TableCell sx={{ fontWeight: 800, color: '#6A3F4D', py: 1.8 }}>Price (Base / Member)</TableCell>
              <TableCell sx={{ fontWeight: 800, color: '#6A3F4D', py: 1.8 }}>Bookings & Rating</TableCell>
              <TableCell sx={{ fontWeight: 800, color: '#6A3F4D', py: 1.8 }}>Status</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800, color: '#6A3F4D', py: 1.8 }}>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedServices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                  <Typography variant="subtitle1" sx={{ color: '#6E5C63', fontWeight: 700 }}>
                    No services found matching the criteria.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedServices.map((srv) => {
                const memberPrice = Math.round(
                  srv.basePrice * (1 - srv.memberDiscountPercent / 100)
                );

                return (
                  <TableRow
                    key={srv.id}
                    hover
                    onClick={() => setSelectedService(srv)}
                    sx={{
                      cursor: 'pointer',
                      '&:last-child td, &:last-child th': { border: 0 },
                    }}
                  >
                    {/* Code, Image & Name */}
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                          src={srv.imageUrl}
                          variant="rounded"
                          sx={{ width: 48, height: 48, borderRadius: '10px' }}
                        />
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="caption" sx={{ fontWeight: 800, color: '#6A3F4D' }}>
                              {srv.code}
                            </Typography>
                            {srv.isPopular && (
                              <Chip label="Popular" size="small" sx={{ bgcolor: '#A8828F', color: '#FFF', height: 18, fontSize: '0.65rem' }} />
                            )}
                          </Box>
                          <Typography variant="body2" sx={{ fontWeight: 800, color: '#2D1F24' }}>
                            {srv.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#6E5C63' }}>
                            💈 {srv.recommendedStylistRole}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    {/* Category & Gender */}
                    <TableCell>
                      <Chip
                        label={srv.category}
                        size="small"
                        sx={{ bgcolor: '#F8F4EE', color: '#6A3F4D', fontWeight: 700, mb: 0.5, border: '1px solid #E8DFD5' }}
                      />
                      <Typography variant="caption" sx={{ display: 'block', color: '#6E5C63', fontWeight: 600 }}>
                        Target: {srv.genderTarget}
                      </Typography>
                    </TableCell>

                    {/* Duration */}
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#2D1F24' }}>
                        ⏱️ {srv.durationMinutes} mins
                      </Typography>
                    </TableCell>

                    {/* Pricing */}
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 800, color: '#2D1F24' }}>
                        ₹{srv.basePrice.toLocaleString('en-IN')}
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: '#2E7D32' }}>
                        Member: ₹{memberPrice.toLocaleString('en-IN')} ({srv.memberDiscountPercent}% OFF)
                      </Typography>
                    </TableCell>

                    {/* Bookings & Rating */}
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <StarIcon sx={{ fontSize: 16, color: '#FFB300' }} />
                        <Typography variant="body2" sx={{ fontWeight: 800 }}>
                          {srv.rating.toFixed(1)}
                        </Typography>
                      </Box>
                      <Typography variant="caption" sx={{ color: '#6E5C63' }}>
                        {srv.totalBookings} total bookings
                      </Typography>
                    </TableCell>

                    {/* Status */}
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Switch
                          size="small"
                          checked={srv.status === 'Active'}
                          onChange={() => toggleServiceStatus(srv.id)}
                        />
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: 700,
                            color: srv.status === 'Active' ? '#2E7D32' : '#D32F2F',
                          }}
                        >
                          {srv.status}
                        </Typography>
                      </Box>
                    </TableCell>

                    {/* Actions */}
                    <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<CalendarMonthIcon sx={{ fontSize: 14 }} />}
                          onClick={() => setServiceForBooking(srv)}
                          sx={{
                            bgcolor: '#6A3F4D',
                            color: '#EBD9DF',
                            borderRadius: '8px',
                            textTransform: 'none',
                            fontWeight: 800,
                            fontSize: '0.75rem',
                            py: 0.4,
                            px: 1.2,
                          }}
                        >
                          Book
                        </Button>
                        <IconButton size="small" onClick={(e) => handleOpenMenu(e, srv)}>
                          <MoreVertIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredServices.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Popup Action Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleCloseMenu}
        slotProps={{ paper: { sx: { borderRadius: '12px', minWidth: 160 } } }}
      >
        <MenuItem
          onClick={() => {
            if (activeService) setSelectedService(activeService);
            handleCloseMenu();
          }}
        >
          <VisibilityIcon sx={{ fontSize: 18, mr: 1, color: '#6A3F4D' }} />
          View Details
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (activeService) {
              setServiceToEdit(activeService);
              setIsServiceFormOpen(true);
            }
            handleCloseMenu();
          }}
        >
          <EditIcon sx={{ fontSize: 18, mr: 1, color: '#1565C0' }} />
          Edit Service
        </MenuItem>
        <MenuItem
          onClick={() => {
            if (activeService && window.confirm(`Delete "${activeService.name}"?`)) {
              deleteService(activeService.id);
            }
            handleCloseMenu();
          }}
          sx={{ color: '#D32F2F' }}
        >
          <DeleteIcon sx={{ fontSize: 18, mr: 1 }} />
          Delete Service
        </MenuItem>
      </Menu>
    </Paper>
  );
};
