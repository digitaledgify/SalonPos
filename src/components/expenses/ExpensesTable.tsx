import React, { useState } from 'react';
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
  Chip,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PendingIcon from '@mui/icons-material/Pending';
import { ExpenseItem } from '../../types/expense';
import { useExpenses } from './ExpensesContext';

export const ExpensesTable: React.FC = () => {
  const {
    expenses,
    searchQuery,
    selectedCategory,
    selectedMethod,
    selectedStatus,
    setEditingExpense,
    setIsAddModalOpen,
    deleteExpense,
    approveExpense,
    setViewingReceiptUrl,
  } = useExpenses();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [activeExpForMenu, setActiveExpForMenu] = useState<ExpenseItem | null>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, exp: ExpenseItem) => {
    setAnchorEl(event.currentTarget);
    setActiveExpForMenu(exp);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
    setActiveExpForMenu(null);
  };

  const handleEdit = (exp: ExpenseItem) => {
    handleCloseMenu();
    setEditingExpense(exp);
    setIsAddModalOpen(true);
  };

  const handleApprove = (exp: ExpenseItem) => {
    handleCloseMenu();
    approveExpense(exp.id);
  };

  const handleDelete = (exp: ExpenseItem) => {
    handleCloseMenu();
    deleteExpense(exp.id);
  };

  // Filtering
  const filteredExpenses = expenses.filter((exp) => {
    const matchesSearch =
      searchQuery === '' ||
      exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.paidTo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.notes?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All Categories' || exp.category === selectedCategory;

    const matchesMethod =
      selectedMethod === 'All Methods' || exp.paymentMethod === selectedMethod;

    const matchesStatus =
      selectedStatus === 'All Statuses' || exp.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesMethod && matchesStatus;
  });

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
      <Box sx={{ p: 2.5, bgcolor: '#F8F4EE', borderBottom: '1px solid #E8DFD5' }}>
        <Typography variant="h6" sx={{ fontWeight: 800, color: '#2D1F24', fontSize: '1.1rem' }}>
          Expense Audit Ledger ({filteredExpenses.length} Records)
        </Typography>
      </Box>

      <TableContainer>
        <Table>
          <TableHead sx={{ bgcolor: '#FFFDF9' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 800, color: '#6A3F4D' }}>ID & Expense Name</TableCell>
              <TableCell sx={{ fontWeight: 800, color: '#6A3F4D' }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 800, color: '#6A3F4D' }}>Vendor / Paid To</TableCell>
              <TableCell sx={{ fontWeight: 800, color: '#6A3F4D' }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 800, color: '#6A3F4D' }}>Payment Mode</TableCell>
              <TableCell sx={{ fontWeight: 800, color: '#6A3F4D' }}>Amount (₹)</TableCell>
              <TableCell sx={{ fontWeight: 800, color: '#6A3F4D' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 800, color: '#6A3F4D' }}>Receipt</TableCell>
              <TableCell align="right" sx={{ fontWeight: 800, color: '#6A3F4D' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredExpenses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                  <Typography variant="body1" sx={{ color: '#6E5C63', fontWeight: 600 }}>
                    No expense records matching the selected filters.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredExpenses.map((exp) => {
                const isApproved = exp.status === 'Approved';

                return (
                  <TableRow key={exp.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#2D1F24' }}>
                        {exp.title}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#6E5C63' }}>
                        #{exp.id} {exp.notes ? `· ${exp.notes}` : ''}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={exp.category}
                        size="small"
                        sx={{ bgcolor: '#F8F4EE', color: '#6A3F4D', fontWeight: 700, fontSize: '0.72rem', height: 24 }}
                      />
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#2D1F24' }}>
                        {exp.paidTo}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#6E5C63' }}>
                        Approved by: {exp.approvedBy}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#2D1F24' }}>
                        {exp.date}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={exp.paymentMethod}
                        size="small"
                        variant="outlined"
                        sx={{ borderColor: '#A8828F', color: '#6A3F4D', fontWeight: 700, height: 22, fontSize: '0.7rem' }}
                      />
                    </TableCell>

                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#2D1F24', fontSize: '1rem' }}>
                        ₹{exp.amount.toLocaleString('en-IN')}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Chip
                        icon={isApproved ? <CheckCircleIcon sx={{ fontSize: '14px !important', color: '#2E7D32 !important' }} /> : <PendingIcon sx={{ fontSize: '14px !important', color: '#ED6C02 !important' }} />}
                        label={exp.status}
                        size="small"
                        sx={{
                          bgcolor: isApproved ? '#E8F5E9' : '#FFF3E0',
                          color: isApproved ? '#2E7D32' : '#ED6C02',
                          fontWeight: 800,
                          fontSize: '0.72rem',
                          height: 24,
                        }}
                      />
                    </TableCell>

                    <TableCell>
                      {exp.receiptUrl ? (
                        <Tooltip title="View Receipt Document">
                          <IconButton
                            size="small"
                            onClick={() => setViewingReceiptUrl(exp.receiptUrl || null)}
                            sx={{ color: '#6A3F4D', bgcolor: '#F8F4EE' }}
                          >
                            <ReceiptIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Typography variant="caption" sx={{ color: '#6E5C63' }}>None</Typography>
                      )}
                    </TableCell>

                    <TableCell align="right">
                      <IconButton size="small" onClick={(e) => handleOpenMenu(e, exp)}>
                        <MoreVertIcon sx={{ color: '#6E5C63' }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
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
            sx: { borderRadius: '12px', minWidth: 170, border: '1px solid #E8DFD5' },
          },
        }}
      >
        {activeExpForMenu && (
          <>
            {activeExpForMenu.status !== 'Approved' && (
              <MenuItem onClick={() => handleApprove(activeExpForMenu)}>
                <ListItemIcon><CheckCircleIcon fontSize="small" sx={{ color: '#2E7D32' }} /></ListItemIcon>
                <ListItemText primary="Approve Claim" slotProps={{ primary: { sx: { fontWeight: 700, color: '#2E7D32' } } }} />
              </MenuItem>
            )}
            <MenuItem onClick={() => handleEdit(activeExpForMenu)}>
              <ListItemIcon><EditIcon fontSize="small" sx={{ color: '#6A3F4D' }} /></ListItemIcon>
              <ListItemText primary="Edit Expense" slotProps={{ primary: { sx: { fontWeight: 600 } } }} />
            </MenuItem>
            <MenuItem onClick={() => handleDelete(activeExpForMenu)}>
              <ListItemIcon><DeleteIcon fontSize="small" sx={{ color: '#C62828' }} /></ListItemIcon>
              <ListItemText primary="Delete Entry" slotProps={{ primary: { sx: { color: 'error.main', fontWeight: 600 } } }} />
            </MenuItem>
          </>
        )}
      </Menu>
    </Paper>
  );
};
