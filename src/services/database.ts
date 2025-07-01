
import { supabase } from '@/integrations/supabase/client';
import { 
  Employee, 
  Coverage, 
  Expense, 
  EmployeeTransaction,
  CoverageTransaction,
  PendingCustomer,
  CompletedCustomer,
  Account,
  CapitalEntry
} from '@/types/accounting';

export const saveExpense = async (expense: Expense) => {
  const { data, error } = await supabase
    .from('expenses')
    .insert([{
      description: expense.description,
      amount: expense.amount,
      date: expense.date
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getExpenses = async (): Promise<Expense[]> => {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(item => ({
    id: item.id,
    date: item.date,
    amount: item.amount,
    description: item.description
  }));
};

export const getPendingCustomers = async (): Promise<PendingCustomer[]> => {
  const { data, error } = await supabase
    .from('pending_customers')
    .select(`
      *,
      payments (*)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(customer => ({
    id: customer.id,
    name: customer.name,
    idNumber: customer.id_number,
    phoneNumber: customer.phone_number,
    payments: customer.payments?.map((payment: any) => ({
      id: payment.id,
      amount: payment.amount,
      source: payment.source
    })) || []
  }));
};

export const getCompletedCustomers = async (): Promise<CompletedCustomer[]> => {
  const { data, error } = await supabase
    .from('completed_customers')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(customer => ({
    id: customer.id,
    name: customer.name,
    idNumber: customer.id_number,
    phoneNumber: customer.phone_number,
    amount: customer.amount,
    fixedInterest: customer.fixed_interest,
    brokerInterest: customer.broker_percentage,
    productDifference: customer.product_difference,
    netProfit: customer.net_profit
  }));
};

export const saveEmployee = async (employee: Employee) => {
  const { data, error } = await supabase
    .from('employees')
    .insert([{
      name: employee.name,
      salary: employee.salary,
      advances: employee.advances || 0
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getEmployees = async (): Promise<Employee[]> => {
  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(employee => ({
    id: employee.id,
    name: employee.name,
    salary: employee.salary,
    advances: employee.advances || 0
  }));
};

export const saveCoverage = async (coverage: Coverage) => {
  const { data, error } = await supabase
    .from('coverages')
    .insert([{
      amount: coverage.amount,
      received_from: coverage.receivedFrom,
      received_by: coverage.receivedBy,
      remaining: coverage.remaining
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getCoverages = async (): Promise<Coverage[]> => {
  const { data, error } = await supabase
    .from('coverages')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(coverage => ({
    id: coverage.id,
    amount: coverage.amount,
    receivedFrom: coverage.received_from,
    receivedBy: coverage.received_by,
    remaining: coverage.remaining
  }));
};

export const saveEmployeeTransaction = async (transaction: EmployeeTransaction) => {
  const { data, error } = await supabase
    .from('employee_transactions')
    .insert([{
      employee_id: transaction.employeeId,
      amount: transaction.amount,
      type: transaction.type,
      description: transaction.description,
      date: transaction.date
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getEmployeeTransactions = async (): Promise<EmployeeTransaction[]> => {
  const { data, error } = await supabase
    .from('employee_transactions')
    .select(`
      *,
      employees (
        name
      )
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  
  return (data || []).map(transaction => ({
    id: transaction.id,
    employeeId: transaction.employee_id,
    amount: transaction.amount,
    type: transaction.type as "advance" | "salary_payment" | "deduction" | "bonus",
    description: transaction.description,
    date: transaction.date
  }));
};

export const saveCoverageTransaction = async (transaction: CoverageTransaction) => {
  const { data, error } = await supabase
    .from('coverage_transactions')
    .insert([{
      coverage_id: transaction.coverageId,
      amount: transaction.amount,
      type: transaction.type,
      description: transaction.description,
      date: transaction.date
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getCoverageTransactions = async (): Promise<CoverageTransaction[]> => {
  const { data, error } = await supabase
    .from('coverage_transactions')
    .select(`
      *,
      coverages (
        received_from
      )
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  
  return (data || []).map(transaction => ({
    id: transaction.id,
    coverageId: transaction.coverage_id,
    amount: transaction.amount,
    type: transaction.type as "payment" | "adjustment" | "refund",
    description: transaction.description,
    date: transaction.date
  }));
};

export const getAccounts = async (): Promise<Account[]> => {
  const { data, error } = await supabase
    .from('accounts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(account => ({
    id: account.id,
    name: account.name,
    balance: account.balance
  }));
};

export const getCapitalEntries = async (): Promise<CapitalEntry[]> => {
  const { data, error } = await supabase
    .from('capital_entries')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(entry => ({
    id: entry.id,
    date: entry.date,
    amount: entry.amount,
    type: entry.type as 'increase' | 'decrease',
    description: entry.description
  }));
};

// CRUD operations
export const deleteExpense = async (id: string) => {
  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const addPendingCustomer = async (customer: Omit<PendingCustomer, 'id' | 'payments'>) => {
  const { data, error } = await supabase
    .from('pending_customers')
    .insert([{
      name: customer.name,
      id_number: customer.idNumber,
      phone_number: customer.phoneNumber
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deletePendingCustomer = async (id: string) => {
  const { error } = await supabase
    .from('pending_customers')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const addPayment = async (payment: { customerId: string; amount: number; source: string }) => {
  const { data, error } = await supabase
    .from('payments')
    .insert([{
      customer_id: payment.customerId,
      amount: payment.amount,
      source: payment.source
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deletePayment = async (id: string) => {
  const { error } = await supabase
    .from('payments')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const addCompletedCustomer = async (customer: Omit<CompletedCustomer, 'id'>) => {
  const { data, error } = await supabase
    .from('completed_customers')
    .insert([{
      name: customer.name,
      id_number: customer.idNumber,
      phone_number: customer.phoneNumber,
      amount: customer.amount,
      fixed_interest: customer.fixedInterest,
      broker_percentage: customer.brokerInterest,
      product_difference: customer.productDifference,
      net_profit: customer.netProfit,
      total_payment: customer.amount + customer.fixedInterest
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteCompletedCustomer = async (id: string) => {
  const { error } = await supabase
    .from('completed_customers')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const addEmployee = async (employee: Omit<Employee, 'id'>) => {
  return await saveEmployee(employee);
};

export const deleteEmployee = async (id: string) => {
  const { error } = await supabase
    .from('employees')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const addEmployeeTransaction = async (transaction: Omit<EmployeeTransaction, 'id'>) => {
  return await saveEmployeeTransaction(transaction);
};

export const deleteEmployeeTransaction = async (id: string) => {
  const { error } = await supabase
    .from('employee_transactions')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const addCoverage = async (coverage: Omit<Coverage, 'id'>) => {
  return await saveCoverage(coverage);
};

export const deleteCoverage = async (id: string) => {
  const { error } = await supabase
    .from('coverages')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const addCoverageTransaction = async (transaction: Omit<CoverageTransaction, 'id'>) => {
  return await saveCoverageTransaction(transaction);
};

export const deleteCoverageTransaction = async (id: string) => {
  const { error } = await supabase
    .from('coverage_transactions')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const addAccount = async (account: Omit<Account, 'id'>) => {
  const { data, error } = await supabase
    .from('accounts')
    .insert([{
      name: account.name,
      balance: account.balance
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteAccount = async (id: string) => {
  const { error } = await supabase
    .from('accounts')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const addCapitalEntry = async (entry: Omit<CapitalEntry, 'id'>) => {
  const { data, error } = await supabase
    .from('capital_entries')
    .insert([{
      date: entry.date,
      amount: entry.amount,
      type: entry.type,
      description: entry.description
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteCapitalEntry = async (id: string) => {
  const { error } = await supabase
    .from('capital_entries')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const addExpense = async (expense: Omit<Expense, 'id'>) => {
  return await saveExpense(expense);
};
