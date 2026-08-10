import React, { createContext, useContext, useState, useMemo } from 'react';
import {
  Employee,
  EmployeeStatus,
  DepartmentType,
  RoleDefinition,
  ShiftSchedule,
  CommissionCategoryRate,
} from '../../types/employee';
import { INITIAL_EMPLOYEES, INITIAL_ROLES } from '../../services/employeeData';
import { useDashboard } from '../../context/DashboardContext';

interface FilterState {
  searchQuery: string;
  department: string;
  status: string;
  roleTitle: string;
  viewMode: 'grid' | 'table';
}

interface EmployeesContextType {
  employees: Employee[];
  roles: RoleDefinition[];
  activeTab: number;
  setActiveTab: (tabIndex: number) => void;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  filteredEmployees: Employee[];

  // Modals & Drawers State
  selectedEmployee: Employee | null;
  setSelectedEmployee: (emp: Employee | null) => void;
  isDetailDrawerOpen: boolean;
  setIsDetailDrawerOpen: (open: boolean) => void;

  isAddEditModalOpen: boolean;
  setIsAddEditModalOpen: (open: boolean) => void;
  editingEmployee: Employee | null;
  setEditingEmployee: (emp: Employee | null) => void;

  isAssignShiftModalOpen: boolean;
  setIsAssignShiftModalOpen: (open: boolean) => void;
  shiftAssignEmployee: Employee | null;
  setShiftAssignEmployee: (emp: Employee | null) => void;

  isAdjustCommissionModalOpen: boolean;
  setIsAdjustCommissionModalOpen: (open: boolean) => void;
  commissionEmployee: Employee | null;
  setCommissionEmployee: (emp: Employee | null) => void;

  // Actions
  addEmployee: (emp: Omit<Employee, 'id'>) => void;
  updateEmployee: (id: string, updated: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  updateEmployeeShifts: (id: string, newShifts: ShiftSchedule[]) => void;
  updateCommissionRate: (id: string, rate: number, tiers?: CommissionCategoryRate[]) => void;
  togglePayoutStatus: (id: string) => void;
  addRole: (role: Omit<RoleDefinition, 'id'>) => void;
  resetFilters: () => void;
}

const EmployeesContext = createContext<EmployeesContextType | undefined>(undefined);

export const EmployeesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useDashboard();
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [roles, setRoles] = useState<RoleDefinition[]>(INITIAL_ROLES);
  const [activeTab, setActiveTab] = useState(0);

  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    department: 'All',
    status: 'All',
    roleTitle: 'All',
    viewMode: 'grid',
  });

  // Modal / Drawer states
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);

  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const [isAssignShiftModalOpen, setIsAssignShiftModalOpen] = useState(false);
  const [shiftAssignEmployee, setShiftAssignEmployee] = useState<Employee | null>(null);

  const [isAdjustCommissionModalOpen, setIsAdjustCommissionModalOpen] = useState(false);
  const [commissionEmployee, setCommissionEmployee] = useState<Employee | null>(null);

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      // Search
      const query = filters.searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        emp.name.toLowerCase().includes(query) ||
        emp.roleTitle.toLowerCase().includes(query) ||
        emp.phone.toLowerCase().includes(query) ||
        emp.email.toLowerCase().includes(query) ||
        emp.department.toLowerCase().includes(query);

      // Department
      const matchesDept = filters.department === 'All' || emp.department === filters.department;

      // Status
      const matchesStatus = filters.status === 'All' || emp.status === filters.status;

      // Role Title
      const matchesRole = filters.roleTitle === 'All' || emp.roleTitle === filters.roleTitle;

      return matchesSearch && matchesDept && matchesStatus && matchesRole;
    });
  }, [employees, filters]);

  const addEmployee = (newEmpData: Omit<Employee, 'id'>) => {
    const newEmp: Employee = {
      ...newEmpData,
      id: `emp-${Date.now()}`,
    };
    setEmployees((prev) => [newEmp, ...prev]);
    showToast(`Staff member "${newEmp.name}" added successfully.`);
  };

  const updateEmployee = (id: string, updated: Partial<Employee>) => {
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === id ? { ...emp, ...updated } : emp))
    );
    if (selectedEmployee?.id === id) {
      setSelectedEmployee((prev) => (prev ? { ...prev, ...updated } : null));
    }
    showToast(`Employee details updated.`);
  };

  const deleteEmployee = (id: string) => {
    const target = employees.find((e) => e.id === id);
    setEmployees((prev) => prev.filter((emp) => emp.id !== id));
    if (selectedEmployee?.id === id) {
      setIsDetailDrawerOpen(false);
      setSelectedEmployee(null);
    }
    showToast(`Staff member "${target?.name || 'Employee'}" removed from system.`);
  };

  const updateEmployeeShifts = (id: string, newShifts: ShiftSchedule[]) => {
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === id ? { ...emp, shifts: newShifts } : emp))
    );
    if (selectedEmployee?.id === id) {
      setSelectedEmployee((prev) => (prev ? { ...prev, shifts: newShifts } : null));
    }
    showToast(`Updated shift schedule roster for staff.`);
  };

  const updateCommissionRate = (
    id: string,
    newRate: number,
    tiers?: CommissionCategoryRate[]
  ) => {
    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id === id) {
          const commToday = Math.round((emp.todaySales * newRate) / 100);
          const commMonth = Math.round((emp.monthlySales * newRate) / 100);
          return {
            ...emp,
            commissionRate: newRate,
            commissionTiers: tiers || emp.commissionTiers,
            commissionEarnedToday: commToday,
            commissionEarnedMonth: commMonth,
          };
        }
        return emp;
      })
    );
    showToast(`Commission rate set to ${newRate}%!`);
  };

  const togglePayoutStatus = (id: string) => {
    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id === id) {
          const nextStatus = emp.payoutStatus === 'Paid' ? 'Pending' : 'Paid';
          showToast(`Commission payout for ${emp.name} marked as ${nextStatus}.`);
          return { ...emp, payoutStatus: nextStatus };
        }
        return emp;
      })
    );
  };

  const addRole = (newRoleData: Omit<RoleDefinition, 'id'>) => {
    const newRole: RoleDefinition = {
      ...newRoleData,
      id: `role-${Date.now()}`,
    };
    setRoles((prev) => [...prev, newRole]);
    showToast(`New staff role "${newRole.title}" created.`);
  };

  const resetFilters = () => {
    setFilters({
      searchQuery: '',
      department: 'All',
      status: 'All',
      roleTitle: 'All',
      viewMode: 'grid',
    });
  };

  return (
    <EmployeesContext.Provider
      value={{
        employees,
        roles,
        activeTab,
        setActiveTab,
        filters,
        setFilters,
        filteredEmployees,
        selectedEmployee,
        setSelectedEmployee,
        isDetailDrawerOpen,
        setIsDetailDrawerOpen,
        isAddEditModalOpen,
        setIsAddEditModalOpen,
        editingEmployee,
        setEditingEmployee,
        isAssignShiftModalOpen,
        setIsAssignShiftModalOpen,
        shiftAssignEmployee,
        setShiftAssignEmployee,
        isAdjustCommissionModalOpen,
        setIsAdjustCommissionModalOpen,
        commissionEmployee,
        setCommissionEmployee,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        updateEmployeeShifts,
        updateCommissionRate,
        togglePayoutStatus,
        addRole,
        resetFilters,
      }}
    >
      {children}
    </EmployeesContext.Provider>
  );
};

export const useEmployees = () => {
  const context = useContext(EmployeesContext);
  if (!context) {
    throw new Error('useEmployees must be used within an EmployeesProvider');
  }
  return context;
};
