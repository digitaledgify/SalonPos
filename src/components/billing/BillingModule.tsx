import React, { useState, useMemo } from 'react';
import { Box } from '@mui/material';
import { useDashboard } from '../../context/DashboardContext';
import { BillingPageHeader } from './BillingPageHeader';
import { BillingSummaryCards } from './BillingSummaryCards';
import { BillingFilterBar } from './BillingFilterBar';
import { BillingTable } from './BillingTable';
import { BillingPOSModal } from './BillingPOSModal';
import { CashDrawerModal } from './CashDrawerModal';
import { Transaction } from '../../types';

export const BillingModule: React.FC = () => {
  const {
    transactions,
    setSelectedInvoice,
    isNewBillOpen,
    setIsNewBillOpen,
  } = useDashboard();

  // Local Filter & Search States
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedMethod, setSelectedMethod] = useState('All');
  const [selectedDateFilter, setSelectedDateFilter] = useState('Today');

  // Modals
  const [isCashDrawerOpen, setIsCashDrawerOpen] = useState(false);

  const handleClearFilters = () => {
    setSearch('');
    setSelectedStatus('All');
    setSelectedMethod('All');
    setSelectedDateFilter('Today');
  };

  // Filter Logic
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      // 1. Search filter
      const q = search.toLowerCase().trim();
      const matchesSearch =
        q === '' ||
        tx.invoiceNo.toLowerCase().includes(q) ||
        tx.customerName.toLowerCase().includes(q) ||
        tx.customerPhone.includes(q) ||
        tx.services.some((s) => s.toLowerCase().includes(q)) ||
        tx.stylistName.toLowerCase().includes(q);

      // 2. Status filter
      const matchesStatus =
        selectedStatus === 'All' || tx.status === selectedStatus;

      // 3. Payment Method filter
      const matchesMethod =
        selectedMethod === 'All' || tx.paymentMethod === selectedMethod;

      // 4. Date filter
      let matchesDate = true;
      if (selectedDateFilter === 'Today') {
        matchesDate = tx.date === 'Today' || tx.date.includes('Today');
      }

      return matchesSearch && matchesStatus && matchesMethod && matchesDate;
    });
  }, [transactions, search, selectedStatus, selectedMethod, selectedDateFilter]);

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, bgcolor: '#F8F4EE', minHeight: '100vh' }}>
      {/* 1. Page Header */}
      <BillingPageHeader
        onOpenPOS={() => setIsNewBillOpen(true)}
        onOpenCashDrawer={() => setIsCashDrawerOpen(true)}
      />

      {/* 2. Key Metrics Summary Cards */}
      <BillingSummaryCards />

      {/* 3. Search and Multi-Filter Bar */}
      <BillingFilterBar
        search={search}
        setSearch={setSearch}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        selectedMethod={selectedMethod}
        setSelectedMethod={setSelectedMethod}
        selectedDateFilter={selectedDateFilter}
        setSelectedDateFilter={setSelectedDateFilter}
        onClearFilters={handleClearFilters}
      />

      {/* 4. Transactions / Billing Table */}
      <BillingTable
        transactions={filteredTransactions}
        onSelectInvoice={(tx: Transaction) => setSelectedInvoice(tx)}
      />

      {/* 5. Express POS Checkout Modal */}
      <BillingPOSModal
        open={isNewBillOpen}
        onClose={() => setIsNewBillOpen(false)}
      />

      {/* 6. Daily Cash Drawer Modal */}
      <CashDrawerModal
        open={isCashDrawerOpen}
        onClose={() => setIsCashDrawerOpen(false)}
      />
    </Box>
  );
};
