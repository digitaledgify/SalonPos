import React from 'react';
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
  Avatar,
  Chip,
  Button,
  Grid,
  IconButton,
  Tooltip,
} from '@mui/material';
import PercentIcon from '@mui/icons-material/Percent';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import EditIcon from '@mui/icons-material/Edit';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { useEmployees } from './EmployeesContext';
import { useDashboard } from '../../context/DashboardContext';

export const CommissionPayrollTab: React.FC = () => {
  const {
    employees,
    setCommissionEmployee,
    setIsAdjustCommissionModalOpen,
    togglePayoutStatus,
  } = useEmployees();
  const { showToast } = useDashboard();

  // Summary Metrics
  const totalBaseSalaryMonth = employees.reduce((acc, curr) => acc + curr.baseSalary, 0);
  const totalCommissionEarnedMonth = employees.reduce((acc, curr) => acc + curr.commissionEarnedMonth, 0);
  const totalPayrollEstimate = totalBaseSalaryMonth + totalCommissionEarnedMonth;

  const handleExportPayroll = () => {
    showToast('Exporting monthly payroll & commission statement CSV...');
  };

  return (
    <Box>
      {/* Financial Summary Cards */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: '16px', bgcolor: '#FFFFFF', border: '1px solid #E8DFD5' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <CurrencyRupeeIcon sx={{ color: '#6A3F4D' }} />
              <Typography variant="caption" sx={{ color: '#6E5C63', fontWeight: 800, textTransform: 'uppercase' }}>
                Monthly Base Salary Overhead
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#2D1F24', fontSize: '1.6rem' }}>
              ₹{totalBaseSalaryMonth.toLocaleString('en-IN')}
            </Typography>
            <Typography variant="caption" sx={{ color: '#6E5C63' }}>
              Fixed monthly payroll commitment
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: '16px', bgcolor: '#F8F4EE', border: '1px solid #EBD9DF' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <PercentIcon sx={{ color: '#A8828F' }} />
              <Typography variant="caption" sx={{ color: '#6A3F4D', fontWeight: 800, textTransform: 'uppercase' }}>
                Total Commission Payable
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#6A3F4D', fontSize: '1.6rem' }}>
              ₹{totalCommissionEarnedMonth.toLocaleString('en-IN')}
            </Typography>
            <Typography variant="caption" sx={{ color: '#6E5C63' }}>
              Performance-based commissions earned this month
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <Paper elevation={0} sx={{ p: 2.5, borderRadius: '16px', bgcolor: '#F4F9F4', border: '1px solid #C8E6C9' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <ReceiptLongIcon sx={{ color: '#2E7D32' }} />
              <Typography variant="caption" sx={{ color: '#2E7D32', fontWeight: 800, textTransform: 'uppercase' }}>
                Est. Total Monthly Payroll
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#1B5E20', fontSize: '1.6rem' }}>
              ₹{totalPayrollEstimate.toLocaleString('en-IN')}
            </Typography>
            <Typography variant="caption" sx={{ color: '#388E3C' }}>
              Base Salary + Commission total
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Main Table */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: '16px',
          bgcolor: '#FFFFFF',
          border: '1px solid #E8DFD5',
          overflow: 'hidden',
        }}
      >
        <Box sx={{ p: 2.5, bgcolor: '#F8F4EE', borderBottom: '1px solid #E8DFD5', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#2D1F24', fontSize: '1.1rem' }}>
              Staff Commission & Earnings Statement
            </Typography>
            <Typography variant="body2" sx={{ color: '#6E5C63' }}>
              Real-time breakdown of service revenue generated, commission percentage, earned payouts, and tips.
            </Typography>
          </Box>

          <Button
            variant="outlined"
            onClick={handleExportPayroll}
            sx={{
              borderColor: '#A8828F',
              color: '#6A3F4D',
              fontWeight: 700,
              textTransform: 'none',
              borderRadius: '10px',
              px: 2,
              '&:hover': { bgcolor: '#F8F4EE', borderColor: '#6A3F4D' },
            }}
          >
            Export Statement (CSV)
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead sx={{ bgcolor: '#FFFDF9' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 800, color: '#6A3F4D' }}>Staff Member</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#6A3F4D' }}>Base Salary</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#6A3F4D' }}>Comm. Rate</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#6A3F4D' }}>Today's Sales</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#6A3F4D' }}>Today's Comm.</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#6A3F4D' }}>Month's Comm.</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#6A3F4D' }}>Today's Tips</TableCell>
                <TableCell sx={{ fontWeight: 800, color: '#6A3F4D' }}>Payout Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: 800, color: '#6A3F4D' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.map((emp) => {
                const isPaid = emp.payoutStatus === 'Paid';

                return (
                  <TableRow key={emp.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar src={emp.avatarUrl} alt={emp.name} sx={{ width: 40, height: 40, border: '2px solid #EBD9DF' }} />
                        <Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#2D1F24' }}>
                            {emp.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: '#6E5C63' }}>
                            {emp.roleTitle}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#2D1F24' }}>
                        ₹{emp.baseSalary.toLocaleString('en-IN')}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#6E5C63' }}>/ month</Typography>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={`${emp.commissionRate}%`}
                        size="small"
                        sx={{ bgcolor: '#F8F4EE', color: '#6A3F4D', fontWeight: 800, height: 24 }}
                      />
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 800, color: '#2E7D32' }}>
                        ₹{emp.todaySales.toLocaleString('en-IN')}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#6E5C63' }}>
                        ({emp.completedAppointmentsCount} appts)
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 800, color: '#6A3F4D' }}>
                        ₹{emp.commissionEarnedToday.toLocaleString('en-IN')}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 800, color: '#2D1F24' }}>
                        ₹{emp.commissionEarnedMonth.toLocaleString('en-IN')}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: '#1565C0' }}>
                        ₹{emp.tipsToday.toLocaleString('en-IN')}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Chip
                        icon={isPaid ? <CheckCircleIcon sx={{ fontSize: '14px !important', color: '#2E7D32 !important' }} /> : <PendingIcon sx={{ fontSize: '14px !important', color: '#ED6C02 !important' }} />}
                        label={isPaid ? 'Paid' : 'Pending'}
                        onClick={() => togglePayoutStatus(emp.id)}
                        sx={{
                          cursor: 'pointer',
                          fontWeight: 800,
                          fontSize: '0.75rem',
                          height: 26,
                          bgcolor: isPaid ? '#E8F5E9' : '#FFF3E0',
                          color: isPaid ? '#2E7D32' : '#ED6C02',
                        }}
                      />
                    </TableCell>

                    <TableCell align="right">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                        <Tooltip title="Adjust Commission Rate">
                          <IconButton
                            size="small"
                            onClick={() => {
                              setCommissionEmployee(emp);
                              setIsAdjustCommissionModalOpen(true);
                            }}
                            sx={{ color: '#6A3F4D', border: '1px solid #E8DFD5', borderRadius: '8px' }}
                          >
                            <EditIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};
