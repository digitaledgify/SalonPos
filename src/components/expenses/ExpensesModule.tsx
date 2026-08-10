import React from 'react';
import { Box } from '@mui/material';
import { ExpensesProvider } from './ExpensesContext';
import { ExpensesPageHeader } from './ExpensesPageHeader';
import { ExpensesSummaryCards } from './ExpensesSummaryCards';
import { ExpensesFilterBar } from './ExpensesFilterBar';
import { ExpensesTable } from './ExpensesTable';
import { AddEditExpenseModal } from './AddEditExpenseModal';
import { ReceiptViewerModal } from './ReceiptViewerModal';

const ExpensesContent: React.FC = () => {
  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 1600, mx: 'auto' }}>
      <ExpensesPageHeader />
      <ExpensesSummaryCards />
      <ExpensesFilterBar />
      <ExpensesTable />

      <AddEditExpenseModal />
      <ReceiptViewerModal />
    </Box>
  );
};

export const ExpensesModule: React.FC = () => {
  return (
    <ExpensesProvider>
      <ExpensesContent />
    </ExpensesProvider>
  );
};

export default ExpensesModule;
