import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  Stack,
  Chip,
  Paper,
  Avatar,
  Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import HistoryIcon from '@mui/icons-material/History';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import BuildIcon from '@mui/icons-material/Build';
import InventoryIcon from '@mui/icons-material/Inventory';
import { useInventory } from './InventoryContext';

export const StockHistoryDrawer: React.FC = () => {
  const { isHistoryDrawerOpen, historyItemTarget, closeHistoryDrawer, stockLogs } =
    useInventory();

  const filteredLogs = historyItemTarget
    ? stockLogs.filter((log) => log.itemId === historyItemTarget.id)
    : stockLogs;

  return (
    <Drawer
      anchor="right"
      open={isHistoryDrawerOpen}
      onClose={closeHistoryDrawer}
      slotProps={{
        paper: {
          sx: {
            width: { xs: '100%', sm: 460 },
            bgcolor: '#F8F4EE',
            p: 0,
          },
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 3,
          pb: 2,
          bgcolor: '#FFFFFF',
          borderBottom: '1px solid #E8DFD5',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '12px',
              bgcolor: '#6A3F4D',
              color: '#F8F4EE',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <HistoryIcon />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, color: '#2D1F24', fontSize: '1.15rem' }}>
              Stock Audit Logs
            </Typography>
            <Typography variant="caption" sx={{ color: '#6E5C63' }}>
              {historyItemTarget ? `Log history for ${historyItemTarget.itemName}` : 'All stock movement activities.'}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={closeHistoryDrawer} size="small" sx={{ color: '#6E5C63' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Target Item Pill if single product focus */}
      {historyItemTarget && (
        <Box sx={{ p: 2, px: 3, bgcolor: '#FFFFFF', borderBottom: '1px solid #E8DFD5' }}>
          <Paper
            elevation={0}
            sx={{
              p: 1.5,
              borderRadius: '12px',
              bgcolor: '#F8F4EE',
              border: '1px solid #E8DFD5',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#2D1F24' }}>
                {historyItemTarget.itemName}
              </Typography>
              <Typography variant="caption" sx={{ color: '#6E5C63' }}>
                Current Qty: {historyItemTarget.remainingQty} {historyItemTarget.unit}
              </Typography>
            </Box>
            <Chip
              label={historyItemTarget.status}
              size="small"
              sx={{
                bgcolor: historyItemTarget.status === 'Optimal' ? '#E8F5E9' : '#FFF5F5',
                color: historyItemTarget.status === 'Optimal' ? '#2E7D32' : '#D32F2F',
                fontWeight: 700,
              }}
            />
          </Paper>
        </Box>
      )}

      {/* Logs List */}
      <Box sx={{ p: 3, overflowY: 'auto', flexGrow: 1 }}>
        {filteredLogs.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <InventoryIcon sx={{ fontSize: 48, color: '#D4C4B0', mb: 1 }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#2D1F24' }}>
              No Stock Logs Recorded
            </Typography>
            <Typography variant="body2" sx={{ color: '#6E5C63' }}>
              No stock transactions have been logged for this item yet.
            </Typography>
          </Box>
        ) : (
          <Stack spacing={2}>
            {filteredLogs.map((log) => {
              const isPositive = log.changeQty > 0;
              let icon = <AddShoppingCartIcon sx={{ fontSize: 18 }} />;
              let iconBg = '#E8F5E9';
              let iconColor = '#2E7D32';

              if (log.type === 'Salon Use') {
                icon = <RemoveCircleIcon sx={{ fontSize: 18 }} />;
                iconBg = '#FFF8F0';
                iconColor = '#ED6C02';
              } else if (log.type === 'Adjustment') {
                icon = <BuildIcon sx={{ fontSize: 18 }} />;
                iconBg = '#FFF5F5';
                iconColor = '#C53030';
              }

              return (
                <Paper
                  key={log.id}
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: '14px',
                    bgcolor: '#FFFFFF',
                    border: '1px solid #E8DFD5',
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          bgcolor: iconBg,
                          color: iconColor,
                        }}
                      >
                        {icon}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#2D1F24', lineHeight: 1.2 }}>
                          {log.type}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#6E5C63' }}>
                          By {log.user} • {log.timestamp}
                        </Typography>
                      </Box>
                    </Box>

                    <Chip
                      label={`${isPositive ? '+' : ''}${log.changeQty}`}
                      size="small"
                      sx={{
                        bgcolor: isPositive ? '#E8F5E9' : '#FFF5F5',
                        color: isPositive ? '#2E7D32' : '#C53030',
                        fontWeight: 800,
                        fontSize: '0.8rem',
                      }}
                    />
                  </Box>

                  <Typography variant="body2" sx={{ color: '#2D1F24', mt: 1, fontWeight: 600 }}>
                    {log.reason}
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, pt: 1, borderTop: '1px dashed #F0E8DC' }}>
                    <Typography variant="caption" sx={{ color: '#6E5C63' }}>
                      Product: {log.itemName}
                    </Typography>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#6A3F4D' }}>
                      New Level: {log.newQty}
                    </Typography>
                  </Box>
                </Paper>
              );
            })}
          </Stack>
        )}
      </Box>

      {/* Footer */}
      <Box sx={{ p: 2.5, bgcolor: '#FFFFFF', borderTop: '1px solid #E8DFD5' }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={closeHistoryDrawer}
          sx={{
            color: '#6A3F4D',
            borderColor: '#D4C4B0',
            fontWeight: 700,
            borderRadius: '10px',
            py: 1,
            textTransform: 'none',
          }}
        >
          Close Log Drawer
        </Button>
      </Box>
    </Drawer>
  );
};
