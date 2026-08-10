import React from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import { InventoryProvider, useInventory } from './InventoryContext';
import { InventoryPageHeader } from './InventoryPageHeader';
import { InventorySummaryCards } from './InventorySummaryCards';
import { InventoryFilterBar } from './InventoryFilterBar';
import { InventoryTable } from './InventoryTable';
import { InventoryGridCard } from './InventoryGridCard';
import { AddEditProductModal } from './AddEditProductModal';
import { RestockModal } from './RestockModal';
import { StockAdjustmentModal } from './StockAdjustmentModal';
import { StockHistoryDrawer } from './StockHistoryDrawer';

const InventoryContent: React.FC = () => {
  const { filteredInventory, filters } = useInventory();

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 1600, mx: 'auto' }}>
      {/* Page Header */}
      <InventoryPageHeader />

      {/* Summary KPI Cards */}
      <InventorySummaryCards />

      {/* Filter & Search Bar */}
      <InventoryFilterBar />

      {/* Main Inventory Items View (Table or Grid) */}
      {filters.viewMode === 'grid' ? (
        filteredInventory.length === 0 ? (
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
              No Products Found
            </Typography>
            <Typography variant="body2" sx={{ color: '#6E5C63' }}>
              No salon products match your selected filters. Try clearing search query or selecting another category.
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {filteredInventory.map((item) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={item.id}>
                <InventoryGridCard item={item} />
              </Grid>
            ))}
          </Grid>
        )
      ) : (
        <InventoryTable />
      )}

      {/* Modals & Slide-over Drawer */}
      <AddEditProductModal />
      <RestockModal />
      <StockAdjustmentModal />
      <StockHistoryDrawer />
    </Box>
  );
};

export const InventoryModule: React.FC = () => {
  return (
    <InventoryProvider>
      <InventoryContent />
    </InventoryProvider>
  );
};

export default InventoryModule;
