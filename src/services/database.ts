import { supabase } from '@/integrations/supabase/client';
import { 
  Customer, 
  Employee, 
  Coverage, 
  Expense, 
  Transaction,
  EmployeeTransaction,
  CoverageTransaction
} from '@/types/accounting';

export const saveCustomer = async (customer: Customer) => {
  const { data, error } = await supabase
    .from('customers')
    .insert([{
      name: customer.name,
      phone: customer.phone,
      national_id: customer.national_id,
      coverage_amount: customer.coverage_amount,
      monthly_payment: customer.monthly_payment,
      payment_months: customer.payment_months,
      start_date: customer.start_date,
      status: customer.status,
      remaining_amount: customer.remaining_amount,
      paid_amount: customer.paid_amount
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getCustomers = async (): Promise<Customer[]> => {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const saveEmployee = async (employee: Employee) => {
  const { data, error } = await supabase
    .from('employees')
    .insert([{
      name: employee.name,
      position: employee.position,
      salary: employee.salary,
      phone: employee.phone,
      national_id: employee.national_id,
      hire_date: employee.hire_date
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
  return data || [];
};

export const saveCoverage = async (coverage: Coverage) => {
  const { data, error } = await supabase
    .from('coverages')
    .insert([{
      type: coverage.type,
      amount: coverage.amount,
      customer_name: coverage.customer_name,
      description: coverage.description,
      date: coverage.date
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
  return data || [];
};

export const saveExpense = async (expense: Expense) => {
  const { data, error } = await supabase
    .from('expenses')
    .insert([{
      description: expense.description,
      amount: expense.amount,
      category: expense.category,
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
  return data || [];
};

export const saveTransaction = async (transaction: Transaction) => {
  const { data, error } = await supabase
    .from('transactions')
    .insert([{
      customer_id: transaction.customer_id,
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

export const getTransactions = async (): Promise<Transaction[]> => {
  const { data, error } = await supabase
    .from('transactions')
    .select(`
      *,
      customers (
        name
      )
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  
  return (data || []).map(transaction => ({
    id: transaction.id,
    customer_id: transaction.customer_id,
    amount: transaction.amount,
    type: transaction.type,
    description: transaction.description,
    date: transaction.date,
    customer_name: transaction.customers?.name || 'غير محدد',
    created_at: transaction.created_at
  }));
};

export const saveEmployeeTransaction = async (transaction: EmployeeTransaction) => {
  const { data, error } = await supabase
    .from('employee_transactions')
    .insert([{
      employee_id: transaction.employee_id,
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
    employee_id: transaction.employee_id,
    amount: transaction.amount,
    type: transaction.type as "advance" | "salary_payment" | "deduction" | "bonus",
    description: transaction.description,
    date: transaction.date,
    employee_name: transaction.employees?.name || 'غير محدد',
    created_at: transaction.created_at
  }));
};

export const saveCoverageTransaction = async (transaction: CoverageTransaction) => {
  const { data, error } = await supabase
    .from('coverage_transactions')
    .insert([{
      coverage_id: transaction.coverage_id,
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
        customer_name
      )
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  
  return (data || []).map(transaction => ({
    id: transaction.id,
    coverage_id: transaction.coverage_id,
    amount: transaction.amount,
    type: transaction.type as "payment" | "adjustment" | "refund",
    description: transaction.description,
    date: transaction.date,
    coverage_customer_name: transaction.coverages?.customer_name || 'غير محدد',
    created_at: transaction.created_at
  }));
};

export const updateCustomer = async (id: number, customer: Partial<Customer>) => {
  const { data, error } = await supabase
    .from('customers')
    .update(customer)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteCustomer = async (id: number) => {
  const { error } = await supabase
    .from('customers')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const updateEmployee = async (id: number, employee: Partial<Employee>) => {
  const { data, error } = await supabase
    .from('employees')
    .update(employee)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteEmployee = async (id: number) => {
  const { error } = await supabase
    .from('employees')
    .delete()
    .eq('id', id);

  if (error) throw error;
};

export const updateCoverage = async (id: number, coverage: Partial<Coverage>) => {
  const { data, error } = await supabase
    .from('coverages')
    .update(coverage)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteCoverage = async (id: number) => {
  const { error } = await supabase
    .from('coverages')
    .delete()
    .eq('id', id);

  if (error) throw error;
};
