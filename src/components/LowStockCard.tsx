import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { useDashboard } from '../context/DashboardContext';
import { getStockStatusColor } from '../utils/formatters';

export const LowStockCard: React.FC = () => {
  const { inventory, restockItem } = useDashboard();
  const lowStockItems = inventory.filter((item) => item.status !== 'Optimal');

  return (
    <Card
      sx={{
        borderRadius: '16px',
        border: '1px solid #E8DFD5',
        bgcolor: '#FFFFFF',
        height: '100%',
      }}
    >
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '10px',
                bgcolor: '#FFF5F5',
                color: '#C53030',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #FED7D7',
              }}
            >
              <WarningAmberIcon sx={{ fontSize: 20 }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#2D1F24', fontSize: '1.05rem' }}>
              Low Stock Alerts ({lowStockItems.length})
            </Typography>
          </Box>
        </Box>

        <TableContainer sx={{ borderRadius: '12px', border: '1px solid #E8DFD5' }}>
          <Table size="small">
            <TableHead sx={{ bgcolor: '#F8F4EE' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: '#6A3F4D' }}>Item</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, color: '#6A3F4D' }}>
                  Remaining
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, color: '#6A3F4D' }}>
                  Min Qty
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, color: '#6A3F4D' }}>
                  Status
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: '#6A3F4D' }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {lowStockItems.map((item) => {
                const colors = getStockStatusColor(item.status);
                const isCritical = item.status === 'Critical';
                return (
                  <TableRow
                    key={item.id}
                    sx={{
                      bgcolor: isCritical ? '#FFF5F5' : 'transparent',
                      '&:last-child td, &:last-child th': { border: 0 },
                    }}
                  >
                    <TableCell sx={{ fontWeight: 700, color: '#2D1F24' }}>
                      {item.itemName}
                      <Typography variant="caption" sx={{ display: 'block', color: '#6E5C63' }}>
                        {item.category} • {item.supplier}
                      </Typography>
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 800, color: isCritical ? '#C53030' : '#8C5200' }}>
                      {item.remainingQty} {item.unit}
                    </TableCell>
                    <TableCell align="center" sx={{ color: '#6E5C63', fontWeight: 600 }}>
                      {item.minQty} {item.unit}
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={item.status}
                        size="small"
                        sx={{
                          height: 22,
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          bgcolor: colors.bg,
                          color: colors.text,
                          border: `1px solid ${colors.border}`,
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<AddShoppingCartIcon sx={{ fontSize: '13px !important' }} />}
                        onClick={() => restockItem(item.id, 10)}
                        sx={{
                          fontSize: '0.7rem',
                          py: 0.2,
                          px: 1,
                          borderRadius: '6px',
                          color: '#6A3F4D',
                          borderColor: '#A8828F',
                          '&:hover': {
                            bgcolor: '#EBD9DF',
                          },
                        }}
                      >
                        + Restock
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};
