import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import {
  Employee,
  EmployeeStatus,
  DepartmentType,
  RoleDefinition,
  ShiftSchedule,
  CommissionCategoryRate,
} from '../../types/employee';
import { INITIAL_ROLES } from '../../services/employeeData';
import { useDashboard } from '../../context/DashboardContext';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';

interface FilterState {
  searchQuery: string;
  department: string;
  status: string;
  roleTitle: string;
  viewMode: 'grid' | 'table';
}

interface EmployeesContextType {
  employees: Employee[];
  loadingEmployees: boolean;
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

function rowToEmployee(row: any): Employee {
  return { ...(row.data as Employee), id: row.id };
}

function rowToRole(row: any): RoleDefinition {
  return {
    id: row.id,
    title: row.title,
    department: row.department,
    description: row.description,
    defaultCommissionRate: Number(row.default_commission_rate),
    permissions: row.permissions || [],
    color: row.color,
  };
}

export const EmployeesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useDashboard();
  const { profile } = useAuth();
  const salonId = profile?.salonId ?? null;

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [roles, setRoles] = useState<RoleDefinition[]>([]);
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

  // Load employees + roles for this salon on login. If the salon has no
  // roles yet (brand new salon), seed it once with the default role templates.
  useEffect(() => {
    let cancelled = false;

    if (!salonId) {
      setEmployees([]);
      setRoles([]);
      setLoadingEmployees(false);
      return;
    }

    setLoadingEmployees(true);

    (async () => {
      const [{ data: empRows, error: empErr }, { data: roleRows, error: roleErr }] = await Promise.all([
        supabase.from('employees').select('*').eq('salon_id', salonId).order('created_at', { ascending: false }),
        supabase.from('employee_roles').select('*').eq('salon_id', salonId),
      ]);

      if (cancelled) return;

      if (!empErr) setEmployees((empRows ?? []).map(rowToEmployee));

      if (!roleErr && roleRows && roleRows.length > 0) {
        setRoles(roleRows.map(rowToRole));
      } else if (!roleErr) {
        // Brand new salon — seed default role templates once.
        const seeded = INITIAL_ROLES.map((r) => ({
          id: r.id,
          salon_id: salonId,
          title: r.title,
          department: r.department,
          description: r.description,
          default_commission_rate: r.defaultCommissionRate,
          permissions: r.permissions,
          color: r.color,
        }));
        await supabase.from('employee_roles').insert(seeded);
        setRoles(INITIAL_ROLES);
      }

      setLoadingEmployees(false);
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [salonId]);

  const persistEmployee = async (emp: Employee) => {
    if (!salonId) return;
    const { error } = await supabase.from('employees').upsert({
      id: emp.id,
      salon_id: salonId,
      name: emp.name,
      role_title: emp.roleTitle,
      department: emp.department,
      status: emp.status,
      data: emp,
      updated_at: new Date().toISOString(),
    });
    if (error) showToast('Saved locally, but failed to sync staff record to the database.');
  };

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
    persistEmployee(newEmp);
    showToast(`Staff member "${newEmp.name}" added successfully.`);
  };

  const updateEmployee = (id: string, updated: Partial<Employee>) => {
    let updatedForSync: Employee | null = null;
    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id === id) {
          const merged = { ...emp, ...updated };
          updatedForSync = merged;
          return merged;
        }
        return emp;
      })
    );
    if (selectedEmployee?.id === id) {
      setSelectedEmployee((prev) => (prev ? { ...prev, ...updated } : null));
    }
    if (updatedForSync) persistEmployee(updatedForSync);
    showToast(`Employee details updated.`);
  };

  const deleteEmployee = (id: string) => {
    const target = employees.find((e) => e.id === id);
    setEmployees((prev) => prev.filter((emp) => emp.id !== id));
    if (selectedEmployee?.id === id) {
      setIsDetailDrawerOpen(false);
      setSelectedEmployee(null);
    }
    supabase
      .from('employees')
      .delete()
      .eq('id', id)
      .then(({ error }) => {
        if (error) showToast('Failed to delete staff record from the database.');
      });
    showToast(`Staff member "${target?.name || 'Employee'}" removed from system.`);
  };

  const updateEmployeeShifts = (id: string, newShifts: ShiftSchedule[]) => {
    let updatedForSync: Employee | null = null;
    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id === id) {
          const updated = { ...emp, shifts: newShifts };
          updatedForSync = updated;
          return updated;
        }
        return emp;
      })
    );
    if (selectedEmployee?.id === id) {
      setSelectedEmployee((prev) => (prev ? { ...prev, shifts: newShifts } : null));
    }
    if (updatedForSync) persistEmployee(updatedForSync);
    showToast(`Updated shift schedule roster for staff.`);
  };

  const updateCommissionRate = (
    id: string,
    newRate: number,
    tiers?: CommissionCategoryRate[]
  ) => {
    let updatedForSync: Employee | null = null;
    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id === id) {
          const commToday = Math.round((emp.todaySales * newRate) / 100);
          const commMonth = Math.round((emp.monthlySales * newRate) / 100);
          const updated = {
            ...emp,
            commissionRate: newRate,
            commissionTiers: tiers || emp.commissionTiers,
            commissionEarnedToday: commToday,
            commissionEarnedMonth: commMonth,
          };
          updatedForSync = updated;
          return updated;
        }
        return emp;
      })
    );
    if (updatedForSync) persistEmployee(updatedForSync);
    showToast(`Commission rate set to ${newRate}%!`);
  };

  const togglePayoutStatus = (id: string) => {
    let updatedForSync: Employee | null = null;
    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id === id) {
          const nextStatus = emp.payoutStatus === 'Paid' ? 'Pending' : 'Paid';
          showToast(`Commission payout for ${emp.name} marked as ${nextStatus}.`);
          const updated = { ...emp, payoutStatus: nextStatus as 'Paid' | 'Pending' };
          updatedForSync = updated;
          return updated;
        }
        return emp;
      })
    );
    if (updatedForSync) persistEmployee(updatedForSync);
  };

  const addRole = (newRoleData: Omit<RoleDefinition, 'id'>) => {
    const newRole: RoleDefinition = {
      ...newRoleData,
      id: `role-${Date.now()}`,
    };
    setRoles((prev) => [...prev, newRole]);
    if (salonId) {
      supabase
        .from('employee_roles')
        .insert({
          id: newRole.id,
          salon_id: salonId,
          title: newRole.title,
          department: newRole.department,
          description: newRole.description,
          default_commission_rate: newRole.defaultCommissionRate,
          permissions: newRole.permissions,
          color: newRole.color,
        })
        .then(({ error }) => {
          if (error) showToast('Saved locally, but failed to sync role to the database.');
        });
    }
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
        loadingEmployees,
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
