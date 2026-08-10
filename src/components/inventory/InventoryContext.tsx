import React, { createContext, useContext, useState, useMemo } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { InventoryItem, StockStatus } from '../../types';

export interface StockLogEntry {
  id: string;
  itemId: string;
  itemName: string;
  changeQty: number; // e.g. +10 or -2
  newQty: number;
  reason: string;
  type: 'Restock' | 'Salon Use' | 'Adjustment' | 'Initial';
  timestamp: string;
  user: string;
}

interface InventoryFilters {
  search: string;
  category: string;
  status: 'All' | StockStatus;
  supplier: string;
  sortBy: 'itemName' | 'remainingQty' | 'unitPrice' | 'totalValuation' | 'status';
  sortOrder: 'asc' | 'desc';
  viewMode: 'table' | 'grid';
}

interface InventoryContextType {
  inventory: InventoryItem[];
  filteredInventory: InventoryItem[];
  categories: string[];
  suppliers: string[];
  filters: InventoryFilters;
  setFilters: React.Dispatch<React.SetStateAction<InventoryFilters>>;
  
  // Modals state
  isAddEditModalOpen: boolean;
  editingItem: InventoryItem | null;
  openAddModal: () => void;
  openEditModal: (item: InventoryItem) => void;
  closeAddEditModal: () => void;

  isRestockModalOpen: boolean;
  restockItemTarget: InventoryItem | null;
  openRestockModal: (item?: InventoryItem) => void;
  closeRestockModal: () => void;

  isAdjustmentModalOpen: boolean;
  adjustmentItemTarget: InventoryItem | null;
  openAdjustmentModal: (item?: InventoryItem) => void;
  closeAdjustmentModal: () => void;

  isHistoryDrawerOpen: boolean;
  historyItemTarget: InventoryItem | null;
  openHistoryDrawer: (item?: InventoryItem) => void;
  closeHistoryDrawer: () => void;

  // History logs
  stockLogs: StockLogEntry[];
  addStockLog: (log: Omit<StockLogEntry, 'id' | 'timestamp' | 'user'>) => void;

  // Inventory stats
  stats: {
    totalItems: number;
    totalValuation: number;
    optimalCount: number;
    lowCount: number;
    criticalCount: number;
  };

  // Export
  exportToCSV: () => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

const INITIAL_LOGS: StockLogEntry[] = [];

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { inventory, role, showToast } = useDashboard();

  const [filters, setFilters] = useState<InventoryFilters>({
    search: '',
    category: 'All',
    status: 'All',
    supplier: 'All',
    sortBy: 'status',
    sortOrder: 'asc',
    viewMode: 'table',
  });

