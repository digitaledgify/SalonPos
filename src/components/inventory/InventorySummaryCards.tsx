import React from 'react';
import { Box, Grid, Paper, Typography, LinearProgress } from '@mui/material';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import ErrorIcon from '@mui/icons-material/Error';
import { useInventory } from './InventoryContext';

export const InventorySummaryCards: React.FC = () => {
  const { stats, filters, setFilters } = useInventory();

  const optimalPct = stats.totalItems > 0 ? Math.round((stats.optimalCount / stats.totalItems) * 100) : 0;
  const lowPct = stats.totalItems > 0 ? Math.round((stats.lowCount / stats.totalItems) * 100) : 0;
  const criticalPct = stats.totalItems > 0 ? Math.round((stats.criticalCount / stats.totalItems) * 100) : 0;

  return (
    <Grid container spacing={2.5} sx={{ mb: 3 }}>
      {/* Total Catalog & Valuation */}
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Paper
          elevation={0}
          onClick={() => setFilters((prev) => ({ ...prev, status: 'All' }))}
          sx={{
            p: 2.5,
            borderRadius: '16px',
            bgcolor: '#FFFFFF',
            border: filters.status === 'All' ? '2px solid #6A3F4D' : '1px solid #E8DFD5',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            '&:hover': {
              borderColor: '#6A3F4D',
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 16px rgba(107, 79, 58, 0.08)',
            },
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
            <Box>
              <Typography variant="caption" sx={{ color: '#6E5C63', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Total Catalog
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#2D1F24', mt: 0.5, fontFamily: '"Poppins", sans-serif' }}>
                {stats.totalItems} <Typography component="span" variant="body2" sx={{ color: '#6E5C63', fontWeight: 600, fontFamily: '"Poppins", sans-serif' }}>SKUs</Typography>
              </Typography>
            </Box>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '12px',
                bgcolor: '#F8F4EE',
                color: '#6A3F4D',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #E8DFD5',
              }}
            >
              <Inventory2Icon sx={{ fontSize: 24 }} />
            </Box>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1, borderTop: '1px solid #F7F3EE' }}>
            <Typography variant="caption" sx={{ color: '#6E5C63', fontWeight: 600 }}>
              Total Stock Value:
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 800, color: '#6A3F4D', fontSize: '0.85rem', fontFamily: '"Poppins", sans-serif' }}>
              ₹{stats.totalValuation.toLocaleString('en-IN')}
            </Typography>
          </Box>
        </Paper>
      </Grid>

      {/* Optimal Stock */}
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Paper
          elevation={0}
          onClick={() => setFilters((prev) => ({ ...prev, status: 'Optimal' }))}
          sx={{
            p: 2.5,
            borderRadius: '16px',
            bgcolor: '#FFFFFF',
            border: filters.status === 'Optimal' ? '2px solid #2E7D32' : '1px solid #E8DFD5',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            '&:hover': {
              borderColor: '#2E7D32',
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 16px rgba(46, 125, 50, 0.08)',
            },
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
            <Box>
              <Typography variant="caption" sx={{ color: '#2E7D32', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Optimal Stock
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#2E7D32', mt: 0.5, fontFamily: '"Poppins", sans-serif' }}>
                {stats.optimalCount} <Typography component="span" variant="body2" sx={{ color: '#2E7D32', opacity: 0.8, fontWeight: 600, fontFamily: '"Poppins", sans-serif' }}>({optimalPct}%)</Typography>
              </Typography>
            </Box>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '12px',
                bgcolor: '#F2F9F2',
                color: '#2E7D32',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #C8E6C9',
              }}
            >
              <CheckCircleIcon sx={{ fontSize: 24 }} />
            </Box>
          </Box>

          <Box sx={{ pt: 1, borderTop: '1px solid #F7F3EE' }}>
            <LinearProgress
              variant="determinate"
              value={optimalPct}
              sx={{
                height: 6,
                borderRadius: 3,
                bgcolor: '#E8F5E9',
                '& .MuiLinearProgress-bar': { bgcolor: '#2E7D32' },
              }}
            />
          </Box>
        </Paper>
      </Grid>

      {/* Low Stock Warnings */}
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Paper
          elevation={0}
          onClick={() => setFilters((prev) => ({ ...prev, status: 'Low' }))}
          sx={{
            p: 2.5,
            borderRadius: '16px',
            bgcolor: '#FFFFFF',
            border: filters.status === 'Low' ? '2px solid #ED6C02' : '1px solid #E8DFD5',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            '&:hover': {
              borderColor: '#ED6C02',
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 16px rgba(237, 108, 2, 0.08)',
            },
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
            <Box>
              <Typography variant="caption" sx={{ color: '#ED6C02', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Low Stock Warnings
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#ED6C02', mt: 0.5, fontFamily: '"Poppins", sans-serif' }}>
                {stats.lowCount} <Typography component="span" variant="body2" sx={{ color: '#ED6C02', opacity: 0.8, fontWeight: 600, fontFamily: '"Poppins", sans-serif' }}>({lowPct}%)</Typography>
              </Typography>
            </Box>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '12px',
                bgcolor: '#FFF8F0',
                color: '#ED6C02',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #FFE0B2',
              }}
            >
              <WarningAmberIcon sx={{ fontSize: 24 }} />
            </Box>
          </Box>

          <Box sx={{ pt: 1, borderTop: '1px solid #F7F3EE' }}>
            <LinearProgress
              variant="determinate"
              value={lowPct}
              sx={{
                height: 6,
                borderRadius: 3,
                bgcolor: '#FFF3E0',
                '& .MuiLinearProgress-bar': { bgcolor: '#ED6C02' },
              }}
            />
          </Box>
        </Paper>
      </Grid>

      {/* Critical Alerts */}
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <Paper
          elevation={0}
          onClick={() => setFilters((prev) => ({ ...prev, status: 'Critical' }))}
          sx={{
            p: 2.5,
            borderRadius: '16px',
            bgcolor: '#FFFFFF',
            border: filters.status === 'Critical' ? '2px solid #D32F2F' : '1px solid #E8DFD5',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            '&:hover': {
              borderColor: '#D32F2F',
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 16px rgba(211, 47, 47, 0.08)',
            },
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
            <Box>
              <Typography variant="caption" sx={{ color: '#D32F2F', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Critical Reorder Alerts
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#D32F2F', mt: 0.5, fontFamily: '"Poppins", sans-serif' }}>
                {stats.criticalCount} <Typography component="span" variant="body2" sx={{ color: '#D32F2F', opacity: 0.8, fontWeight: 600, fontFamily: '"Poppins", sans-serif' }}>({criticalPct}%)</Typography>
              </Typography>
            </Box>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '12px',
                bgcolor: '#FFF5F5',
                color: '#D32F2F',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #FFCDD2',
              }}
            >
              <ErrorIcon sx={{ fontSize: 24 }} />
            </Box>
          </Box>

          <Box sx={{ pt: 1, borderTop: '1px solid #F7F3EE' }}>
            <LinearProgress
              variant="determinate"
              value={criticalPct}
              sx={{
                height: 6,
                borderRadius: 3,
                bgcolor: '#FFEBEE',
                '& .MuiLinearProgress-bar': { bgcolor: '#D32F2F' },
              }}
            />
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};
