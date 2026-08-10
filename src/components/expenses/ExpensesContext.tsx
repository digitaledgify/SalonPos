import React, { createContext, useContext, useState } from 'react';
import { ExpenseItem, ExpenseCategory, PaymentMethod, ExpenseStatus } from '../../types/expense';
import { INITIAL_EXPENSES } from '../../services/expenseData';
import { useDashboard } from '../../context/DashboardContext';

interface ExpensesContextType {
  expenses: ExpenseItem[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: ExpenseCategory | 'All Categories';
  setSelectedCategory: (cat: ExpenseCategory | 'All Categories') => void;
  selectedMethod: PaymentMethod | 'All Methods';
  setSelectedMethod: (m: PaymentMethod | 'All Methods') => void;
  selectedStatus: ExpenseStatus | 'All Statuses';
  setSelectedStatus: (s: ExpenseStatus | 'All Statuses') => void;
  
  // Modals
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
  editingExpense: ExpenseItem | null;
  setEditingExpense: (exp: ExpenseItem | null) => void;
  viewingReceiptUrl: string | null;
  setViewingReceiptUrl: (url: string | null) => void;

  // Actions
  addExpense: (expense: Omit<ExpenseItem, 'id'>) => void;
  updateExpense: (id: string, updated: Partial<ExpenseItem>) => void;
  deleteExpense: (id: string) => void;
  approveExpense: (id: string) => void;
}

const ExpensesContext = createContext<ExpensesContextType | undefined>(undefined);

export const ExpensesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useDashboard();
  const [expenses, setExpenses] = useState<ExpenseItem[]>(INITIAL_EXPENSES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | 'All Categories'>('All Categories');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | 'All Methods'>('All Methods');
  const [selectedStatus, setSelectedStatus] = useState<ExpenseStatus | 'All Statuses'>('All Statuses');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<ExpenseItem | null>(null);
  const [viewingReceiptUrl, setViewingReceiptUrl] = useState<string | null>(null);

  const addExpense = (newExpData: Omit<ExpenseItem, 'id'>) => {
    const newId = `EXP-${Math.floor(100 + Math.random() * 900)}`;
    const newExp: ExpenseItem = {
      ...newExpData,
      id: newId,
    };
    setExpenses((prev) => [newExp, ...prev]);
    showToast(`Logged new expense "${newExp.title}" for ₹${newExp.amount.toLocaleString('en-IN')}.`);
  };

  const updateExpense = (id: string, updated: Partial<ExpenseItem>) => {
    setExpenses((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updated } : e))
    );
    showToast(`Updated expense statement record #${id}.`);
  };

  const deleteExpense = (id: string) => {
    const target = expenses.find((e) => e.id === id);
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    showToast(`Deleted expense entry "${target?.title || id}".`);
  };

  const approveExpense = (id: string) => {
    setExpenses((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: 'Approved', approvedBy: 'Admin Manager' } : e))
    );
    showToast(`Approved expense item #${id}.`);
  };

  return (
    <ExpensesContext.Provider
      value={{
        expenses,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        selectedMethod,
        setSelectedMethod,
        selectedStatus,
        setSelectedStatus,
        isAddModalOpen,
        setIsAddModalOpen,
        editingExpense,
        setEditingExpense,
        viewingReceiptUrl,
        setViewingReceiptUrl,
        addExpense,
        updateExpense,
        deleteExpense,
        approveExpense,
      }}
    >
      {children}
    </ExpensesContext.Provider>
  );
};

export const useExpenses = () => {
  const context = useContext(ExpensesContext);
  if (!context) {
    throw new Error('useExpenses must be used within an ExpensesProvider');
  }
  return context;
};
