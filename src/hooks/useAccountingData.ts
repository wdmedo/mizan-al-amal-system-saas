
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AccountingData } from '@/types/accounting';
import * as db from '@/services/database';
import { useToast } from '@/hooks/use-toast';

export const useAccountingData = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all data using React Query
  const { data: expenses = [] } = useQuery({
    queryKey: ['expenses'],
    queryFn: db.getExpenses,
  });

  const { data: pendingCustomers = [] } = useQuery({
    queryKey: ['pending-customers'],
    queryFn: db.getPendingCustomers,
  });

  const { data: completedCustomers = [] } = useQuery({
    queryKey: ['completed-customers'],
    queryFn: db.getCompletedCustomers,
  });

  const { data: employees = [] } = useQuery({
    queryKey: ['employees'],
    queryFn: db.getEmployees,
  });

  const { data: employeeTransactions = [] } = useQuery({
    queryKey: ['employee-transactions'],
    queryFn: db.getEmployeeTransactions,
  });

  const { data: coverages = [] } = useQuery({
    queryKey: ['coverages'],
    queryFn: db.getCoverages,
  });

  const { data: coverageTransactions = [] } = useQuery({
    queryKey: ['coverage-transactions'],
    queryFn: db.getCoverageTransactions,
  });

  const { data: accounts = [] } = useQuery({
    queryKey: ['accounts'],
    queryFn: db.getAccounts,
  });

  const { data: capitalEntries = [] } = useQuery({
    queryKey: ['capital-entries'],
    queryFn: db.getCapitalEntries,
  });

  const data: AccountingData = {
    expenses,
    pendingCustomers,
    completedCustomers,
    employees,
    employeeTransactions,
    coverages,
    coverageTransactions,
    accounts,
    capitalEntries
  };

  // Mutations for expenses
  const addExpenseMutation = useMutation({
    mutationFn: db.addExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast({ title: "تمت إضافة المصروف بنجاح" });
    },
    onError: () => {
      toast({ title: "خطأ في إضافة المصروف", variant: "destructive" });
    }
  });

  const deleteExpenseMutation = useMutation({
    mutationFn: db.deleteExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast({ title: "تم حذف المصروف بنجاح" });
    },
    onError: () => {
      toast({ title: "خطأ في حذف المصروف", variant: "destructive" });
    }
  });

  // Mutations for pending customers
  const addPendingCustomerMutation = useMutation({
    mutationFn: db.addPendingCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-customers'] });
      toast({ title: "تمت إضافة العميل بنجاح" });
    },
    onError: () => {
      toast({ title: "خطأ في إضافة العميل", variant: "destructive" });
    }
  });

  const deletePendingCustomerMutation = useMutation({
    mutationFn: db.deletePendingCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-customers'] });
      toast({ title: "تم حذف العميل بنجاح" });
    },
    onError: () => {
      toast({ title: "خطأ في حذف العميل", variant: "destructive" });
    }
  });

  // Mutations for payments
  const addPaymentMutation = useMutation({
    mutationFn: db.addPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-customers'] });
      toast({ title: "تمت إضافة الدفعة بنجاح" });
    },
    onError: () => {
      toast({ title: "خطأ في إضافة الدفعة", variant: "destructive" });
    }
  });

  const deletePaymentMutation = useMutation({
    mutationFn: db.deletePayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-customers'] });
      toast({ title: "تم حذف الدفعة بنجاح" });
    },
    onError: () => {
      toast({ title: "خطأ في حذف الدفعة", variant: "destructive" });
    }
  });

  // Mutations for completed customers
  const addCompletedCustomerMutation = useMutation({
    mutationFn: db.addCompletedCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['completed-customers'] });
      toast({ title: "تمت إضافة العميل الخالص بنجاح" });
    },
    onError: () => {
      toast({ title: "خطأ في إضافة العميل الخالص", variant: "destructive" });
    }
  });

  const deleteCompletedCustomerMutation = useMutation({
    mutationFn: db.deleteCompletedCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['completed-customers'] });
      toast({ title: "تم حذف العميل الخالص بنجاح" });
    },
    onError: () => {
      toast({ title: "خطأ في حذف العميل الخالص", variant: "destructive" });
    }
  });

  // Mutations for employees
  const addEmployeeMutation = useMutation({
    mutationFn: db.addEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast({ title: "تمت إضافة الموظف بنجاح" });
    },
    onError: () => {
      toast({ title: "خطأ في إضافة الموظف", variant: "destructive" });
    }
  });

  const deleteEmployeeMutation = useMutation({
    mutationFn: db.deleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast({ title: "تم حذف الموظف بنجاح" });
    },
    onError: () => {
      toast({ title: "خطأ في حذف الموظف", variant: "destructive" });
    }
  });

  // Mutations for employee transactions
  const addEmployeeTransactionMutation = useMutation({
    mutationFn: db.addEmployeeTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee-transactions'] });
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast({ title: "تمت إضافة المعاملة بنجاح" });
    },
    onError: () => {
      toast({ title: "خطأ في إضافة المعاملة", variant: "destructive" });
    }
  });

  const deleteEmployeeTransactionMutation = useMutation({
    mutationFn: db.deleteEmployeeTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee-transactions'] });
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast({ title: "تم حذف المعاملة بنجاح" });
    },
    onError: () => {
      toast({ title: "خطأ في حذف المعاملة", variant: "destructive" });
    }
  });

  // Mutations for coverages
  const addCoverageMutation = useMutation({
    mutationFn: db.addCoverage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coverages'] });
      toast({ title: "تمت إضافة التغطية بنجاح" });
    },
    onError: () => {
      toast({ title: "خطأ في إضافة التغطية", variant: "destructive" });
    }
  });

  const deleteCoverageMutation = useMutation({
    mutationFn: db.deleteCoverage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coverages'] });
      toast({ title: "تم حذف التغطية بنجاح" });
    },
    onError: () => {
      toast({ title: "خطأ في حذف التغطية", variant: "destructive" });
    }
  });

  // Mutations for coverage transactions
  const addCoverageTransactionMutation = useMutation({
    mutationFn: db.addCoverageTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coverage-transactions'] });
      queryClient.invalidateQueries({ queryKey: ['coverages'] });
      toast({ title: "تمت إضافة معاملة التغطية بنجاح" });
    },
    onError: () => {
      toast({ title: "خطأ في إضافة معاملة التغطية", variant: "destructive" });
    }
  });

  const deleteCoverageTransactionMutation = useMutation({
    mutationFn: db.deleteCoverageTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coverage-transactions'] });
      queryClient.invalidateQueries({ queryKey: ['coverages'] });
      toast({ title: "تم حذف معاملة التغطية بنجاح" });
    },
    onError: () => {
      toast({ title: "خطأ في حذف معاملة التغطية", variant: "destructive" });
    }
  });

  // Mutations for accounts
  const addAccountMutation = useMutation({
    mutationFn: db.addAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      toast({ title: "تمت إضافة الحساب بنجاح" });
    },
    onError: () => {
      toast({ title: "خطأ في إضافة الحساب", variant: "destructive" });
    }
  });

  const deleteAccountMutation = useMutation({
    mutationFn: db.deleteAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      toast({ title: "تم حذف الحساب بنجاح" });
    },
    onError: () => {
      toast({ title: "خطأ في حذف الحساب", variant: "destructive" });
    }
  });

  // Mutations for capital entries
  const addCapitalEntryMutation = useMutation({
    mutationFn: db.addCapitalEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['capital-entries'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      toast({ title: "تمت إضافة حركة رأس المال وتحديث حساب البنك بنجاح" });
    },
    onError: () => {
      toast({ title: "خطأ في إضافة حركة رأس المال", variant: "destructive" });
    }
  });

  const deleteCapitalEntryMutation = useMutation({
    mutationFn: db.deleteCapitalEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['capital-entries'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      toast({ title: "تم حذف حركة رأس المال وتحديث حساب البنك بنجاح" });
    },
    onError: () => {
      toast({ title: "خطأ في حذف حركة رأس المال", variant: "destructive" });
    }
  });

  return {
    data,
    // Expense functions
    addExpense: (expense: any) => addExpenseMutation.mutate(expense),
    deleteExpense: (id: string) => deleteExpenseMutation.mutate(id),
    
    // Pending customer functions
    addPendingCustomer: (customer: any) => addPendingCustomerMutation.mutate(customer),
    deletePendingCustomer: (id: string) => deletePendingCustomerMutation.mutate(id),
    addPayment: (payment: any) => addPaymentMutation.mutate(payment),
    deletePayment: (id: string) => deletePaymentMutation.mutate(id),
    
    // Completed customer functions
    addCompletedCustomer: (customer: any) => addCompletedCustomerMutation.mutate(customer),
    deleteCompletedCustomer: (id: string) => deleteCompletedCustomerMutation.mutate(id),
    
    // Employee functions
    addEmployee: (employee: any) => addEmployeeMutation.mutate(employee),
    deleteEmployee: (id: string) => deleteEmployeeMutation.mutate(id),
    addEmployeeTransaction: (transaction: any) => addEmployeeTransactionMutation.mutate(transaction),
    deleteEmployeeTransaction: (id: string) => deleteEmployeeTransactionMutation.mutate(id),
    
    // Coverage functions
    addCoverage: (coverage: any) => addCoverageMutation.mutate(coverage),
    deleteCoverage: (id: string) => deleteCoverageMutation.mutate(id),
    addCoverageTransaction: (transaction: any) => addCoverageTransactionMutation.mutate(transaction),
    deleteCoverageTransaction: (id: string) => deleteCoverageTransactionMutation.mutate(id),
    
    // Account functions
    addAccount: (account: any) => addAccountMutation.mutate(account),
    deleteAccount: (id: string) => deleteAccountMutation.mutate(id),
    
    // Capital entry functions
    addCapitalEntry: (entry: any) => addCapitalEntryMutation.mutate(entry),
    deleteCapitalEntry: (id: string) => deleteCapitalEntryMutation.mutate(id)
  };
};