  // Modal States
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);
  const [restockItemTarget, setRestockItemTarget] = useState<InventoryItem | null>(null);

  const [isAdjustmentModalOpen, setIsAdjustmentModalOpen] = useState(false);
  const [adjustmentItemTarget, setAdjustmentItemTarget] = useState<InventoryItem | null>(null);

  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);
  const [historyItemTarget, setHistoryItemTarget] = useState<InventoryItem | null>(null);

  const [stockLogs, setStockLogs] = useState<StockLogEntry[]>(INITIAL_LOGS);

  const addStockLog = (logData: Omit<StockLogEntry, 'id' | 'timestamp' | 'user'>) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const newEntry: StockLogEntry = {
      ...logData,
      id: `log-${Date.now()}`,
      timestamp: `Today, ${timeStr}`,
      user: role || 'Admin',
    };
    setStockLogs((prev) => [newEntry, ...prev]);
  };

  // Categories & Suppliers lists
  const categories = useMemo(() => {
    const set = new Set<string>();
    inventory.forEach((i) => set.add(i.category));
    return ['All', ...Array.from(set)];
  }, [inventory]);

  const suppliers = useMemo(() => {
    const set = new Set<string>();
    inventory.forEach((i) => set.add(i.supplier));
    return ['All', ...Array.from(set)];
  }, [inventory]);

  // Derived Statistics
  const stats = useMemo(() => {
    let totalValuation = 0;
    let optimalCount = 0;
    let lowCount = 0;
    let criticalCount = 0;

    inventory.forEach((item) => {
      totalValuation += item.remainingQty * item.unitPrice;
      if (item.status === 'Optimal') optimalCount++;
      else if (item.status === 'Low') lowCount++;
      else if (item.status === 'Critical') criticalCount++;
    });

    return {
      totalItems: inventory.length,
      totalValuation,
      optimalCount,
      lowCount,
      criticalCount,
    };
  }, [inventory]);

  // Filtered & Sorted items
  const filteredInventory = useMemo(() => {
    return inventory
      .filter((item) => {
        // Search filter
        const matchSearch =
          filters.search === '' ||
          item.itemName.toLowerCase().includes(filters.search.toLowerCase()) ||
          item.category.toLowerCase().includes(filters.search.toLowerCase()) ||
          item.supplier.toLowerCase().includes(filters.search.toLowerCase()) ||
          item.id.toLowerCase().includes(filters.search.toLowerCase());

        // Category filter
        const matchCategory = filters.category === 'All' || item.category === filters.category;

        // Status filter
        const matchStatus = filters.status === 'All' || item.status === filters.status;

        // Supplier filter
        const matchSupplier = filters.supplier === 'All' || item.supplier === filters.supplier;

        return matchSearch && matchCategory && matchStatus && matchSupplier;
      })
      .sort((a, b) => {
        let valA: any = a[filters.sortBy as keyof InventoryItem];
        let valB: any = b[filters.sortBy as keyof InventoryItem];

        if (filters.sortBy === 'totalValuation') {
          valA = a.remainingQty * a.unitPrice;
          valB = b.remainingQty * b.unitPrice;
        }

        if (filters.sortBy === 'status') {
          const priorityMap = { Critical: 1, Low: 2, Optimal: 3 };
          valA = priorityMap[a.status];
          valB = priorityMap[b.status];
        }

        if (typeof valA === 'string') {
          return filters.sortOrder === 'asc'
            ? valA.localeCompare(valB)
            : valB.localeCompare(valA);
        }

        return filters.sortOrder === 'asc' ? valA - valB : valB - valA;
      });
  }, [inventory, filters]);

  // Modal Action Handlers
  const openAddModal = () => {
    setEditingItem(null);
    setIsAddEditModalOpen(true);
  };

  const openEditModal = (item: InventoryItem) => {
    setEditingItem(item);
    setIsAddEditModalOpen(true);
  };

  const closeAddEditModal = () => {
    setIsAddEditModalOpen(false);
    setEditingItem(null);
  };

  const openRestockModal = (item?: InventoryItem) => {
    setRestockItemTarget(item || null);
    setIsRestockModalOpen(true);
  };

  const closeRestockModal = () => {
    setIsRestockModalOpen(false);
    setRestockItemTarget(null);
  };

  const openAdjustmentModal = (item?: InventoryItem) => {
    setAdjustmentItemTarget(item || null);
    setIsAdjustmentModalOpen(true);
  };

  const closeAdjustmentModal = () => {
    setIsAdjustmentModalOpen(false);
    setAdjustmentItemTarget(null);
  };

  const openHistoryDrawer = (item?: InventoryItem) => {
    setHistoryItemTarget(item || null);
    setIsHistoryDrawerOpen(true);
  };

  const closeHistoryDrawer = () => {
    setIsHistoryDrawerOpen(false);
    setHistoryItemTarget(null);
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['ID', 'Item Name', 'Category', 'Remaining Qty', 'Unit', 'Min Threshold', 'Unit Price (₹)', 'Total Valuation (₹)', 'Status', 'Supplier'];
    const rows = filteredInventory.map((item) => [
      item.id,
      `"${item.itemName.replace(/"/g, '""')}"`,
      `"${item.category}"`,
      item.remainingQty,
      item.unit,
      item.minQty,
      item.unitPrice,
      item.remainingQty * item.unitPrice,
      item.status,
      `"${item.supplier}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Salon_Inventory_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Inventory report exported as CSV!');
  };

  return (
    <InventoryContext.Provider
      value={{
        inventory,
        filteredInventory,
        categories,
        suppliers,
        filters,
        setFilters,
        isAddEditModalOpen,
        editingItem,
        openAddModal,
        openEditModal,
        closeAddEditModal,
        isRestockModalOpen,
        restockItemTarget,
        openRestockModal,
        closeRestockModal,
        isAdjustmentModalOpen,
        adjustmentItemTarget,
        openAdjustmentModal,
        closeAdjustmentModal,
        isHistoryDrawerOpen,
        historyItemTarget,
        openHistoryDrawer,
        closeHistoryDrawer,
        stockLogs,
        addStockLog,
        stats,
        exportToCSV,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};
