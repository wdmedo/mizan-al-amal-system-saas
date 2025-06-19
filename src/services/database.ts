
import { supabase } from '@/integrations/supabase/client';
import { 
  Expense, 
  PendingCustomer, 
  Payment, 
  CompletedCustomer, 
  Employee, 
  Coverage, 
  Account 
} from '@/types/accounting';

// Expenses
export const getExpenses = async (): Promise<Expense[]> => {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .order('date', { ascending: false });
  
  if (error) throw error;
  return data || [];
};

export const addExpense = async (expense: Omit<Expense, 'id'>): Promise<Expense> => {
  const { data, error } = await supabase
    .from('expenses')
    .insert(expense)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteExpense = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// Pending Customers
export const getPendingCustomers = async (): Promise<PendingCustomer[]> => {
  const { data: customers, error } = await supabase
    .from('pending_customers')
    .select(`
      *,
      payments (*)
    `)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return customers || [];
};

export const addPendingCustomer = async (customer: Omit<PendingCustomer, 'id' | 'payments'>): Promise<PendingCustomer> => {
  const { data, error } = await supabase
    .from('pending_customers')
    .insert(customer)
    .select()
    .single();
  
  if (error) throw error;
  return { ...data, payments: [] };
};

export const deletePendingCustomer = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('pending_customers')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// Payments
export const addPayment = async (payment: Omit<Payment, 'id'>): Promise<Payment> => {
  const { data, error } = await supabase
    .from('payments')
    .insert(payment)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deletePayment = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('payments')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// Completed Customers
export const getCompletedCustomers = async (): Promise<CompletedCustomer[]> => {
  const { data, error } = await supabase
    .from('completed_customers')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
};

export const addCompletedCustomer = async (customer: Omit<CompletedCustomer, 'id'>): Promise<CompletedCustomer> => {
  const { data, error } = await supabase
    .from('completed_customers')
    .insert(customer)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteCompletedCustomer = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('completed_customers')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// Employees
export const getEmployees = async (): Promise<Employee[]> => {
  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
};

export const addEmployee = async (employee: Omit<Employee, 'id'>): Promise<Employee> => {
  const { data, error } = await supabase
    .from('employees')
    .insert(employee)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteEmployee = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('employees')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// Coverages
export const getCoverages = async (): Promise<Coverage[]> => {
  const { data, error } = await supabase
    .from('coverages')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
};

export const addCoverage = async (coverage: Omit<Coverage, 'id'>): Promise<Coverage> => {
  const { data, error } = await supabase
    .from('coverages')
    .insert(coverage)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteCoverage = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('coverages')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// Accounts
export const getAccounts = async (): Promise<Account[]> => {
  const { data, error } = await supabase
    .from('accounts')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
};

export const addAccount = async (account: Omit<Account, 'id'>): Promise<Account> => {
  const { data, error } = await supabase
    .from('accounts')
    .insert(account)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteAccount = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('accounts')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};
